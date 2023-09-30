import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TimeDisplayPipe } from './TimeDisplay.pipe';
import { TransformTextPipe } from './TransformText/TransformText.pipe';

@NgModule({
  declarations: [TimeDisplayPipe,TransformTextPipe],
  imports: [IonicModule],
  exports: [TimeDisplayPipe,TransformTextPipe]
})
export class PipesModule {}
