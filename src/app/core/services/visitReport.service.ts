import { Injectable } from '@angular/core';
import { api_gateway_url } from '../const/url';
import { Observable, map, of, delay, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { VisitReport } from 'src/app/features/visit-report/model/VisitReport';

@Injectable({
  providedIn: 'root'
})
export class VisitReportService {
  api_gateway_url = api_gateway_url;
  constructor(private http: HttpClient) { } 
  searchReport(body: any): Observable<any> {
      return this.http.post(this.api_gateway_url + '/Report/CheckInReport', body);
  }
}
