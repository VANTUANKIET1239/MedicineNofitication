import { PrescriptionDetail } from "./prescriptionDetail";

export class Prescription {
  private _prescriptionId?: string | undefined;
  private _prescriptionName!: string | undefined;
  private _doctorName!: string | undefined;
  private _medicineStoreName!: string | undefined;
  private _isComplete!: string | undefined;
  private _fromDate!: string | undefined;
  private _toDate!: string | undefined;
  private _isAllDate!: boolean | undefined;
  private _userId!: string | undefined;
  private _time: string[] | undefined;
  private _prescriptionDetails!: PrescriptionDetail[];

  constructor(
    prescriptionId?: string,
    prescriptionName?: string,
    doctorName?: string,
    medicineStoreName?: string,
    isComplete?: string,
    fromDate?: string,
    toDate?: string,
    isAllDate?: boolean,
    userId?: string,
    time?: string[],
    prescriptionDetails? :PrescriptionDetail[]
  ) {
    this._prescriptionId = prescriptionId;
    this._prescriptionName = prescriptionName;
    this._doctorName = doctorName;
    this._medicineStoreName = medicineStoreName;
    this._isComplete = isComplete;
    this._fromDate = fromDate;
    this._toDate = toDate;
    this._isAllDate = isAllDate;
    this._userId = userId;
    this._time = time ? time : [];
    this._prescriptionDetails = prescriptionDetails ? prescriptionDetails : [];
  }

  get prescriptionId(): string {
    return this._prescriptionId ?? "";
  }

  set prescriptionId(value: string | undefined) {
    this._prescriptionId = value;
  }

  get prescriptionName(): string | undefined {
    return this._prescriptionName;
  }

  set prescriptionName(value: string | undefined) {
    this._prescriptionName = value;
  }

  get doctorName(): string | undefined {
    return this._doctorName;
  }

  set doctorName(value: string | undefined) {
    this._doctorName = value;
  }

  get medicineStoreName(): string | undefined {
    return this._medicineStoreName;
  }

  set medicineStoreName(value: string | undefined) {
    this._medicineStoreName = value;
  }

  get isComplete(): string | undefined {
    return this._isComplete;
  }

  set isComplete(value: string | undefined) {
    this._isComplete = value;
  }

  get fromDate(): string | undefined {
    return this._fromDate;
  }

  set fromDate(value: string | undefined) {
    this._fromDate = value;
  }

  get toDate(): string | undefined {
    return this._toDate;
  }

  set toDate(value: string | undefined) {
    this._toDate = value;
  }

  get isAllDate(): boolean | undefined {
    return this._isAllDate;
  }

  set isAllDate(value: boolean | undefined) {
    this._isAllDate = value;
  }

  get userId(): string | undefined {
    return this._userId;
  }

  set userId(value: string | undefined) {
    this._userId = value;
  }

  get time(): string[] | undefined {
    return this._time;
  }

  set time(value: string[] | undefined) {
    this._time = value;
  }
  set prescriptionDetails(value:PrescriptionDetail[]){
      this._prescriptionDetails = value;
  }
  get prescriptionDetails(): PrescriptionDetail[] {
    return this._prescriptionDetails;
  }
  addTimeItem(item:string){
    this._time?.push(item);
  }
  getAllTime(){
    return this._time;
  }
}
