import {
  IsString,
  IsNumber,
  IsArray,
  IsOptional,
  ValidateNested,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import type { WorkTime, WorkLocation } from '@prisma/client';

class EducationDTO {
  @IsString()
  institution: string;

  @IsString()
  fieldOfStudy: string;

  @IsString()
  level: string;

  @IsString()
  duration: string;

  @IsString()
  startDate: string;

  @IsString()
  endDate: string;
}

class ExperienceDTO {
  @IsString()
  company: string;

  @IsString()
  position: string;

  @IsString()
  duration: string;

  @IsString()
  startDate: string;

  @IsString()
  endDate: string;

  @IsString()
  description: string;
}

export class CreateCandidateInput {
  @IsString()
  name: string;

  @IsString()
  campaignId: string;

  @IsNumber()
  age: number = 0;

  @IsString()
  workTime: WorkTime;

  @IsString()
  workLocation: WorkLocation;

  @IsString()
  position: string;

  @IsNumber()
  @IsOptional()
  salary?: number = 0;

  @IsNumber()
  @IsOptional()
  yearsOfExperience?: number = 0;

  @IsArray()
  @IsString({ each: true })
  skills: string[];

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EducationDTO)
  education?: EducationDTO[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExperienceDTO)
  experience?: ExperienceDTO[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  languages?: string[];
}
