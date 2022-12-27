import { Injectable } from '@angular/core';
import { Days } from '../models/Days';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DateService {

    private readonly defaultListDay: Days[] = [];

    private allDayOfMonth: BehaviorSubject<Days[]> = new BehaviorSubject<Days[]>(this.defaultListDay);

    public allDayOfMonth$ = this.allDayOfMonth.asObservable();

  constructor() { }

  getAllDayOfMonth(time: any) {
    let temp = new Date(time);
    let count: number = temp.getDate();
    let days: Days[] = [];
    for(let i = count-1; i >= 0; i--) {
      days.push({
        date: count - i,
        day: this.getDay(count-i, temp.getMonth(), temp.getFullYear())
      })
      this.allDayOfMonth.next(days)
    }
  }

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
