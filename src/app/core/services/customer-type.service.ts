import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, pipe } from 'rxjs';
import { customer_group_url, customer_type_url } from '../const/url';

@Injectable({
  providedIn: 'root'
})
export class CustomerTypeService {

  constructor(private http: HttpClient) { }

  get_all(): Observable<any> {
    return this.http.get(customer_type_url + '/getall')
      .pipe(
        map((response: any) => response)
      )
  }
}
