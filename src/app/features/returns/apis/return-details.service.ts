import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Return } from '../models/return';

@Injectable({
    providedIn: 'root',
})
export class ReturnDetailsService {
    private endPoint = environment.API_URL + '/gw/PurchaseOrder';
    private EmployeeUrl = environment.ID_URL + '/gw/Employee';
    private idUrl = environment.ID_URL + '/gw';

    constructor(private http: HttpClient) {}
    //GET
    getOrderDetailsById(id: string): Observable<Return> {
        return this.http.get<Return>(this.endPoint + '/id?Id=' + id);
    }
    getEmployees(): Observable<any> {
        const pageSize = 100;
        const page = 1;
        return this.http.get<any[]>(this.EmployeeUrl + '/SearchAllEmployee?page=' + page + '&pageSize=' + pageSize);
    }
    // Fix cứng vs type = 1
    getGroups(): Observable<any> {
        return this.http.get<any[]>(this.idUrl + '/GetAllGroupByType?type=1');
    }
}
