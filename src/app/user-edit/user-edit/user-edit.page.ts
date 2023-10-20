import { user } from '@angular/fire/auth';
import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, ModalController } from '@ionic/angular';
import { format, parseISO } from 'date-fns';
import { from } from 'rxjs';
import { UserService } from 'src/app/Services/user-service/user.service';
import { User } from 'src/app/models/User';
import { ComponentBase } from 'src/app/shared/ComponentBase/ComponentBase';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.page.html',
  styleUrls: ['./user-edit.page.scss'],
})
export class UserEditPage extends ComponentBase implements OnInit {
  UserForm!: FormGroup;
  BirthDateView:string = 'dd/mm/yyyy'
  Model: User = new User();

  userImage:any = 'https://w7.pngwing.com/pngs/627/335/png-transparent-a-camera-photo-picture-take-ui-ux-user-interface-outline-icon-thumbnail.png';
  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private modalController: ModalController,
    private readonly auth: Auth,
    private loadingCtrl: LoadingController

  ) {
      super();
    this.UserForm = this.formBuilder.group({
      name: [''],
      birthDate: [new Date().toISOString()],
      gender: [''],
      phone: [''],
      email: ['',Validators.email]
    });
   }

  ngOnInit() {
     this.initValue();
  }
  initValue(){
      from(this.userService.User_ById(this.auth.currentUser?.uid || '')).subscribe(x => {
            this.Model = x;
            this.PatchValueModel(this.Model);
      });
      this.UserForm.get('phone')?.disable();
  }

  async SaveInput(){
      var formValue = this.UserForm.value;
     if( this.checkInputValue()){
          return;
     };
     this.Model.email = formValue.email;
     this.Model.gender = formValue.gender;
     this.Model.name = formValue.name;
   //  this.Model.phone = formValue.phone;
      console.log(this.Model);
     const loading = await this.loadingCtrl.create();
     await loading.present();
     var result = await this.userService.User_Upd(this.Model);
     await loading.dismiss();
     if(result){
      this.ShowNofitication("Chỉnh sửa thông tin người dùng thành công");
      }
      else{
        this.ShowNofitication("Chỉnh sửa thông tin người dùng thất bại");
 }
  }
  checkInputValue(){
     if(this.UserForm.controls['email'].hasError('email')){
      this.ShowNofitication('Thông tin tên đơn thuốc cần được nhập');
      return true;
    }
    return false;
  }
  async AddImage(){
    this.userImage = await this.userService.TakeAPhoto();
  }
  PatchValueModel(model:User){
      this.UserForm.patchValue({
        name: model.name,
        birthDate: model.birthDate,
        gender: model.gender,
        phone: model.phone,
        email: model.email
      });
      this.userImage = model.imageUrl;
      this.BirthDateView = format(parseISO(model.birthDate || new Date().toISOString()),  'dd/MM/yyyy');
    }

  SetBirthDay(){
    this.Model.birthDate = this.UserForm.value.birthDate;
    this.BirthDateView = format(parseISO(this.UserForm.value.birthDate),  'dd/MM/yyyy')
    console.log(this.Model.birthDate);
    this.modalController.dismiss();
  }
  async TakeAPhoto(){
     this.userImage = await this.userService.TakeAPhoto();
  }
}
