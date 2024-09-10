import { WorkuaScrapper } from './scrapper/workua.scrapper';
import { AnthropicParser } from './parser/anthropic.parser';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { CampaignCreatedEvent } from '@app/interfaces';
import { Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import puppeteer from 'puppeteer';
import { schema } from './schemas/candidate.schema';
import { CampaignEndEvent, CandidateCreatedEvent } from '@app/interfaces';

const logger = new Logger('FinderService');

@Processor('campaign:search', { concurrency: 5 })
export class FinderConsumer extends WorkerHost {
  constructor(@Inject('CAMPAIGN_QUEUE') private campaignQueue: ClientKafka) {
    super();
  }

  async process(job: Job<CampaignCreatedEvent, any, string>) {
    try {
      await job.updateProgress(0);

      const browser = await puppeteer.launch({ args: ['--no-sandbox'] });

      const scrapper = new WorkuaScrapper(browser);

      const parser = new AnthropicParser('claude-3-haiku-20240307', schema);

      for await (const result of scrapper.scrapByKeyword(job.data.keyword)) {
        try {
          const candidate = await parser.parse(result);

          this.campaignQueue
            .emit('candidate_action_save', {
              ...candidate,
              campaignId: job.data.id,
            } as CandidateCreatedEvent)
            .subscribe(logger.log);

          logger.log('Send to Queue');
        } catch (error) {
          logger.log(`ERROR: ${error}`);
        } finally {
          continue;
        }
      }

      await job.updateProgress(100);

      this.campaignQueue
        .send('campaign_end', {
          id: job.data.id,
          status: 'ENDED',
        } as CampaignEndEvent)
        .subscribe(logger.log);

      await browser.close();

      return true;
    } catch (error) {
      logger.error(`Error in Processor: ${error}`);
      job.moveToFailed(error, job.token);
    }
  }
}
