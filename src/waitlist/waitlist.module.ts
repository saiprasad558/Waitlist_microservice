import { Module } from '@nestjs/common';
import { WaitlistController } from './waitlist.controller';
import { WaitlistService } from './waitlist.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'KAFKA_WAITLIST_SERVICE',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => {
          return {
            transport: Transport.KAFKA,
            options: {
              client: {
                clientId: configService.get<string>('kafka.clientId'),
                brokers: configService.get<string[]>('kafka.brokers'),
              },
              producerOnlyMode: true,
              producer: {
                allowAutoTopicCreation: true,
              },
            },
          };
        },
        inject: [ConfigService],
      },
      {
        name: 'NATS_WAITLIST_SERVICE',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => {
          return {
            transport: Transport.NATS,
            options: {
              servers: [configService.get<string>('nats.server')],
              queue: configService.get<string>('nats.queue'),
            },
          };
        },
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [WaitlistController],
  providers: [WaitlistService],
})
export class WaitlistModule {}
