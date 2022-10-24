import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, pipe } from 'rxjs';
import { customer_group_url, gateway_url } from '../const/url';

@Injectable({
  providedIn: 'root'
})
export class CustomerGroupService {

  constructor(private http: HttpClient) { }
  url = gateway_url + "/SearchEmployeeInGroupPost"
  get_all(): Observable<any> {
    return this.http.get(customer_group_url + '/getall')
      .pipe(
        map((response: any) => response)
      )
  }

  SearchEmployeeInGroup(body:any):Observable<any>{
    return this.http.post(this.url, body)
    .pipe(
      map(res => res)
    )
  }
}
