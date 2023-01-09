import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { album_url } from '../const/url';

@Injectable({
  providedIn: 'root'
})
export class AlbumService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<any> {
    return this.http.get(album_url + '/getall').pipe(map((response: any) => response));
  }
}
