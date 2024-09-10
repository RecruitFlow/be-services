import { Module } from '@nestjs/common';
import { CampaignService } from './campaign.service';
import { CampaignResolver } from './campaign.resolver';
import { CampaignConsumer } from './campaign.consumer';
import { Transport, ClientsModule } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { PrismaModule } from '@app/prisma';

@Module({
  imports: [
    PrismaModule,
    ClientsModule.registerAsync([
      {
        inject: [ConfigService],
        name: 'FINDER_SERVICE',
        useFactory: (configService: ConfigService) => {
          console.log(configService.get('KAFKA_URI'));
          return {
            transport: Transport.KAFKA,
            options: {
              client: {
                clientId: 'gateway',
                brokers: [configService.get('KAFKA_URI')],
              },
              consumer: {
                groupId: 'finder',
              },
            },
          };
        },
      },
    ]),
  ],
  providers: [CampaignResolver, CampaignService],
  controllers: [CampaignConsumer],
})
export class CampaignModule {}
