import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { api_gateway_url, route_api } from '../const/url';

@Injectable({
  providedIn: 'root'
})
export class RouteService {

  constructor(private http: HttpClient) { }
  urlAPIRoute = api_gateway_url + "/Route"

  SearchAllRoute(page: any, pageSize: any, groupId:any, employeeId:any, keyword:any): Observable<any> {
    let params = new HttpParams()
    if(groupId !== null && groupId !== undefined && groupId !== 'undefined' && groupId !== ''){
      params = params.append('GroupId', groupId)
    }
    if(employeeId !== null && employeeId !== undefined && groupId !== 'undefined' && groupId !== ''){
      params = params.append("EmployeeId", employeeId)
    }
    if(keyword !== null && keyword !== undefined && keyword !== 'undefined' && keyword !== ''){
      params = params.append("keyword", keyword)
    }
    params = params.set('page', page)
    params = params.set('pagesize', pageSize)
    // if(groupId !== null && groupId !== undefined){
    //   return this.http.get(this.urlAPIRoute + '/getall?GroupId=' + groupId + '&page=' + page + '&pagesize=' + pageSize )
    //   .pipe(map((response: any) => response));
    // }
    // return this.http.get(this.urlAPIRoute + '/getall?page=' + page + '&pagesize=' + pageSize)
    // .pipe(map((response: any) => response));
    return this.http.get(this.urlAPIRoute + '/getall?'+ params)
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

  CountCustomerInRoute(routeId:any):Observable<any>{
    let params = new HttpParams()
    .set('RouteId=', routeId)
    return this.http.get(this.urlAPIRoute + "/CountCustomerInRoute?" , {params})
    .pipe(
      map(res => res)
    )
  };

  DeleteCusFromRoute(body:any):Observable<any>{
    return this.http.delete(this.urlAPIRoute + "/deleteCusFromRoute?" , {body})
    .pipe(
      map(res => res)
    )
  }
  Import(body:any):Observable<any>{
    return this.http.post(this.urlAPIRoute + '/Import', body)
    .pipe(
      map(res => res)
    )
  }
  Delete(body:any):Observable<any>{
    return this.http.post(this.urlAPIRoute + '/Delete', body)
    .pipe(
      map(res => res)
    )
  }

}
