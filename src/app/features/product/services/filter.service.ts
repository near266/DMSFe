import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FilterService {
    constructor() {}
    currentFiler$: BehaviorSubject<string> = new BehaviorSubject<string>('');
    isAscending$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    keyword$: BehaviorSubject<string> = new BehaviorSubject<string>('');
    page$: BehaviorSubject<number> = new BehaviorSubject<number>(1);
    status$: BehaviorSubject<boolean | null> = new BehaviorSubject<boolean | null>(null);
    supplierId$: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
    branchId$: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
    majorId$: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
}
