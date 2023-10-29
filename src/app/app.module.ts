
import { NgModule ,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { RouterModule } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgOtpInputModule } from  'ng-otp-input';

import { provideFirebaseApp,initializeApp  } from '@angular/fire/app';
import {provideFirestore, getFirestore} from '@angular/fire/firestore'
//import { AngularFireDatabase } from '@angular/fire/database';
import { environment } from 'src/environments/environment.prod';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { TimeDisplayPipe } from './Pipes/TimeDisplay.pipe';
import { PipesModule } from './Pipes/pipes.module';
import { DatePipe } from '@angular/common';
import { provideStorage ,getStorage} from '@angular/fire/storage';
import { StorageModule } from '@angular/fire/storage';

defineCustomElements(window);
@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule,
            IonicModule.forRoot(),
            AppRoutingModule,
            RouterModule,
            HttpClientModule,
            FormsModule,
            ReactiveFormsModule,
            NgOtpInputModule,
            provideFirebaseApp(() => initializeApp(environment.firebase)),
            provideAuth(() => getAuth()),
            provideFirestore(() => getFirestore()),
            PipesModule,
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy, },TimeDisplayPipe,DatePipe],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
