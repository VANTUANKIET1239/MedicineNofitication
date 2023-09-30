import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddMedicinePageRoutingModule } from './add-medicine-routing.module';

import { AddMedicinePage } from './add-medicine.page';
import { TimeDisplayPipe } from '../Pipes/TimeDisplay.pipe';
import { PipesModule } from '../Pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddMedicinePageRoutingModule,
    ReactiveFormsModule,
    PipesModule
  ],
  declarations: [AddMedicinePage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AddMedicinePageModule {}
