import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { api_gateway_url, gateway_url, history_url } from 'src/app/core/const/url';

@Injectable({
    providedIn: 'root',
})
export class CommonService {
    constructor(private http: HttpClient) {}
    updateLog(type: number, id: string): Observable<any> {
        let body = {
            id: id,
            type: type,
        };
        return this.http
            .post(api_gateway_url + '/HistoryLogOrder/UpdateLog', body)
            .pipe(map((response: any) => response));
    }
}
