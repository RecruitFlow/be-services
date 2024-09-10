import { Injectable } from '@nestjs/common';
import { CreateCampaignInput } from './dto/create-campaign.input';
import { UpdateCampaignInput } from './dto/update-campaign.input';
import { ListCampaignInput } from './dto/list-campaign.input';
import { PrismaService, CampaignStatus } from '@app/prisma';
import { CampaignCreatedEvent } from '@app/interfaces';
import { Controller, Get, Post, Inject, Body } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

const logger = new Logger('Finder');

@Injectable()
export class CampaignService {
  constructor(
    @Inject('FINDER_SERVICE') private messageBroker: ClientKafka,
    private readonly prisma: PrismaService,
  ) {}

  async create(createCampaignInput: CreateCampaignInput) {
    const campaign = await this.prisma.campaign.create({
      data: createCampaignInput,
    });

    this.messageBroker
      .emit('campaign_search', campaign as CampaignCreatedEvent)
      .subscribe(logger.log);

    return campaign;
  }

  findAll({ filters, sortValue, sortKey, offset, limit }: ListCampaignInput) {
    return this.prisma.campaign.findMany({
      ...(filters.length && {
        where: {
          AND: filters.map(({ id, value }) => ({
            [id]: {
              in: value,
            },
          })),
        },
      }),
      ...(sortKey && { orderBy: { [sortKey]: sortValue } }),
      skip: offset,
      take: limit,
    });
  }

  count() {
    return this.prisma.campaign.count();
  }

  async findOne(id: string) {
    return this.prisma.campaign.findFirst({
      where: { id },
    });
  }

  async update(id: string, updateCampaignInput: UpdateCampaignInput) {
    return this.prisma.campaign.update({
      where: { id },
      data: updateCampaignInput,
    });
  }

  async remove(ids: string[]) {
    return this.prisma.campaign.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }

  async changeStatus(id: string, status: CampaignStatus) {
    return this.prisma.campaign.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });
  }
}
