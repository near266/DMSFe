import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { gateway_url, history_url } from 'src/app/core/const/url';

@Injectable({
    providedIn: 'root',
})
export class CommonService {
    constructor(private http: HttpClient) {}
}
