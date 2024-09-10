import { IsString } from 'class-validator';

import { CampaignStatus } from '@app/prisma';

export class CampaignEndEvent {
  @IsString()
  id: string;

  @IsString()
  status: CampaignStatus;
}
