export class WaitListEntity {
  id: string;
  patientId: string;
  doctorId: string;
  createdAt: string;
  createdBy?: string;
  updatedAt?: string;
  isExist: boolean;
}
