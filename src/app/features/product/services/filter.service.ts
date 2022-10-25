import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FilterService {
    constructor() {}
    currentFiler$: BehaviorSubject<string> = new BehaviorSubject<string>('');
    isAscending$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
}
