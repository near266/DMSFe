import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { warehouses_url } from '../const/url';

@Injectable({
  providedIn: 'root'
})
export class WarehousesService {

  constructor(private http: HttpClient) { }

  search(body: any): Observable<any> {
    return this.http
      .post(warehouses_url + '/search', body)
      .pipe(map((response: any) => response));
  }
}
