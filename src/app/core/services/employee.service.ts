import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { map, Observable, pipe } from 'rxjs';
import { api_gateway_url, api_url, gateway_url } from '../const/url';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(
    private http: HttpClient,
  ) { }

  GetAllEmployee(page: any, pageSize: any): Observable<any> {
    return this.http.get(gateway_url + '/Employee/SearchAllEmployee?page=' + page + '&pagesize=' + pageSize)
      .pipe(
        map((response: any) => response)
      )
  }

  AddEmployee(body: any): Observable<any> {
    return this.http.post(api_url + '/admin/Users', body)
      .pipe(
        map((response: any) => response)
      )
  }

  DetailEmployee(id: any): Observable<any> {
    return this.http.get(gateway_url + '/Employee/GetEmployeeById?Id=' + id)
      .pipe(
        map((response: any) => response)
      )
  }
}
