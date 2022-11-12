import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Return } from '../models/return';

@Injectable({
    providedIn: 'root',
})
export class ReturnApiService {
    private endPoint = environment.API_URL + '/gw/PurchaseOrder';
    private EmployeeUrl = environment.ID_URL + '/gw/Employee';
    private returnUrl = environment.API_URL + '/gw/ReturnsOrder';
    private idUrl = environment.ID_URL + '/gw';

    constructor(private http: HttpClient) {}

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
    getEmployeesByGroup(id: string): Observable<any> {
        return this.http.get<any[]>(this.idUrl + '/SearchEmployeeInGroup', {
            params: {
                GroupId: id,
                pageSize: 100,
                page: 1,
            },
        });
    }

    createNewReturn(form: any): Observable<any> {
        return this.http.post(this.returnUrl + '/add', form, { responseType: 'text' });
    }
    updateReturn(form: any): Observable<any> {
        return this.http.put(this.returnUrl + '/update', form, { responseType: 'text' });
    }

    archiveReturn(id: string) {
        return this.http.put(this.returnUrl + '/arhivedOrUn', { returnsIds: [id] });
    }

    getAllReturns(settings: any) {
        return this.http.post<any>(this.returnUrl + '/search', settings);
    }

    getReturnById(id: string | null): Observable<any> {
        return this.http.get<any>(this.returnUrl + '/id?Id=' + id);
    }
    deleteProductFromReturn({ listIdRemove, returnsId }: any) {
        console.log(listIdRemove);
        return this.http.delete(this.returnUrl + '/removeProduct', {
            body: {
                listIdRemove,
                returnsId,
            },
        });
    }
    addProductToReturn(payload: any[]) {
        return this.http.post(this.returnUrl + '/addProduct', {
            returnsProducts: [...payload],
        });
    }
    updateProductToReturn(payload: any[]) {
        return this.http.put(this.returnUrl + '/updateProduct', {
            returnsProducts: [...payload],
        });
    }
}
