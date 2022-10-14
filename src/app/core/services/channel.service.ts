import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, pipe } from 'rxjs';
import { channel_url, customer_group_url } from '../const/url';

@Injectable({
  providedIn: 'root'
})
export class ChannelService {

  constructor(private http: HttpClient) { }

  get_all(): Observable<any> {
    return this.http.get(channel_url + '/getall')
      .pipe(
        map((response: any) => response)
      )
  }
}
