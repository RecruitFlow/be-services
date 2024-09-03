import { Controller } from '@nestjs/common';
import { CandidateService } from './candidate.service';
import { CreateCandidateInput } from './dto/create-candidate.input';
import { CandidateCreatedEvent } from '@app/interfaces';
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
export class CandidateConsumer {
  constructor(private readonly candidateService: CandidateService) {}

  @EventPattern('candidate_create', Transport.KAFKA)
  async createCandidate(
    @Payload() data: CandidateCreatedEvent,
    @Ctx() context: KafkaContext,
  ) {
    try {
      logger.log(`Input Data: ${JSON.stringify(data)}`);

      await this.candidateService.create(data);
    } catch (error) {
      logger.error(error);
    } finally {
      return true;
    }
  }
}
