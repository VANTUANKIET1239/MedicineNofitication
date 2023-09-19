export class Prescription {
  prescriptionId: number;
  prescriptionName: string;
  doctorName: string;
  medicineStoreName: string;
  isComplete: boolean;
  fromDate: Date;
  toDate: Date;
  buyDate: Date;
  isAllDate: boolean;
  userId: number;

  constructor(
    prescriptionId: number,
    prescriptionName: string,
    doctorName: string,
    medicineStoreName: string,
    isComplete: boolean,
    fromDate: Date,
    toDate: Date,
    buyDate: Date,
    isAllDate: boolean,
    userId: number
  ) {
    this.prescriptionId = prescriptionId;
    this.prescriptionName = prescriptionName;
    this.doctorName = doctorName;
    this.medicineStoreName = medicineStoreName;
    this.isComplete = isComplete;
    this.fromDate = fromDate;
    this.toDate = toDate;
    this.buyDate = buyDate;
    this.isAllDate = isAllDate;
    this.userId = userId;
  }
}
