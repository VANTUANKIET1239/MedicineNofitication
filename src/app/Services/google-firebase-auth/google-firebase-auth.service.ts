import { Injectable } from '@angular/core';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { isPlatform } from '@ionic/angular';
import { GoogleUser } from 'src/app/models/GoogleUser';
import { Preferences } from '@capacitor/preferences';
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
    await Preferences.set({
      key: 'ggtoken',
      value: user.authentication.accessToken
    });
    var userS = new GoogleUser(user.name,user.email,user.imageUrl, user.id);
    await Preferences.set({
      key: 'User',
      value: JSON.stringify(userS)
    });
    return userS;
  }
  async signOut(){
    var out =  await GoogleAuth.signOut();
    console.log(out);
    //localStorage.removeItem("ggtoken");
    await Preferences.remove({key: 'ggtoken'});
    await Preferences.remove({key: 'User'});
  }
  async refresh(){
    const kiet = await GoogleAuth.refresh();
    console.log(kiet);
  }
}

