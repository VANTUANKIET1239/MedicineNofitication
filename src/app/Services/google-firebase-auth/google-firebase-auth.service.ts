import { Injectable } from '@angular/core';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { isPlatform } from '@ionic/angular';
import { GoogleUser } from 'src/app/models/GoogleUser';
@Injectable({
  providedIn: 'root'
})
export class GoogleFirebaseAuthService {

constructor() {
      if(!isPlatform('capacitor')){
        GoogleAuth.initialize();
    }
}
  async signIn(): Promise<GoogleUser>{
    var user = await GoogleAuth.signIn();
    localStorage.setItem("ggtoken",user.authentication.accessToken);
    return new GoogleUser(user.name,user.email,user.imageUrl, user.id);
  }
  async signOut(){
    await GoogleAuth.signOut();
    localStorage.removeItem("ggtoken");
  }
  async refresh(){
    const kiet = await GoogleAuth.refresh();
    console.log(kiet);
  }
}

