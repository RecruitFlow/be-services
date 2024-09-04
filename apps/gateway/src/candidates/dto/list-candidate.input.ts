import { Field, Int, InputType } from '@nestjs/graphql';

@InputType()
export class ListCandidateInput {
  @Field(() => Int)
  offset: number;

  @Field(() => Int)
  limit: number;

  @Field(() => String, { nullable: true })
  sortKey: 'yearsOfExperience' | 'salary' | 'ncreatedAtame';

  @Field(() => String, { nullable: true })
  sortValue: 'asc' | 'desc';
}
