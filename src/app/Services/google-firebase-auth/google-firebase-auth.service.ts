import { Injectable } from '@angular/core';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { isPlatform } from '@ionic/angular';
@Injectable({
  providedIn: 'root'
})
export class GoogleFirebaseAuthService {

constructor() {
      if(!isPlatform('capacitor')){
        GoogleAuth.initialize();
    }
}
  async signIn(){
    var user = await GoogleAuth.signIn();
    localStorage.setItem("ggtoken",user.authentication.accessToken);
  }
  async signOut(){
    await GoogleAuth.signOut();
    localStorage.removeItem('ggtoken');
  }
  async refresh(){
    await GoogleAuth.refresh();
  }
}

