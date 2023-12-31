import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, map, Observable, Subject } from 'rxjs';
import { Brand } from 'src/app/features/product/models/product';
import { environment } from 'src/environments/environment';
import { TypeExport } from '../../common/common.service';
import { BrandComponent } from '../brand/brand.component';

@Injectable({
    providedIn: 'root',
})
export class BranchService {
    private totalBranchs: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    public totalBranchs$ = this.totalBranchs.asObservable();

    header: BehaviorSubject<string> = new BehaviorSubject<string>('');
    header$: Observable<string> = this.header.asObservable();
    submitForm$: Subject<boolean> = new Subject<boolean>();
    toggleEdit$: Subject<boolean> = new Subject<boolean>();
    open(data: Brand | null = null) {
        const dialogRef = this.dialogService.open(BrandComponent, {
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

    // private endPoint = environment.API_URL + '/gw/Catalog';
    private Point = environment.API_URL + '/gw/Branch';

    constructor(private http: HttpClient, private dialogService: MatDialog) {}

    getAllBrand(body: any): Observable<any> {
        return this.http.post(this.Point + '/searchRequest', body);
    }

    getdetailBrand(id: any): Observable<Brand[]> {
        return this.http.get<Brand[]>(this.Point + '/id?Id=' + id);
    }

    addBrand(body: any): Observable<Brand[]> {
        return this.http.post<Brand[]>(this.Point + '/add', body);
    }

    updateBrand(body: any): Observable<Brand[]> {
        return this.http.put<Brand[]>(this.Point + '/update', body);
    }

    searchBrand(keyword: any): Observable<any> {
        return this.http.post<Brand[]>(this.Point + '/searchRequest', keyword);
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
