import { Injectable } from '@angular/core';
import { Days } from '../models/Days';
import { BehaviorSubject } from 'rxjs';
import { DatePipe } from '@angular/common';

@Injectable({
    providedIn: 'root',
})
export class DateService {
    private totalCount: number = 0;

    private readonly defaultListDay: Days[] = [];

    private allDayOfMonth: BehaviorSubject<Days[]> = new BehaviorSubject<Days[]>(this.defaultListDay);

    public allDayOfMonth$ = this.allDayOfMonth.asObservable();

    constructor(private datePipe: DatePipe) {}

    getAllDayOfMonth(time: any) {
        let temp = new Date(time);
        let count: number = temp.getDate();
        this.totalCount = count;
        let days: Days[] = [];
        for (let i = count - 1; i >= 0; i--) {
            days.push({
                date: count - i,
                day: this.getDay(count - i, temp.getMonth(), temp.getFullYear()),
            });
            this.allDayOfMonth.next(days);
        }
    }

    getDay(date: number, month: number, year: number): string {
        let t = new Date();
        t.setFullYear(year, month, date);
        let day = t.getDay();
        let dayName: string = '';
        switch (day) {
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

    ReturnDayStart(selectedDate: any): any {
        let result: any = '';
        let date = new Date(selectedDate);
        const compare = date.getDate();
        let days: Days[] = [];
        days.push({
            date: date.getDate(),
            day: this.getDay(date.getDate(), date.getMonth(), date.getFullYear()),
        });
        let maxDateInPreviousMonth = 0;
        while (true) {
            if (date.getDate() > 1) {
                date.setDate(date.getDate() - 1);
            } else {
                if (date.getMonth() <= 1) {
                    date.setMonth(date.getMonth() + 11);
                    date.setFullYear(date.getFullYear() - 1);
                    date.setDate(new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate());
                } else {
                    date.setDate(new Date(date.getFullYear(), date.getMonth(), 0).getDate());
                    date.setMonth(date.getMonth());
                }
                if (date.getDate() > 1) maxDateInPreviousMonth = date.getDate();
            }

            if (maxDateInPreviousMonth > 0 && maxDateInPreviousMonth <= compare) {
                break;
            }

            let day: Days = {
                date: date.getDate(),
                day: this.getDay(date.getDate(), date.getMonth(), date.getFullYear()),
            };
            days.push(day);

            if (date.getDate() - 1 == compare) {
                break;
            }

            if (compare == new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate() && date.getDate() == 1) {
                break;
            }
        }
        this.allDayOfMonth.next(days.reverse());
        result = this.datePipe.transform(date, 'yyyy-MM-dd');
        return result;
    }
}
