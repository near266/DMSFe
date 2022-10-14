import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, pipe } from 'rxjs';
import { api_gateway_url, customer_url } from '../const/url';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private http: HttpClient) { }

  search(body: any): Observable<any> {
    return this.http.post(customer_url + '/search', body)
      .pipe(
        map((response: any) => response)
      )
  }

  add(body: any): Observable<any> {
    return this.http.post(customer_url + '/add', body)
      .pipe(
        map((response: any) => response)
      )
  }
}
