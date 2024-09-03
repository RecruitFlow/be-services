import { Controller, Get } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import {
  Payload,
  EventPattern,
  Ctx,
  KafkaContext,
} from '@nestjs/microservices';
import { FinderService } from './finder.service';
import { CampaignCreatedEvent } from '@app/interfaces';
import { Logger } from '@nestjs/common';

const logger = new Logger('FinderService');

@Controller('/finder')
export class FinderController {
  constructor(private readonly finderService: FinderService) {}

  @Get()
  getHello(): string {
    return this.finderService.getHello();
  }

  @Get('/metrics')
  async getMetrics() {
    return this.finderService.getMetrics();
  }

  @EventPattern('campaign_search', Transport.KAFKA)
  async job(
    @Payload() data: CampaignCreatedEvent,
    @Ctx() context: KafkaContext,
  ): Promise<boolean> {
    logger.log('Received Job!');
    // const channel = context.getChannelRef();
    // const originalMsg = context.getMessage();

    this.finderService.processJob(data);

    // channel.ack(originalMsg);

    return true;
  }
}
