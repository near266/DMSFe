import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, pipe } from 'rxjs';
import { area_url } from '../const/url';

@Injectable({
  providedIn: 'root'
})
export class AreaService {

  constructor(private http: HttpClient) { }

  get_all(): Observable<any> {
    return this.http.get(area_url + '/getall')
      .pipe(
        map((response: any) => response)
      )
  }

}
