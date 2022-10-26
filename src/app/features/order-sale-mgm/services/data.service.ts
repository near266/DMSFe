import { Injectable } from '@angular/core';
import { Observable, map, of, delay, BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class DataService {
    private searchTextSource = new BehaviorSubject<string>('');

    searchText = this.searchTextSource.asObservable();
    constructor() {}
    searchKeyword(keyword: string) {
        this.searchTextSource.next(keyword);
    }
}
