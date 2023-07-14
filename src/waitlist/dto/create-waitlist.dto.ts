import { IsNotEmpty, IsString } from 'class-validator';

export class CreateWaitListDto {

  @IsNotEmpty()
  @IsString()
  patientId: string;

  @IsNotEmpty()
  @IsString()
  doctorId: string;
}
