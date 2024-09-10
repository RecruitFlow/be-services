import { Controller } from '@nestjs/common';
import { CampaignService } from './campaign.service';
import { CampaignEndEvent } from '@app/interfaces';
import {
  Transport,
  EventPattern,
  KafkaContext,
  Payload,
  Ctx,
} from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

const logger = new Logger('Consumer');

@Controller()
export class CampaignConsumer {
  constructor(private readonly campaignService: CampaignService) {}

  @EventPattern('campaign_end', Transport.KAFKA)
  async createCandidate(
    @Payload() data: CampaignEndEvent,
    @Ctx() context: KafkaContext,
  ) {
    try {
      logger.log(`End campaign ${data.id}`);

      await this.campaignService.changeStatus(data.id, data.status);
    } catch (error) {
      logger.error(error);
    } finally {
      return true;
    }
  }
}
