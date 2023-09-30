import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'TransformText'
})
export class TransformTextPipe implements PipeTransform {

  transform(value: string, numberShow: any): string {
      var textResult = value;
      if(value.length > numberShow){
        textResult = value.slice(1,numberShow) + "...";
      }
      return textResult;
  }

}
