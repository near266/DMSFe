import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { map, Observable, pipe } from 'rxjs';
import { admin_user_url, api_gateway_url, api_url, gateway_url } from '../const/url';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  constructor(private http: HttpClient) { }

  GetAllEmployee(page: any, pageSize: any): Observable<any> {
    return this.http
      .post(gateway_url + '/Employee/SearchAllEmployeePost', {
        page: page,
        pagesize: pageSize
      })
      .pipe(map((response: any) => response));
  }
  SearchEmployee(body: any): Observable<any> {
    return this.http
      .post(gateway_url + '/Employee/SearchAllEmployeePost', body)
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

  ArchiveEmployee(body: any): Observable<any> {
    return this.http
      .post(gateway_url + '/Employee/ArchivedEmployee', body)
      .pipe(map((response: any) => response));
  }

  DisableEmployee(body: any): Observable<any> {
    return this.http
      .post(gateway_url + '/Employee/DisableEmployee', body)
      .pipe(map((response: any) => response));
  }

  GetGroupById(id: any): Observable<any> {
    return this.http.get(gateway_url + '/GetGroupById?Id=' + id).pipe(map((response: any) => response));
  }

  addGroup(body: any): Observable<any> {
    return this.http.post(gateway_url + '/AddGroup', body).pipe(map((response: any) => response));
  }

  updateGroup(body: any): Observable<any> {
    return this.http.put(gateway_url + '/UpdateGroup', body).pipe(map((response: any) => response));
  }

  deleteGroup(id: any): Observable<any> {
    return this.http.delete(gateway_url + '/DeleteGroup?Id=' + id).pipe(map((response: any) => response));
  }

  GetAllGroupByEmployeeId(): Observable<any> {
    return this.http.get(gateway_url + '/GetAllGroupByEmployeeId').pipe(map((response: any) => response));
  }


  GetChildrenByParentId(parentNodeId: any): Observable<any> {
    return this.http.get(gateway_url + '/GetChildrenByParentId?ParentNodeId=' + parentNodeId).pipe(map((response: any) => response));
  }

  GetAllGroupByType(type: any): Observable<any> {
    return this.http.get(gateway_url + '/GetAllGroupByType?type=' + type).pipe(map((response: any) => response));
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
  DeleteEmployeeUnitTree(EmployeeId: any, UnitTreeGroupId: any): Observable<any> {
    return this.http.delete(gateway_url + '/DeleteEmployeeUnitTree?EmployeeId=' + EmployeeId + '&UnitTreeGroupId=' + UnitTreeGroupId).pipe(map((response: any) => response));
  }

  SearchEmployeeInGroup(GroupId: string, page: number, pageSize: number): Observable<any> {
    const body = {
      GroupId: GroupId,
      page: page,
      pageSize: pageSize
    }
    return this.http.post(gateway_url + '/SearchEmployeeInGroupPost', body).pipe(map((response: any) => response));
  }

  ResetPasswordEmployee(body: any): Observable<any> {
    return this.http.post(admin_user_url + '/reset-password', body).pipe(map((response: any) => response));
  }
}
