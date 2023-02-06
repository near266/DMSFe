import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, map, Observable, Subject } from 'rxjs';
import { CustomerGroup } from 'src/app/core/model/CustomerGroup';
import { environment } from 'src/environments/environment';
import { TypeExport } from '../../common/common.service';
import { CustomerGroupComponent } from '../customer-group/customer-group.component';

@Injectable({
    providedIn: 'root',
})
export class CustomerGroupsService {
    private totalcustomerGroups: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    public totalcustomerGroups$ = this.totalcustomerGroups.asObservable();

    header: BehaviorSubject<string> = new BehaviorSubject<string>('');
    header$: Observable<string> = this.header.asObservable();
    submitForm$: Subject<boolean> = new Subject<boolean>();
    toggleEdit$: Subject<boolean> = new Subject<boolean>();
    open(data: CustomerGroup | null = null) {
        const dialogRef = this.dialogService.open(CustomerGroupComponent, {
            width: '730px',
            height: '90vh',
            data,
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result?.event === true) {
                // this.getAllBrand();
            }
        });
    }
    changeHeader(value: string) {
        this.header.next(value);
    }

    private Point = environment.API_URL + '/gw/CustomerGroup';

    constructor(private http: HttpClient, private dialogService: MatDialog) {}

    getAllCustomerGroup(body: any): Observable<any> {
        return this.http.post(this.Point + '/search', body);
    }

    getdetailCustomerGroup(id: any): Observable<CustomerGroup[]> {
        return this.http.get<CustomerGroup[]>(this.Point + '/id?Id=' + id);
    }

    addCustomerGroup(body: any): Observable<CustomerGroup[]> {
        return this.http.post<CustomerGroup[]>(this.Point + '/add', body);
    }

    updateCustomerGroup(body: any): Observable<CustomerGroup[]> {
        return this.http.put<CustomerGroup[]>(this.Point + '/update', body);
    }

    searchCustomerGroup(keyword: any): Observable<any> {
        return this.http.post<CustomerGroup[]>(this.Point + '/search', keyword);
    }

    del(body: any): Observable<any> {
        return this.http.delete(this.Point + '/delete', { body }).pipe(map((response: any) => response));
    }

    export(type: number, data: any): Observable<any> {
        let body: any = {
            type: type,
        };
        if (type === TypeExport.Selected) {
            body.listId = data;
        } else {
            body.filter = data;
        }
        return this.http.post(this.Point + '/export', body, { responseType: 'blob' });
    }
}
