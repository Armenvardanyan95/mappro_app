import { Pipe, PipeTransform } from '@angular/core';

declare type TimeFormat = 'am' | 'pm';
declare type FormatingType = 'object' | 'string';

@Pipe({
  name: 'timeAmPm'
})
export class TimeAmPmPipe implements PipeTransform {

  private formatAMPM(date: string): string {
    const dateArray: string[] = date.split(':');
    var hours = +dateArray[0];
    var minutes = +dateArray[1];
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const minutesFinal = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutesFinal + ' ' + ampm;
    return strTime;
  }

  transform(value: any, type: FormatingType = 'object'): any {
    if (!value) {
      return type === 'string' ? '' : {time: '', type: ''};
    }
    const time: [string, TimeFormat] = <[string, TimeFormat]>this.formatAMPM(value).split(' ');
    return type === 'string' ? time.join('') : {time: time[0], type: time[1]};
  }

}
