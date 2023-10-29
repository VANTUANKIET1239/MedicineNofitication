
import { Component, OnInit, inject } from '@angular/core';
import { ConfirmationResult, getAuth, GoogleAuthProvider, PhoneAuthProvider, RecaptchaVerifier, signInWithCredential, signInWithPhoneNumber, signInWithPopup, user ,Auth, User, signInWithCustomToken, onAuthStateChanged, authState} from "@angular/fire/auth";
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Toast } from '@capacitor/toast';
import { GoogleCalendarService } from '../Services/GoogleCalendarService/google-calendar.service';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { LoadingController, isPlatform } from '@ionic/angular';
import { GoogleFirebaseAuthService } from '../Services/google-firebase-auth/google-firebase-auth.service';
import { NavController } from '@ionic/angular';
import { ComponentBase } from '../shared/ComponentBase/ComponentBase';
import { Prescription } from '../models/prescription';
import { UserService } from '../Services/user-service/user.service';
//const app = initializeApp(environment.firebase);
// const app = initializeApp({
//   apiKey: "AIzaSyB59ZKtqB6hIaTgVby5u0bYbaW38-xku-w",
// authDomain: "drugnotification-267ca.firebaseapp.com",
// projectId: "drugnotification-267ca",
// storageBucket: "drugnotification-267ca.appspot.com",
// messagingSenderId: "467612996582",
// appId: "1:467612996582:web:bd8dc15c6c0f0800407c27",
// measurementId: "G-XF1MGCSSBB"
// });
declare var gapi:any;
// const auth = getAuth();
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage extends ComponentBase implements OnInit {
  public phoneNumber!:number;
  public reCapchaVerifier: any;
  public OtpNumber:any;
  public isLogin:boolean = true;

  public verify!:any;
  public otpcomfirmationResult!:ConfirmationResult;
  private auth:Auth = inject(Auth);
  authState$ = authState(this.auth as any);
  user$ =this.auth.currentUser;
  constructor(private route:Router,
              private navCtrl: NavController,
              private routeAct: ActivatedRoute,
               private googleCalendarService: GoogleCalendarService,
               private googleAuth:GoogleFirebaseAuthService,
               private readonly loadingCtrl: LoadingController,
               private userService: UserService
    ) {
        super();
   }

  ngOnInit() {
      this.onInitAuth();

  }
  private onInitAuth(){

   // const storedToken = localStorage.getItem('accessToken');
      this.authState$.subscribe((aUser: User | null) => {
          if(aUser?.phoneNumber){
            console.log(aUser);
         //   this.ShowNofitication(aUser.phoneNumber);
            this.navCtrl.navigateRoot('/main');
          }
          else{
            this.ShowNofitication("phiên đăng nhập hết hạn");
          }
      });

  }
  async GetOTP(){

        try{
          var phoneNum:string = this.phoneNumber.toString() ?? "";
          console.log(this.phoneNumber);
          if(phoneNum == '' || phoneNum == undefined){
              this.ShowNofitication('Bạn chưa nhập số điện thoại');
          }
          else if(phoneNum.length < 10 ){
            this.ShowNofitication('Số điện thoại bạn nhập chưa đúng');
          }
          else{
             const loading = await this.loadingCtrl.create();
              phoneNum = "+1" + phoneNum;
              this.reCapchaVerifier = new RecaptchaVerifier('sign-in-button',{size:'invisible'},this.auth);
              await loading.present();
              signInWithPhoneNumber(this.auth,phoneNum, this.reCapchaVerifier).then(confirmationResult => {
              this.otpcomfirmationResult = confirmationResult;
              this.isLogin = !this.isLogin;
              loading.dismiss();
            });
          }
        }
        catch(e:any){
            this.ShowNofitication("Số điện thoại cần được nhập");
        }
  }
  onOtpChange(otp:string){
      this.OtpNumber = otp;
  }
   VerifyOTP(){
    var credential = PhoneAuthProvider.credential(this.otpcomfirmationResult.verificationId, this.OtpNumber);
    signInWithCredential(this.auth,credential).then(async(result) => {
            if(result.user){
              console.log(result);
                let phone = result.user.phoneNumber?.substring(2) || '';
                let uid = result.user.uid || '';
                if(!(await this.userService.CheckUserExists(uid))){
                      this.userService.User_AddBase(phone,uid);
                }
              this.navCtrl.navigateRoot('/main');
            }
        })
        .catch((error) => {
            this.ShowNofitication("Đã có lỗi xảy ra hoặc nhập OTP sai, xin mời thử lại" + error.message);
            this.isLogin = !this.isLogin;
        });

  }


}
