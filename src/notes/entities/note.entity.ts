export class NoteEntity {
  id: string;

  title: string;

  text: string;

  patientId: string;

  doctorId: string;

  createdAt: string;

  createdBy: string;

  updatedAt?: string;

  updatedBy?: string;

  isExist: boolean;
}
