import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka, ClientNats } from '@nestjs/microservices';
import { v4 } from 'uuid';
import { firstValueFrom, map } from 'rxjs';
import { WaitListEntity } from './entities/waitlist.entity';
import { CreateWaitListDto } from './dto/create-waitlist.dto';

@Injectable()
export class WaitlistService {
  private readonly topicName = 'waitlist';

  constructor(
    @Inject('KAFKA_WAITLIST_SERVICE') private readonly clientKafka: ClientKafka,
    @Inject('NATS_WAITLIST_SERVICE') private readonly clientNats: ClientNats,
  ) {}

  async create(createWaitListDto: CreateWaitListDto) {
    const id = v4();
    const WaitListEntity: WaitListEntity = {
      ...createWaitListDto,
      createdAt: new Date().toISOString(),
      createdBy: createWaitListDto.doctorId,
      isExist: true,
      id: id,
    };
    const response$ = this.clientKafka.emit<WaitListEntity>(this.topicName, {
      key: `create#${WaitListEntity.id}`,
      value: WaitListEntity,
    });
    await firstValueFrom(response$);
    return WaitListEntity;
  }

  async findAll(patientId?: string, doctorId?: string) {
    return this.clientNats
      .send<WaitListEntity[]>('findAllWaitList', {
        patientId,
        doctorId,
      })
      .pipe(
        map((waitlist) =>
          [...waitlist].sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          ),
        ),
      );
  }

}
