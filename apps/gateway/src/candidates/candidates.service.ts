import { Injectable } from '@nestjs/common';
import { CreateCandidateInput } from './dto/create-candidate.input';
import { UpdateCandidateInput } from './dto/update-candidate.input';
import { ListCandidateInput } from './dto/list-candidate.input';
import { Logger } from '@nestjs/common';
import { PrismaService } from '@app/prisma';
import { ClientKafka } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { CandidateCreatedEvent } from '@app/interfaces';

@Injectable()
export class CandidatesService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('ANALYTIC_QUEUE') private analyticQueue: ClientKafka,
  ) {}

  async create(createCandidateInput: CreateCandidateInput) {
    const candidate = await this.prisma.candidate.create({
      data: {
        name: createCandidateInput.name,
        age: createCandidateInput.age,
        workTime: createCandidateInput.workTime,
        workLocation: createCandidateInput.workLocation,
        position: createCandidateInput.position,
        salary: createCandidateInput.salary,
        yearsOfExperience: createCandidateInput.yearsOfExperience,
        skills: createCandidateInput.skills,
        location: createCandidateInput.location,
        languages: createCandidateInput.languages,

        campaign: {
          connect: {
            id: createCandidateInput.campaignId,
          },
        },
      },
    });

    let subWrites = [];

    if (createCandidateInput.education) {
      subWrites.push(
        this.prisma.education.createMany({
          data: createCandidateInput.education.map((item) => {
            return {
              candidateId: candidate.id,
              ...item,
            };
          }),
        }),
      );
    }

    if (createCandidateInput.experience) {
      subWrites.push(
        this.prisma.experience.createMany({
          data: createCandidateInput.experience.map((item) => {
            return {
              candidateId: candidate.id,
              ...item,
            };
          }),
        }),
      );
    }

    await Promise.all(subWrites);

    this.analyticQueue
      .emit('candidate_create', candidate as CandidateCreatedEvent)
      .subscribe();

    return candidate;
  }

  async findAll(listCandidateInput: ListCandidateInput) {
    return this.prisma.candidate.findMany({
      skip: listCandidateInput.offset,
      take: listCandidateInput.limit,
      orderBy: {
        [listCandidateInput.sortKey]: listCandidateInput.sortValue,
      },
    });
  }

  async count() {
    return { count: await this.prisma.candidate.count() };
  }

  findOne(id: number) {
    return `This action returns a #${id} candidate`;
  }

  update(id: number, updateCandidateInput: UpdateCandidateInput) {}

  remove(ids: string[]) {
    return this.prisma.campaign.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }
}
