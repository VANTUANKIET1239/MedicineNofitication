import { Injector } from "@angular/core";
import { NavigationExtras, Router } from "@angular/router";
import { Toast } from "@capacitor/toast";
import { NavController } from "@ionic/angular";

export abstract class ComponentBase{


    constructor(){

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

}
