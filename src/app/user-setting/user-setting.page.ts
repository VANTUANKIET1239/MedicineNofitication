
import { Component, OnInit, inject } from '@angular/core';
import { GoogleUser } from '../models/GoogleUser';
import { GoogleFirebaseAuthService } from '../Services/google-firebase-auth/google-firebase-auth.service';
import { GoogleCalendarService } from '../Services/GoogleCalendarService/google-calendar.service';
import { Preferences } from '@capacitor/preferences';
import { ComponentBase } from '../shared/ComponentBase/ComponentBase';
import { NavigationExtras } from '@angular/router';
import { LoadingController, NavController } from '@ionic/angular';
import { Auth } from '@angular/fire/auth';
import { Capacitor } from '@capacitor/core';

import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Storage, StorageInstances, StorageModule, getDownloadURL, ref, uploadBytes } from '@angular/fire/storage';
import { getStorage } from 'firebase/storage';
import { initializeApp } from 'firebase/app';
import { UserService } from '../Services/user-service/user.service';
import { from } from 'rxjs';
import { User } from '../models/User';


const app = initializeApp({
  apiKey: "AIzaSyB59ZKtqB6hIaTgVby5u0bYbaW38-xku-w",
authDomain: "drugnotification-267ca.firebaseapp.com",
projectId: "drugnotification-267ca",
storageBucket: "drugnotification-267ca.appspot.com",
messagingSenderId: "467612996582",
appId: "1:467612996582:web:bd8dc15c6c0f0800407c27",
measurementId: "G-XF1MGCSSBB"
});
@Component({
  selector: 'app-user-setting',
  templateUrl: './user-setting.page.html',
  styleUrls: ['./user-setting.page.scss'],
})

export class UserSettingPage extends ComponentBase implements OnInit  {
    googleLogin: boolean = true;
    disableGG: boolean = false;
    googleUser :GoogleUser = new GoogleUser();
    userImage:any = 'https://w7.pngwing.com/pngs/627/335/png-transparent-a-camera-photo-picture-take-ui-ux-user-interface-outline-icon-thumbnail.png';
    //private storage: Storage = inject(Storage)
    //private storage = getStorage(app);
    userModel: User = new User();
    constructor(
      private GoogleAuthService: GoogleFirebaseAuthService,
      private GoogleCalendarService: GoogleCalendarService,
      private navCtrl: NavController,
      private readonly loadingCtrl: LoadingController,
      private userService: UserService,
      private auth:Auth
    ) {
      super();
    }

    ngOnInit() {
      Preferences.get({key: 'ggtoken'}).then(x => {
        if(x.value){
          this.disableGG = true;
          this.CheckGoogleLogin();
          this.googleLogin = false;
        }

      });
      this.LoadUser();
    }
    LoadUser(){
          from(this.userService.User_ById(this.auth.currentUser?.uid || '')).subscribe(x => {
                this.userModel = x;
                if(this.userModel.imageUrl  != ''){
                    this.userImage = this.userModel.imageUrl;
                    console.log(this.userImage);
                }
          });
    }

    async LoginGoogle(){
      this.googleUser = await this.GoogleAuthService.SignIn();
      this.disableGG = true;
      this.googleLogin = false;
  }
  async LogoutGoogle(){
    await this.GoogleAuthService.signOut();
    this.disableGG = false;
    this.googleLogin = true;
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
  async ionViewWillEnter(){
    const loading = await this.loadingCtrl.create();
    await loading.present();
    this.LoadUser();
    await loading.dismiss();

  }
 async LogoutUser(){
        const loading = await this.loadingCtrl.create();
        await loading.present();
        Preferences.get({key: 'ggtoken'}).then( async x => {
          if(x.value){
            await this.GoogleAuthService.signOut();
          }
        });
        await this.auth.signOut();
        this.NavigateToPage('/login');
        this.ShowNofitication('Đăng xuất thành công');
        await loading.dismiss();
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
  async AddImage(){
    var image = await this.userService.TakeAPhoto();
    this.userImage = image;
  }



}
