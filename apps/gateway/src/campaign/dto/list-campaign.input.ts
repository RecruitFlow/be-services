import { Field, Int, InputType, ObjectType } from '@nestjs/graphql';

import type { CampaignStatus, CampaignEndType } from '@app/prisma';

@InputType()
export class Filters {
  @Field(() => String)
  id: 'status' | 'endType';

  @Field(() => [String])
  value: CampaignStatus[] | CampaignEndType[];
}

@InputType()
export class ListCampaignInput {
  @Field(() => Int)
  offset: number;

  @Field(() => Int)
  limit: number;

  @Field(() => [Filters])
  filters: Filters[];

  @Field(() => String, { nullable: true })
  sortKey: 'status' | 'endType' | 'name';

  @Field(() => String, { nullable: true })
  sortValue: CampaignStatus | CampaignEndType | string;
}
