import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'time'
})
export class TimePipe implements PipeTransform {

  transform(value: number, args?: any): string {
    let time : string;
    let heure : number;
    let minute : number;
    let seconde : number;
    heure=(value-value%3600000)/3600000;
    value=value%3600000;
    minute=(value-value%60000)/60000;
    value=value%60000;
    seconde=(value-value%1000)/1000;
    value=value%1000;
    time = heure+':'+minute+':'+seconde;
    return time;
  }

}
