import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SlideshowPageRoutingModule } from './slideshow-routing.module';

import { SlideshowPage } from './slideshow.page';
import { NewsServiceService } from '../Services/news-service/news-service.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SlideshowPageRoutingModule
  ],
  declarations: [SlideshowPage],

  schemas: [CUSTOM_ELEMENTS_SCHEMA],

})
export class SlideshowPageModule {}
