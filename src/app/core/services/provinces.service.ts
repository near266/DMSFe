import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProvincesService {


  constructor(private http: HttpClient) { }

  urlProvinces = "https://provinces.open-api.vn/api/"

  getListProvinces():Observable<any>{
    return this.http.get(this.urlProvinces)
    .pipe(
      map(res => res)
    )
  }
  getListAllDistrict():Observable<any>{
    return this.http.get('https://provinces.open-api.vn/api/d/')
    .pipe(
      map(res => res)
    )
  }
  getListAllWard():Observable<any>{
    return this.http.get('https://provinces.open-api.vn/api/w/')
    .pipe(
      map(res => res)
    )
  }
  getDistrictsListByID(id:string):Observable<any>{
    return this.http.get(this.urlProvinces + 'p/'+ id +'?depth=2')
    .pipe(
      map(res=>res)
    )
  }

  getWardsListByID(id:string):Observable<any>{
    return this.http.get(this.urlProvinces + 'd/'+ id +'?depth=2')
    .pipe(
      map(res=>res)
    )
  }
}
