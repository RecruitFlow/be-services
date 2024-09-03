import { IsString, IsNumber, IsOptional, IsDate } from 'class-validator';
import type { WorkTime, WorkLocation } from '@prisma/client';

export class CandidateCreatedEvent {
  @IsString()
  name: string;

  @IsString()
  campaignId: string;

  @IsNumber()
  age: number | null;

  @IsString()
  workTime: WorkTime;

  @IsString()
  workLocation: WorkLocation;

  @IsString()
  position: string;

  @IsNumber()
  @IsOptional()
  salary: number;

  @IsNumber()
  yearsOfExperience: number | null;

  @IsString()
  location: string | null;

  @IsDate()
  createdAt: Date;
}
