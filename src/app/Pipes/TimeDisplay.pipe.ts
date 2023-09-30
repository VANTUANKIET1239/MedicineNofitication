import { Pipe, PipeTransform } from '@angular/core';
import { format, parseISO } from 'date-fns';

@Pipe({
  name: 'timeDisplay'
})
export class TimeDisplayPipe implements PipeTransform {

  transform(value: any): string {
    if (value == null || value == undefined) {
      return '-1';
    }
    const formattedString:string = format(parseISO(value), 'HH:mm');
    return formattedString;
  }

}
