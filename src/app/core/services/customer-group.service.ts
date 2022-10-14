import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, pipe } from 'rxjs';
import { customer_group_url } from '../const/url';

@Injectable({
  providedIn: 'root'
})
export class CustomerGroupService {

  constructor(private http: HttpClient) { }

  get_all(): Observable<any> {
    return this.http.get(customer_group_url + '/getall')
      .pipe(
        map((response: any) => response)
      )
  }
}
