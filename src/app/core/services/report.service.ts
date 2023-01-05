import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { api_gateway_url, route_api } from '../const/url';

@Injectable({
    providedIn: 'root',
})
export class ReportService {
    constructor(private http: HttpClient) {}
    urlAPIReport = api_gateway_url + '/Report';

    OrderReport(body: any): Observable<any> {
        return this.http.post(this.urlAPIReport + '/OrderReport', body).pipe(map((res) => res));
    }

    SaleReceiptReport(body: any): Observable<any> {
        return this.http.post(this.urlAPIReport + '/SaleReport', body).pipe(map((res) => res));
    }

    SaleReceiptExportGross(body: any): Observable<any> {
        let optionHeader = { responseType: 'text' };
        return this.http
            .post(this.urlAPIReport + '/SaleExportDelap', body, { responseType: 'blob' })
            .pipe(map((res) => res));
    }

    SaleReceiptExportNotGross(body: any): Observable<any> {
        let optionHeader = { responseType: 'text' };
        return this.http
            .post(this.urlAPIReport + '/SaleExport', body, { responseType: 'blob' })
            .pipe(map((res) => res));
    }

    TimeKeepingReport(body: any): Observable<any> {
        return this.http.post(this.urlAPIReport + '/TimeKeepingReport', body).pipe(map((res) => res));
    }
}
