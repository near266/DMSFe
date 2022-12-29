import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { api_gateway_url } from 'src/app/core/const/url';
import { HistoryOrder } from '../models/history';

@Injectable({
    providedIn: 'root',
})
export class HistoryOrderService {
    constructor(private http: HttpClient) {}
    getHistoryOrder(id: string, type: number): Observable<any> {
        return this.http.get(api_gateway_url + '/HistoryLogOrder/GetByKey?Id=' + id + '&Type=' + type);
    }
}
