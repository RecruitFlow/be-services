import { IsString, IsNumber, IsOptional, IsDate } from 'class-validator';
import type {
  CampaignStatus,
  CampaignEndType,
  Providers,
} from '@prisma/client';

export class CampaignCreatedEvent {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  keyword: string;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;

  @IsString()
  status: CampaignStatus;

  @IsString()
  endType: CampaignEndType;

  @IsOptional()
  @IsString()
  endValue: number | null;

  @IsString({ each: true })
  providers: Providers[];
}
