import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { api_gateway_url, route_api } from '../const/url';

@Injectable({
  providedIn: 'root'
})
export class RouteService {

  constructor(private http: HttpClient) { }
  urlAPI = api_gateway_url + "/Route"

  SearchAllRoute(page: any, pageSize: any): Observable<any> {
    return this.http.get(this.urlAPI + '/getall?page=' + page + '&pagesize=' + pageSize)
    .pipe(map((response: any) => response));
  }

  GetRouteById(id: string): Observable<any> {
    return this.http.get(this.urlAPI + '/id?Id=' + id)
      .pipe(
        map((response: any) => response)
      );
  }

  AddRoute(body: any): Observable<any> {
    return this.http.post(this.urlAPI + '/add', body)
    .pipe(
      map((response: any) => response)
      );
  }

  UpdateRoute(body: any): Observable<any> {
    return this.http.put(this.urlAPI + '/update', body)
    .pipe(
      map((response: any) => response)
      );
  }
}
