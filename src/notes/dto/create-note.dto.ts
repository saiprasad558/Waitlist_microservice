import { IsNotEmpty, IsString } from 'class-validator';
import { noteTypes } from '../entities/note.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNoteDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  text: string;

  @ApiProperty({
    enum: Object.keys(noteTypes),
  })
  @IsNotEmpty()
  @IsString()
  type: keyof typeof noteTypes;

  @IsNotEmpty()
  @IsString()
  patientId: string;

  @IsNotEmpty()
  @IsString()
  doctorId: string;
}
