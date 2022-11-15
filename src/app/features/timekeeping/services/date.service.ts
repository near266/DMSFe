import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateService {

  constructor() { }

  getDay(date: number, month: number, year: number): string {
    let t = new Date();
    t.setFullYear(year, month, date);
    let day = t.getDay();
    let dayName: string = '';
    switch(day) {
      case 0:
        dayName = 'CN';
        break;
      case 1:
        dayName = 'T2';
        break;
      case 2:
        dayName = 'T3';
        break;
      case 3:
        dayName = 'T4';
        break;
      case 4:
        dayName = 'T5';
        break;
      case 5:
        dayName = 'T6';
        break;
      case 6:
        dayName = 'T7';
    }
    return dayName;
  }
}
