import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  prescriptionForm!: FormGroup;
  constructor(private formBuilder: FormBuilder) {
    this.prescriptionForm = this.formBuilder.group({
      prescriptionName: ['', Validators.required],
      doctorName: ['', Validators.required],
      medicineStoreName: ['', Validators.required],
      fromDate: [new Date().toISOString(), Validators.required],
      toDate: [new Date().toISOString(), Validators.required],
      buyDate: [new Date().toISOString(), Validators.required],
    });
  }
  submitForm(){

  }
}
