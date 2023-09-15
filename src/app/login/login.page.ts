import { Component, OnInit } from '@angular/core';
import { ConfirmationResult, getAuth, GoogleAuthProvider, PhoneAuthProvider, RecaptchaVerifier, signInWithCredential, signInWithPhoneNumber, signInWithPopup } from "firebase/auth";
import { AngularFireModule } from '@angular/fire/compat';
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment';
import { Route, Router } from '@angular/router';
import { Toast } from '@capacitor/toast';
import { GoogleCalendarService } from '../Services/GoogleCalendarService/google-calendar.service';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { isPlatform } from '@ionic/angular';
import { GoogleFirebaseAuthService } from '../Services/google-firebase-auth/google-firebase-auth.service';

//const app = initializeApp(environment.firebase);
const app = initializeApp({
  apiKey: "AIzaSyB59ZKtqB6hIaTgVby5u0bYbaW38-xku-w",
authDomain: "drugnotification-267ca.firebaseapp.com",
projectId: "drugnotification-267ca",
storageBucket: "drugnotification-267ca.appspot.com",
messagingSenderId: "467612996582",
appId: "1:467612996582:web:bd8dc15c6c0f0800407c27",
measurementId: "G-XF1MGCSSBB"
});
declare var gapi:any;
const auth = getAuth(app);
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public phoneNumber:any;
  public reCapchaVerifier: any;
  public OtpNumber:any;
  public isLogin:boolean = true;

  public verify!:any;
  public otpcomfirmationResult!:ConfirmationResult;
  constructor(private route:Router,
              private googleCalendarService: GoogleCalendarService,
              private googleAuth:GoogleFirebaseAuthService
    ) {

   }
   async Login(){
      await this.googleAuth.signIn();
   }

   async Logout(){
      await this.googleAuth.signOut();
   }
   async Refresh(){
      await this.googleAuth.refresh();
   }
   async CreateCalendarEvent(){
      var result = await this.googleCalendarService.insertEvent();
      if(result){
          this.ShowNofitication("OK");
      }
      else this.ShowNofitication("NO");
   }

  ngOnInit() {
      var phoneUser = localStorage.getItem('phoneNumber');
      if(phoneUser){
        this.route.navigate(['/main']);
      }
  }
  GetOTP(){

        this.reCapchaVerifier = new RecaptchaVerifier( 'sign-in-button', {size:'invisible'}, auth);
        signInWithPhoneNumber(auth,this.phoneNumber, this.reCapchaVerifier).then(confirmationResult => {
          this.otpcomfirmationResult = confirmationResult;
          this.isLogin = !this.isLogin;
        }).catch((error) => {
          setTimeout(() => {
            window.location.reload;
          }, 5000);
          this.isLogin = !this.isLogin;
        });
  }
  VerifyOTP(){
    console.log(this.OtpNumber);
    this.otpcomfirmationResult.confirm(this.OtpNumber)
    .then((result) => {
        console.log(result.user.phoneNumber);
        let phone = result.user.phoneNumber || '';
        localStorage.setItem("phoneNumber",phone);
        this.route.navigate(['/main']);
    })
    .catch((error) => {

        alert("Đã có lỗi xảy ra hoặc nhập OTP sai, xin mời thử lại" + error.message);
        this.isLogin = !this.isLogin;
    });
  }
  async ShowNofitication(message: string){
    try {
      await Toast.show({
        text: message,
        duration: 'short'
      });
    } catch (error) {
      console.error('Error displaying toast:', error);
    }
  }

  onOtpChange(){

  }

}
