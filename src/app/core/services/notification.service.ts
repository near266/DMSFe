import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { notification_url } from '../const/url';

@Injectable({
    providedIn: 'root',
})
export class NotificationService {
    
    constructor(private http: HttpClient) {}

    getAll(): Observable<any> {
        return this.http.get(notification_url + '/getall').pipe(map((response: any) => response));
    }
}
