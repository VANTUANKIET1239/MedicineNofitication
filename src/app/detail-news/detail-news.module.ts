import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailNewsPageRoutingModule } from './detail-news-routing.module';

import { DetailNewsPage } from './detail-news.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailNewsPageRoutingModule
  ],
  declarations: [DetailNewsPage]
})
export class DetailNewsPageModule {}
