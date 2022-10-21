import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { route_api } from '../const/url';

@Injectable({
  providedIn: 'root'
})
export class RouteService {

  constructor(private http: HttpClient) { }

  SearchAllRoute(page: any, pageSize: any): Observable<any> {
    return this.http.get(route_api + '/SearchAllRoute?page=' + page + '&pagesize=' + pageSize)
    .pipe(map((response: any) => response));
  }

  GetRouteById(id: string): Observable<any> {
    return this.http.get(route_api + '/GetRouteById?Id=' + id)
      .pipe(
        map((response: any) => response)
      );
  }

  AddRoute(body: any): Observable<any> {
    return this.http.post(route_api + '/AddRoute', body)
    .pipe(
      map((response: any) => response)
      );
  }

  UpdateRoute(body: any): Observable<any> {
    return this.http.post(route_api + '/UpdateRoute', body)
    .pipe(
      map((response: any) => response)
      );
  }
}
