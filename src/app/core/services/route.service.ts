import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { api_gateway_url, route_api } from '../const/url';

@Injectable({
  providedIn: 'root'
})
export class RouteService {

  constructor(private http: HttpClient) { }
  urlAPIRoute = api_gateway_url + "/Route"

  SearchAllRoute(page: any, pageSize: any, groupId:any): Observable<any> {
    if(groupId !== null){
      return this.http.get(this.urlAPIRoute + '/getall??GroupId=' + groupId + '&page=' + page + '&pagesize=' + pageSize )
      .pipe(map((response: any) => response));
    }
    return this.http.get(this.urlAPIRoute + '/getall?page=' + page + '&pagesize=' + pageSize)
    .pipe(map((response: any) => response));
  }

  GetRouteById(id: string): Observable<any> {
    return this.http.get(this.urlAPIRoute + '/id?Id=' + id)
      .pipe(
        map((response: any) => response)
      );
  }

  AddRoute(body: any): Observable<any> {
    return this.http.post(this.urlAPIRoute + '/add', body)
    .pipe(
      map((response: any) => response)
      );
  }

  UpdateRoute(body: any): Observable<any> {
    return this.http.put(this.urlAPIRoute + '/update', body)
    .pipe(
      map((response: any) => response)
      );
  }

  SearchAllCusInRoute(body:any):Observable<any>{
    return this.http.post(this.urlAPIRoute + "/searchAllCusInRoute", body)
    .pipe(
      map(response => response)
    )
  }
}
