import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { map, Observable, pipe } from 'rxjs';
import { api_url } from '../const/url';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(
    private http: HttpClient,
  ) { }

  AddEmployee(body: any): Observable<any> {
    return this.http.post(api_url + '/admin/Users', body)
      .pipe(
        map((response: any) => response)
      )
  }
}
