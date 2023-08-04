import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { warehouses_url } from '../const/url';
import { TypeExport } from 'src/app/features/user-manage/common/common.service';

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

  getWareHouseById(id: any): Observable<any> {
    return this.http
    .get(warehouses_url + '/id?Id=' + id)
    .pipe(map((response: any) => response));
  }

  addWareHouse(body: any): Observable<any> {
    return this.http
    .post(warehouses_url + '/add', body)
    .pipe(map((response: any) => response));
  }

  updateWareHouse(body: any): Observable<any> {
    return this.http
    .put(warehouses_url + '/update', body)
    .pipe(map((response: any) => response));
  }

  deleteWareHouse(body: any): Observable<any> {
    return this.http
    .delete(warehouses_url + '/delete', {body: body})
    .pipe(map((response: any) => response));
  }

  addAccountant(body: any): Observable<any> {
    return this.http
    .post(warehouses_url + '/addAccountant', body)
    .pipe(map((response: any) => response));
  }

  deleteAccountant(body: any): Observable<any> {
    return this.http
    .delete(warehouses_url + '/deleteAccountant', {body: body})
    .pipe(map((response: any) => response));
  }
   
  export(type: number, data: any) :Observable<any>{
    let body: any = {
      type: type,
  };
  if (type === TypeExport.Selected) {
      body.listId = data;
  } else {
      body.filter = data;
  }
  return this.http.post(warehouses_url + '/export', body, { responseType: 'blob' });
   }
}
