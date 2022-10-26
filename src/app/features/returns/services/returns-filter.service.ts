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
}
