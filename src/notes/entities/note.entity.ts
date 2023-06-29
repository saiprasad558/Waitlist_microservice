import { ApiProperty } from '@nestjs/swagger';

export const noteTypes = {
  PROGRESS_NOTE: 'Progress notes',
  CLINICAL_NOTE: 'Clinical notes',
  VISIT_NOTE: 'Visit notes',
  SPECIALIST_NOTE: 'Specialist notes',
  CLINICIAN_NOTE: 'Clinician notes',
  INJURY_NOTE: 'Injury notes',
  PROCEDURE_NOTE: 'Procedure notes',
  INSTRUCTION_NOTE: 'Instructions',
  CURRENT_CONDITION_NOTE: 'Current condition notes',
  TRANSCRIPTION_NOTE: 'Transcriptions',
  PATIENT_NOTE: 'Patient notes',
  PATIENT_HOUSEHOLD_NOTE: 'Patient household notes',
} as const;

export class NoteEntity {
  id: string;

  title: string;

  text: string;

  @ApiProperty({
    enum: Object.keys(noteTypes),
  })
  type: keyof typeof noteTypes;

  patientId: string;

  doctorId: string;

  createdAt: string;

  createdBy: string;

  updatedAt?: string;

  updatedBy?: string;

  isExist: boolean;
}
