import { MedicineServiceService } from './../Services/medicine-service/MedicineService.service';
import { AfterViewInit, Component, DoCheck, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { Prescription } from '../models/prescription';
import { from } from 'rxjs';
import { LoadingController, NavController } from '@ionic/angular';
import { ComponentBase } from '../shared/ComponentBase/ComponentBase';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page extends ComponentBase implements  OnInit{
  prescriptionForm!: FormGroup;
  ListPres:Prescription[] = [];
  constructor(private formBuilder: FormBuilder,
              private route: Router,
              private navCtrl: NavController,
              private MedicineService:MedicineServiceService,
              private readonly loadingCtrl: LoadingController,
              ) {
                super();
    this.prescriptionForm = this.formBuilder.group({
      prescriptionName: ['', Validators.required],
      doctorName: ['', Validators.required],
      medicineStoreName: ['', Validators.required],
      fromDate: [new Date().toISOString(), Validators.required],
      toDate: [new Date().toISOString(), Validators.required],
      buyDate: [new Date().toISOString(), Validators.required],
    });
  }

  ngOnInit(): void {
    //this.InitMedicineList();
    from(this.MedicineService.Prescription_ById('C80lba7sW3hIW1lLy6KV')).subscribe(x => {
          console.log(x);
    });
  }
  async InitMedicineList(){
    const loading = await this.loadingCtrl.create();
    await loading.present();
      from(this.MedicineService.Prescription_List()).subscribe(items => {
          this.ListPres = items;
          console.log(this.ListPres);
      });
    await loading.dismiss();
  }
  submitForm(){

  }
  ionViewWillEnter(){
    this.InitMedicineList();
  }
  addItem(){

      this.route.navigate(['/add-medicine']);

  }
  editItem(id:string){
    if(id == ''){
        this.ShowNofitication('Có lỗi xảy ra, vui lòng thử lại sau');
        return;
    }
      let paras:any = {
          id: id
      }
      this.NavigateToPage('/add-medicine',paras)
  }
  selectedSegment: string = 'button1';

  selectButton(buttonValue: string) {
    this.selectedSegment = buttonValue;
  }

  NavigateToPage(url:string, paras?:any){
    if(paras){
      console.log(paras);
      const navigationExtras: NavigationExtras = {
        queryParams: paras
      };
      this.navCtrl.navigateForward(url,navigationExtras);
    }
    else{
      this.navCtrl.navigateForward(url);
    }
  }
  NavigateToPage2(url:string, paras?:any){
    if(paras){
      console.log(paras);
      const navigationExtras: NavigationExtras = {
        queryParams: paras
      };
      this.route.navigate([url],navigationExtras);
    }
    this.route.navigate([url]);
  }
}
