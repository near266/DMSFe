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

    parseJwt(token: any) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(
            window
                .atob(base64)
                .split('')
                .map(function (c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                })
                .join(''),
        );
        return JSON.parse(jsonPayload);
    }
}
