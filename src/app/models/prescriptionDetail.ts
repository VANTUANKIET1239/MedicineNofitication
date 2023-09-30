export class PrescriptionDetail {
  private _prescriptionDetailId?: string | undefined;
  private _prescriptionId?: string | undefined;
  private _medicineName?: string | undefined;
  private _quantityPerDose?: number | undefined;
  private _isDone?: string | undefined;

  constructor(
    prescriptionDetailId?: string,
    prescriptionId?: string,
    medicineName?: string,
    quantityPerDose?: number,
    isDone?: string
  ) {
    this._prescriptionDetailId = prescriptionDetailId;
    this._prescriptionId = prescriptionId;
    this._medicineName = medicineName;
    this._quantityPerDose = quantityPerDose;
    this._isDone = isDone;
  }

  get prescriptionDetailId(): string | undefined {
    return this._prescriptionDetailId;
  }

  set prescriptionDetailId(value: string | undefined) {
    this._prescriptionDetailId = value;
  }

  get prescriptionId(): string | undefined {
    return this._prescriptionId;
  }

  set prescriptionId(value: string | undefined) {
    this._prescriptionId = value;
  }

  get medicineName(): string | undefined {
    return this._medicineName;
  }

  set medicineName(value: string | undefined) {
    this._medicineName = value;
  }

  get quantityPerDose(): number | undefined {
    return this._quantityPerDose;
  }

  set quantityPerDose(value: number | undefined) {
    this._quantityPerDose = value;
  }

  get isDone(): string | undefined {
    return this._isDone;
  }

  set isDone(value: string | undefined) {
    this._isDone = value;
  }
}
