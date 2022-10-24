import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { map, Observable, pipe } from 'rxjs';
import { api_gateway_url, api_url, gateway_url } from '../const/url';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  constructor(private http: HttpClient) { }

  GetAllEmployee(page: any, pageSize: any): Observable<any> {
    return this.http
      .post(gateway_url + '/Employee/SearchAllEmployee', {
        page: page,
        pagesize: pageSize
      })
      .pipe(map((response: any) => response));
  }
  SearchEmployee(body: any): Observable<any> {
    return this.http
      .post(gateway_url + '/Employee/SearchAllEmployee', body)
      .pipe(map((response: any) => response));
  }

  getTreeEmployee(): Observable<any> {
    return this.http.get(gateway_url + '/GetAll').pipe(map((response: any) => response));
  }

  AddEmployee(body: any): Observable<any> {
    return this.http.post(api_url + '/admin/Users', body).pipe(map((response: any) => response));
  }

  DetailEmployee(id: any): Observable<any> {
    return this.http.get(gateway_url + '/Employee/GetEmployeeById?Id=' + id).pipe(map((response: any) => response));
  }

  UpdateEmployee(body: any): Observable<any> {
    return this.http.put(gateway_url + '/Employee/UpdateEmployee', body).pipe(map((response: any) => response));
  }
  UpdateUser(body: any): Observable<any> {
    return this.http.put(api_url + '/admin/Users?id=' + body.id, body).pipe(map((response: any) => response));
  }

  DeleteEmployee(id: any): Observable<any> {
    return this.http
      .delete(gateway_url + '/Employee/DeleteEmployee', { body: { id: id } })
      .pipe(map((response: any) => response));
  }

  ArchiveEmployee(id: any, LastModifiedBy: any, LastModifiedDate: any): Observable<any> {
    return this.http
      .post(gateway_url + '/Employee/ArchivedEmployee?Id=' + id + '&Archived=' + true, {})
      .pipe(map((response: any) => response));
  }

  addGroup(body: any): Observable<any> {
    return this.http.post(gateway_url + '/AddGroup', body).pipe(map((response: any) => response));
  }

  GetAllEmployeeByManager(page: number, pageSize: number): Observable<any> {
    return this.http.get(gateway_url + '/Employee/GetAllEmployeeByManagaer?page=' + page + '&pagesize=' + pageSize).pipe(map((response: any) => response));
  }

  GetAllEmployeeByTitle(title: any, page: number, pageSize: number): Observable<any> {
    return this.http.get(gateway_url + '/Employee/GetAllEmployeeByTitle?title=' + title + '&page=' + page + '&pagesize=' + pageSize).pipe(map((response: any) => response));
  }

  AddEmployeeUnitTree(body: any): Observable<any> {
    return this.http.post(gateway_url + '/AddEmployeeUnitTree', body).pipe(map((response: any) => response));
  }

  SearchEmployeeInGroup(GroupId: string, page: number, pageSize: number): Observable<any> {
    return this.http.get(gateway_url + '/SearchEmployeeInGroup?GroupId=' + GroupId + '&page=' + page + '&pagesize=' + pageSize).pipe(map((response: any) => response));
  }
}
