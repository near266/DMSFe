import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, map, Observable, Subject } from 'rxjs';
import { Supplier } from 'src/app/features/product/models/product';
import { environment } from 'src/environments/environment';
import { TypeExport } from '../../common/common.service';
import { SupplierComponent } from '../supplier/supplier.component';

@Injectable({
    providedIn: 'root',
})
export class SupplierService {
    header: BehaviorSubject<string> = new BehaviorSubject<string>('');
    header$: Observable<string> = this.header.asObservable();
    submitForm$: Subject<boolean> = new Subject<boolean>();
    toggleEdit$: Subject<boolean> = new Subject<boolean>();
    open(data: Supplier | null = null) {
        const dialogRef = this.dialogService.open(SupplierComponent, {
            width: '750px',
            height: '95vh',
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

    // private endPoint = environment.API_URL + '/gw/Catalog';
    private Point = environment.API_URL + '/gw/Supplier';

    constructor(private http: HttpClient, private dialogService: MatDialog) {}

    getAllSupplier(body: any): Observable<any> {
        return this.http.post(this.Point + '/searchRequest', body); //hiển thị thêm thông tin (api cần trả thêm)
    }

    getdetailSupplier(id: any): Observable<Supplier[]> {
        return this.http.get<Supplier[]>(this.Point + '/id?Id=' + id);
    }

    addSupplier(body: any): Observable<Supplier[]> {
        return this.http.post<Supplier[]>(this.Point + '/add', body);
    }

    updateSupplier(body: any): Observable<Supplier[]> {
        return this.http.put<Supplier[]>(this.Point + '/update', body);
    }

    searchSupplier(keyword: any): Observable<Supplier[]> {
        return this.http.post<Supplier[]>(this.Point + '/searchRequest', keyword);
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
