import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, pipe } from 'rxjs';
import { api_gateway_url, customer_url, route_api, route_customer_url } from '../const/url';

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

  update(body: any): Observable<any> {
    return this.http.put(customer_url + '/update', body)
      .pipe(
        map((response: any) => response)
      )
  }

  get_by_id(id: string): Observable<any> {
    return this.http.get(customer_url + '/id?Id=' + id)
      .pipe(
        map((response: any) => response)
      )
  }

  SearchAllRouteByCustomerId(id: string): Observable<any> {
    return this.http.get(route_customer_url + '/SearchAllRouteByCustomerId?Id=' + id)
      .pipe(
        map((response: any) => response)
      )
  }

  getall(page: number, pageSize: number): Observable<any> {
    return this.http.get(route_customer_url + '/getall?page=' + page + "&pagesize=" +pageSize)
      .pipe(
        map((response: any) => response)
      )
  }

  deleteCusFromRoute(body: any): Observable<any> {
    return this.http.delete(route_customer_url + '/deleteCusFromRoute', {body})
      .pipe(
        map((response: any) => response)
      )
  }

  addCusToRoute(body: any): Observable<any> {
    return this.http.post(route_customer_url + '/addCusToRoute', body)
      .pipe(
        map((response: any) => response)
      )
  }

  archivedCustomer(body: any): Observable<any> {
    return this.http.put(customer_url + '/arhived', body)
      .pipe(
        map((response: any) => response)
      )
  }
  GetCustomerByCode(body: any): Observable<any> {
    return this.http.post(customer_url + '/GetCustomerByCode', body)
      .pipe(
        map((response: any) => response)
      )
  }
}
