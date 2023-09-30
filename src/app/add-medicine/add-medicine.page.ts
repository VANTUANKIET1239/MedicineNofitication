import { async } from '@angular/core/testing';
import { PrescriptionDetail } from './../models/prescriptionDetail';

import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoadingController, ModalController } from '@ionic/angular';
import { format, getDate, parseISO, toDate } from 'date-fns';
import { Prescription } from '../models/prescription';
import { Toast } from '@capacitor/toast';
import { MedicineServiceService } from '../Services/medicine-service/MedicineService.service';
import { Auth } from '@angular/fire/auth';
import { from } from 'rxjs';
import { ComponentBase } from '../shared/ComponentBase/ComponentBase';
import { ActivatedRoute } from '@angular/router';

// import { MedicineServiceService } from '../Services/medicine-service/MedicineService.service';

@Component({
  selector: 'app-add-medicine',
  templateUrl: './add-medicine.page.html',
  styleUrls: ['./add-medicine.page.scss'],
})
export class AddMedicinePage extends ComponentBase implements OnInit {

  prescriptionForm!: FormGroup;
  model:Prescription = new Prescription();
  private auth:Auth = inject(Auth);
  user$ =this.auth.currentUser;

  constructor(private formBuilder: FormBuilder,
    private modalController: ModalController,
    private readonly loadingCtrl: LoadingController,
    private MedicineService: MedicineServiceService,
    private routeAct: ActivatedRoute
      ) {
    super();
    this.prescriptionForm = this.formBuilder.group({
      prescriptionName: ['', Validators.required],
      doctorName: ['', Validators.required],
      medicineStoreName: ['', Validators.required],
      isAllDate: [true],
      fromDate: [new Date().toISOString()],
      toDate: [new Date().toISOString()],
      pickTime: [new Date().toISOString()],
      medicineArrays: this.formBuilder.array([])
    });
  }
  get medicineArrays(): FormArray {
    return this.prescriptionForm.get('medicineArrays') as FormArray;
  }
  ngOnInit(): void {
   // console.log(this.user$);
      // const k = from(this.MedicineService.Prescription_List());
      // k.subscribe(x => {
      //     console.log(x);
      // });
      this.routeAct.queryParams.subscribe( async (params) => {
           let id =  params['id'];
           if(id){
            this.model = await this.MedicineService.Prescription_ById(id);
            this.PatchValueModel(this.model);
           }
     });
  }
  PatchValueModel(model:Prescription){
    const arr = this.medicineArrays;
    if(Array.isArray(model.prescriptionDetails)){
      console.log(model.prescriptionDetails);
      model.prescriptionDetails.forEach(x => {
        const medicineGroup = this.formBuilder.group({
          prescriptionDetailId: [x.prescriptionDetailId],
          medicine: [x.medicineName, Validators.required],
          quantity: [x.quantityPerDose,[Validators.required,Validators.maxLength(2)]]
        });
        arr.push(medicineGroup)
    });
      this.prescriptionForm.patchValue({
        prescriptionName: model.prescriptionName,
        doctorName:model.doctorName ,
        medicineStoreName: model.medicineStoreName,
        isAllDate: model.isAllDate,
        fromDate: model.fromDate,
        toDate: model.toDate,
      });
    }
  }
  // ValidateAlert(){
  //   if(this.medicineArrays.controls.some(x => x.get('medicine')?.hasError('required') || this.medicineArrays.controls.some(x => x.get('quantity')?.hasError('required')))){
  //         this.ShowNofitication('Thông tin thuốc cần được nhập');
  //         return
  //   }
  // }
  checkInputValue(){
    var mediarrays = this.medicineArrays;
    if(mediarrays.controls.length  == 0){
          this.ShowNofitication('bạn chưa chọn thuốc');
          return true;
    }
    else if(this.model.time?.length == 0){
      this.ShowNofitication('bạn chưa chọn thời gian');
      return true;
    }
    else if(this.medicineArrays.controls.some(x => x.get('medicine')?.hasError('required') || this.medicineArrays.controls.some(x => x.get('quantity')?.hasError('required')))){
      this.ShowNofitication('Thông tin thuốc cần được nhập');
      return true;
    }
    else if(this.prescriptionForm.controls['prescriptionName'].hasError('required')){
      this.ShowNofitication('Thông tin tên đơn thuốc cần được nhập');
      return true;
    }
    return false;
  }
    SaveInput(){
      if(this.model.prescriptionId){
          this.EditPres();
      }
      else{
          this.AddPres();
      }
    }
    async EditPres(){
      if(this.checkInputValue()){
        return;
      }
      const loading = await this.loadingCtrl.create();
      var formValue = this.prescriptionForm.value;
      var modelDT:PrescriptionDetail[] = [];
      var mediarrays = this.medicineArrays;
      mediarrays.controls.forEach(x => {
          let item = x.value;
          if(!item.prescriptionDetailId){
            let modelDTitem:PrescriptionDetail = new PrescriptionDetail();
            modelDTitem.prescriptionDetailId = item.prescriptionDetailId;
            modelDTitem.medicineName = item.medicine;
            modelDTitem.quantityPerDose = item.quantity;
            modelDTitem.isDone = '0';
            modelDT.push(modelDTitem);
          }
      });

       this.model.prescriptionName = formValue.prescriptionName;
       this.model.doctorName = formValue.doctorName;
       this.model.medicineStoreName = formValue.medicineStoreName;
       this.model.isAllDate = formValue.isAllDate;
       this.model.fromDate = formValue.fromDate;
       this.model.toDate = formValue.toDate;
      this.model.prescriptionDetails.push(...modelDT);
      this.model.userId = this.user$?.uid;
        await loading.present();
        var result = await this.MedicineService.Prescription_Upd(this.model);
        await loading.dismiss();
       if(result){
            this.ShowNofitication("Chỉnh sửa đơn thuốc thành công");
       }
       else{
        this.ShowNofitication("Chỉnh sửa thuốc thất bại");
       }
    }
  async AddPres(){
    if(this.checkInputValue()){
      return;
    }
    const loading = await this.loadingCtrl.create();
    var formValue = this.prescriptionForm.value;
    var modelDT:PrescriptionDetail[] = [];
    var mediarrays = this.medicineArrays;
    mediarrays.controls.forEach(x => {
        let item = x.value;
        let modelDTitem:PrescriptionDetail = new PrescriptionDetail();
        modelDTitem.medicineName = item.medicine;
        modelDTitem.quantityPerDose = item.quantity;
        modelDTitem.isDone = '0';
        modelDT.push(modelDTitem);
    });

     this.model.prescriptionName = formValue.prescriptionName;
     this.model.doctorName = formValue.doctorName;
     this.model.medicineStoreName = formValue.medicineStoreName;
     this.model.isAllDate = formValue.isAllDate;
     this.model.fromDate = formValue.fromDate;
     this.model.toDate = formValue.toDate;
    this.model.prescriptionDetails = modelDT;
    this.model.userId = this.user$?.uid;
      await loading.present();
      var result = await this.MedicineService.Prescription_Add(this.model);
      await loading.dismiss();
     if(result){
          this.ShowNofitication("Thêm đơn thuốc thành công");
     }
     else{
      this.ShowNofitication("Thêm đơn thuốc thất bại");
     }
  }
  async UpdPres(){

  }
  deleteItemArrays(index:number,type:string){
     if(type == 'medicine'){
      const formArray = this.medicineArrays;
        formArray.removeAt(index);
     }
     else if(type == 'time'){
      this.model.time?.splice(index,1);
     }
  }
  addMedicine(){
    const formArray = this.prescriptionForm.get('medicineArrays') as FormArray;

      const medicineGroup = this.formBuilder.group({
        prescriptionDetailId: [''],
        medicine: ['', Validators.required],
        quantity: ['0',[Validators.required,Validators.maxLength(2)]]
      });
      formArray.push(medicineGroup);
      console.log(formArray);

  }
  selectedTime(){
    var alltime = this.model.getAllTime();
    var check = false;
    alltime?.forEach(x => {
        if(x === this.prescriptionForm.value.pickTime){
            this.ShowNofitication("Chọn trùng thời gian");
            check = true;
            return;
        }
    });
    if(check){
      return;
    }
    this.model.addTimeItem(this.prescriptionForm.value.pickTime);
    console.log("arrr" + this.model.time);
    this.modalController.dismiss();
  }
  checkDateTime(){
    const TOdate = new Date(this.prescriptionForm.value.toDate);
    const FROMdate = new Date(this.prescriptionForm.value.fromDate);
    const currentDate  = new Date();
    currentDate.setDate(currentDate.getDate() - 1);
    if(FROMdate < currentDate || TOdate < currentDate){
      console.log("1 ", FROMdate)
      console.log("2 ",currentDate)
      console.log(FROMdate < currentDate);
      console.log(TOdate < currentDate);
      this.prescriptionForm.get('fromDate')?.setValue((new Date()).toISOString());
      this.prescriptionForm.get('toDate')?.setValue((new Date()).toISOString());
        this.ShowNofitication('Ngày bắt đầu và kết thúc đều phải lớn hoặc bằng ngày hiện tại');
    }
    else if(FROMdate > TOdate){
      console.log(TOdate);
      this.prescriptionForm.get('fromDate')?.setValue((new Date()).toISOString());
      this.ShowNofitication('Ngày bắt đầu phải nhỏ hơn ngày kết thúc');
    }


  }
// async ShowNofitication(message: string){
//   try {
//     await Toast.show({
//       text: message,
//       duration: 'short'
//     });
//   } catch (error) {
//     console.error('Error displaying toast:', error);
//   }
// }





}
