import { NofiticationService } from './../Services/nofitication-service/nofitication.service';

import { GoogleCalendarService } from './../Services/GoogleCalendarService/google-calendar.service';
import { async } from '@angular/core/testing';
import { PrescriptionDetail } from './../models/prescriptionDetail';

import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoadingController, ModalController, NavController } from '@ionic/angular';
import { format, getDate, parseISO, toDate } from 'date-fns';
import { Prescription } from '../models/prescription';
import { Toast } from '@capacitor/toast';
import { MedicineServiceService } from '../Services/medicine-service/MedicineService.service';
import { Auth } from '@angular/fire/auth';
import { flatMap, from } from 'rxjs';
import { ComponentBase } from '../shared/ComponentBase/ComponentBase';
import { ActivatedRoute, Router } from '@angular/router';
import { GoogleFirebaseAuthService } from '../Services/google-firebase-auth/google-firebase-auth.service';
import { GoogleUser } from '../models/GoogleUser';
import { Preferences } from '@capacitor/preferences';


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
  isAllDate: boolean = true;
  googleLogin: boolean = false;
  IsLoginGG:boolean = false;
  disableGG: boolean = false;
  disableAllDay: boolean = false;
  googleUser :GoogleUser = new GoogleUser();
  selectedValue:any;
  public pickerColumns = [
    {
      name: 'languages',
      options: [
        {  text: '1', value: '1'},
        {  text: '2', value: '2'},
        {  text: '3', value: '3'},
        {  text: '4', value: '4'},
        {  text: '5', value: '5'},
        {  text: '6', value: '6'},
        {  text: '7', value: '7'},
        {  text: '8', value: '8'},
        {  text: '9', value: '9'},
        {  text: '10', value: '10'},
        {  text: '11', value: '11'},
        {  text: '12', value: '12'},
        {  text: '13', value: '13'},
        {  text: '14', value: '14'},
        {  text: '15', value: '15'},
        {  text: '16', value: '16'},
        {  text: '17', value: '17'},
        {  text: '18', value: '18'},
        {  text: '19', value: '19'},
        {  text: '20', value: '20'},
      ],
    },
  ];

  public pickerButtons = [
    {
      text: 'Cancel',
      role: 'cancel',
    },
    {
      text: 'Confirm',
      handler: (value:any) => {

        this.selectedValue = value.languages.value;

      },
    },
  ];
  listDayPicking: { [key: number]: boolean } = {};
  listDays: number[] = [2,3,4,5,6,7,1];
  constructor(private formBuilder: FormBuilder,
    private modalController: ModalController,
    private readonly loadingCtrl: LoadingController,
    private MedicineService: MedicineServiceService,
    private routeAct: ActivatedRoute,
    private GoogleCalendarService: GoogleCalendarService,
    private GoogleAuthService: GoogleFirebaseAuthService,
    private route: Router,
    private navCtrl: NavController,
    private localNotifications: NofiticationService
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
  dayClick(event:number){
        if(this.listDayPicking[event]){
            this.listDayPicking[event] = false;
        }
        else{
          this.listDayPicking[event] = true;
        }
  }
  // selectedValues(event:any){
  //     console.log(event);
  // }
  setValue(i:number){
        console.log(this.selectedValue);
        let medicineArr = this.medicineArrays;
        medicineArr.controls[i].patchValue({quantity:this.selectedValue});
  }
  ngOnInit(): void {
   this.disableGG = true;
     Preferences.get({key: 'ggtoken'}).then(x => {
      if(x.value){
        this.IsLoginGG = true;
        this.isAllDate = false;
        this.disableAllDay = true;
        this.prescriptionForm.controls['isAllDate'].patchValue({isAllDate:false});
        this.CheckGoogleLogin();
      }
      this.routeAct.queryParams.subscribe( async (params) => {
           let id =  params['id'];
           if(id){
            this.model = await this.MedicineService.Prescription_ById(id);
            this.PatchValueModel(this.model);
           }
     });
    });
  }

  PatchValueModel(model:Prescription){
    const arr = this.medicineArrays;
    arr.clear();
    if(Array.isArray(model.prescriptionDetails)){
      console.log(arr);
      model.prescriptionDetails.forEach(x => {
        const medicineGroup = this.formBuilder.group({
          prescriptionDetailId: [x.prescriptionDetailId],
          prescriptionId: [x.prescriptionId],
          medicine: [x.medicineName, Validators.required],
          quantity: [x.quantityPerDose,[Validators.required,Validators.maxLength(2)]],
          isDone: x.isDone
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
    this.model.dayOfWeeksItem?.forEach((itemNumber) => {
      this.listDayPicking[itemNumber] = true;
    });
    console.log('patchvalue list day');
    console.log(this.listDayPicking);
    console.log( Object.keys(this.listDayPicking).filter((x) => this.listDayPicking[parseInt(x)]).map(Number));
  }
  async LoginGoogle(){
     this.googleUser = await this.GoogleAuthService.SignIn();
     // xử lý ẩn hiện giao diện
     this.googleLogin = false;
     this.disableGG = true;
     this.IsLoginGG = true;
  }
  async LogoutGoogle(){
    await this.GoogleAuthService.signOut();
    // xử lý ẩn hiện giao diện
    this.disableGG = false;
    this.googleLogin = true;
    this.IsLoginGG  =false;
  }
  CheckGoogleLogin(){
    if(this.disableGG){
      console.log(this.disableGG);
      var result = this.GoogleCalendarService.CheckLogin().then(re => {
        console.log(re);
          if(re){
            this.googleUser = re ?? new GoogleUser();
            this.googleLogin = false;
          }
      });
    }
  }
  onGGEvent(event:any){
    var checkGG = event.detail.checked;
    if(checkGG){
        this.googleLogin = checkGG;
        this.disableAllDay = checkGG;
    }
    else{
      this.googleLogin = checkGG;
      this.disableAllDay = checkGG;
    }
  }
  onChangeAllDate(event:any){
    var checkAllDate = event.detail.checked;
    console.log(checkAllDate);
    if(!checkAllDate){
        this.isAllDate = false;
        this.disableGG = false;
    }
    else{
      this.isAllDate = true;
      this.disableGG = true;
    }
  }
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
            let modelDTitem:PrescriptionDetail = new PrescriptionDetail();
            modelDTitem.prescriptionDetailId = item.prescriptionDetailId ? item.prescriptionDetailId : '';
            modelDTitem.medicineName = item.medicine;
            modelDTitem.prescriptionId = item.prescriptionId;
            modelDTitem.quantityPerDose = item.quantity;
            modelDTitem.isDone = item.prescriptionDetailId ? item.isDone : '0';
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
      this.model.dayOfWeeksItem = Object.keys(this.listDayPicking).filter((x) => this.listDayPicking[parseInt(x)]).map(Number);
        await loading.present();
        var result = await this.MedicineService.Prescription_Upd(this.model);
        this.model = await this.MedicineService.Prescription_ById(this.model.prescriptionId);
        if((this.model.dayOfWeeks?.length || [].length) > 0 || this.model.dayOfWeeks != undefined){
         let listdaysUpd = this.model.dayOfWeeksItem || [];
          this.model.dayOfWeeks?.forEach(x => {
              this.localNotifications.CancelSchedule(x);
          });
          await this.localNotifications.scheduleNotification(listdaysUpd,this.model.getAllTime() || [],this.model.prescriptionName || '',this.model.prescriptionId);
        }
        // load lại model
        if(this.disableGG){
          console.log("event upd");
          console.log(this.model.eventIds);
          if((this.model.eventIds?.length || [].length) > 0 || (this.model.eventIds != undefined)){
            this.model.eventIds?.forEach(async x => {
              await this.GoogleCalendarService.DeleteEvent(x);
            });
          }
          let presId = await Preferences.get({key: 'presId'})
          await this.GoogleCalendarService.insertEvent(this.model, presId.value || "");
        }
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
    this.model.dayOfWeeks  = [];
    this.model.dayOfWeeksItem = Object.keys(this.listDayPicking).filter((x) => this.listDayPicking[parseInt(x)]).map(Number);
      await loading.present();
      var result = await this.MedicineService.Prescription_Add(this.model);
      var IdNew = await Preferences.get({key: 'presId'});
      if(!formValue.isAllDate){
        // add vao lich google
        console.log(IdNew.value);
        await this.GoogleCalendarService.insertEvent(this.model,IdNew.value || "");
      }
      else{
        // add vào notification cua android
        await this.localNotifications.scheduleNotification(this.model.dayOfWeeksItem,this.model.getAllTime() || [],this.model.prescriptionName || '',IdNew.value || '');
      }
      await loading.dismiss();
     if(result){
          this.ShowNofitication("Thêm đơn thuốc thành công");
     }
     else{
      this.ShowNofitication("Thêm đơn thuốc thất bại");
     }
  }
  goBack(){
    this.navCtrl.navigateForward('/main/tab1');
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
        prescriptionId: [''],
        medicine: ['', Validators.required],
        quantity: ['0',[Validators.required,Validators.maxLength(2)]],
        isDone: '0'
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
    this.modalController.dismiss();
  }
  checkDateTime(){
    const TOdate = new Date(this.prescriptionForm.value.toDate);
    const FROMdate = new Date(this.prescriptionForm.value.fromDate);
    const currentDate  = new Date();
    currentDate.setDate(currentDate.getDate() - 1);
    if(FROMdate < currentDate || TOdate < currentDate){
      this.prescriptionForm.get('fromDate')?.setValue((new Date()).toISOString());
      this.prescriptionForm.get('toDate')?.setValue((new Date()).toISOString());
        this.ShowNofitication('Ngày bắt đầu và kết thúc đều phải lớn hoặc bằng ngày hiện tại');
    }
    else if(FROMdate > TOdate){
      this.prescriptionForm.get('fromDate')?.setValue((new Date()).toISOString());
      this.ShowNofitication('Ngày bắt đầu phải nhỏ hơn ngày kết thúc');
    }
  }
}

