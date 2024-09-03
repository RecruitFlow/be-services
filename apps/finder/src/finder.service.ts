import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { CampaignCreatedEvent } from '@app/interfaces';

@Injectable()
export class FinderService {
  constructor(@InjectQueue('campaign:search') private finderQueue: Queue) {}

  getHello(): string {
    return 'Hello World!';
  }

  async getMetrics() {
    return this.finderQueue.getMetrics('completed', 0, 10);
  }

  async processJob(data: CampaignCreatedEvent) {
    await this.finderQueue.add('scrap', data);
  }
}
