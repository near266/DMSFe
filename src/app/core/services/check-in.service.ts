import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { map, Observable } from 'rxjs'
import { check_in_url } from '../const/url'

@Injectable({
    providedIn: 'root',
})
export class CheckInService {
    constructor(private http: HttpClient) {}

    getAll(
        page: number,
        pagesize: number,
        keyword?: string,
        customerGroupId?: string,
        customerTypeId?: string,
        albumId?: string,
        sortFeild?: string,
        sortValue?: boolean,
    ): Observable<any> {
        let url = 'page=' + page + '&&pagesize=' + pagesize
        if (keyword) {
            url += '&&keyword=' + keyword
        }
        if (customerGroupId) {
            url += '&&customerGroupId=' + customerGroupId
        }
        if (customerTypeId) {
            url += '&&customerTypeId=' + customerTypeId
        }
        if (albumId) {
            url += '&&albumId=' + albumId
        }
        if (sortFeild) {
            url += '&&sortFeild=' + sortFeild
        }
        if (sortValue) {
            url += '&&sortValue=' + sortValue
        }
        return this.http.get(check_in_url + '/getall?' + url).pipe(map((response: any) => response))
    }

    getById(id: string): Observable<any> {
        return this.http.get(check_in_url + '/id?Id=' + id).pipe(map((response: any) => response))
    }
}
