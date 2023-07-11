import { Inject, Injectable } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { ClientKafka, ClientNats } from '@nestjs/microservices';
import { NoteEntity, noteTypes } from './entities/note.entity';
import { v4 } from 'uuid';
import { firstValueFrom } from 'rxjs';
import { NoteListEntity } from './entities/note-list.entity';

@Injectable()
export class NotesService {
  private readonly topicName = 'notes';

  constructor(
    @Inject('KAFKA_NOTES_SERVICE') private readonly clientKafka: ClientKafka,
    @Inject('NATS_NOTES_SERVICE') private readonly clientNats: ClientNats,
  ) {}

  async create(createNoteDto: CreateNoteDto) {
    const id = v4();
    const noteEntity: NoteEntity = {
      ...createNoteDto,
      createdAt: new Date().toISOString(),
      createdBy: createNoteDto.doctorId,
      isExist: true,
      id: id,
    };
    const response$ = this.clientKafka.emit<NoteEntity>(this.topicName, {
      key: `create#${noteEntity.id}`,
      value: noteEntity,
    });
    await firstValueFrom(response$);
    return noteEntity;
  }

  findAll(patientId?: string, doctorId?: string) {
    return this.clientNats.send<NoteEntity[]>('findAllNotes', {
      patientId,
      doctorId,
    });
  }

  findOne(id: string) {
    return this.clientNats.send<NoteEntity>('findOneNote', id);
  }

  async update(id: string, updateNoteDto: UpdateNoteDto) {
    const response$ = this.clientKafka.emit<Partial<NoteEntity>>(
      this.topicName,
      {
        key: `update#${id}`,
        value: {
          ...updateNoteDto,
          updatedAt: new Date().toISOString(),
        },
      },
    );
    await firstValueFrom(response$);
    return this.findOne(id);
  }

  async remove(id: string) {
    const response$ = this.clientKafka.emit<Partial<NoteEntity>>(
      this.topicName,
      {
        key: `update#${id}`,
        value: {
          isExist: false,
        },
      },
    );
    await firstValueFrom(response$);
    return 'Note has been deleted successfully';
  }

  getNoteTypes(): NoteListEntity[] {
    return Object.entries(noteTypes).map(([value, description]) => ({
      description,
      value,
    }));
  }
}
