export interface IPrescription{
  prescriptionId?: number;
  doctorName: string;
  fromDate: Date;
  isAllDate: boolean;
  isComplete: string;
  medicineStoreName: string;
  prescriptionName: string;
   time: string[];
   userId: string;
}
