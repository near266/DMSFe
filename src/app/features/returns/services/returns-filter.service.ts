import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ReturnsFilterService {
    constructor() {}
    currentFiler$: BehaviorSubject<string> = new BehaviorSubject<string>('');
    isAscending$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    keyword$: BehaviorSubject<string> = new BehaviorSubject<string>('');
    startDate$: BehaviorSubject<string> = new BehaviorSubject<string>('');
    endDate$: BehaviorSubject<string> = new BehaviorSubject<string>('');
    timeFilterType$: BehaviorSubject<number> = new BehaviorSubject<number>(1);
}
