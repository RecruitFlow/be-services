import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { FinderController } from './finder.controller';
import { FinderService } from './finder.service';
import { FinderConsumer } from './finder.processor';
import { ConfigModule } from '@nestjs/config';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { Transport, ClientsModule } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ClientsModule.register([
      {
        name: 'CAMPAIGN_QUEUE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'finder',
            brokers: [process.env.KAFKA_URI],
          },
          consumer: {
            groupId: 'gateway',
          },
        },
      },
    ]),
    BullModule.forRoot({
      connection: {
        host: 'redis',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'campaign:search',
    }),
    PrometheusModule.register(),
  ],
  controllers: [FinderController],
  providers: [FinderService, FinderConsumer],
})
export class FinderModule {}
