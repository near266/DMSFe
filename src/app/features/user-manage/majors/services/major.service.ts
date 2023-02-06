import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, map, Observable, Subject } from 'rxjs';
import { Major } from 'src/app/features/product/models/product';
import { environment } from 'src/environments/environment';
import { TypeExport } from '../../common/common.service';
import { MajorComponent } from '../major/major.component';

@Injectable({
    providedIn: 'root',
})
export class MajorService {
    private totalMajors: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    public totalMajors$ = this.totalMajors.asObservable();

    header: BehaviorSubject<string> = new BehaviorSubject<string>('');
    header$: Observable<string> = this.header.asObservable();
    submitForm$: Subject<boolean> = new Subject<boolean>();
    toggleEdit$: Subject<boolean> = new Subject<boolean>();
    open(data: Major | null = null) {
        const dialogRef = this.dialogService.open(MajorComponent, {
            width: '730px',
            height: '90vh',
            data,
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result?.event === true) {
            }
        });
    }
    changeHeader(value: string) {
        this.header.next(value);
    }

    private endPoint = environment.API_URL + '/gw/Catalog';
    private Point = environment.API_URL + '/gw/Major';

    constructor(private http: HttpClient, private dialogService: MatDialog) {}

    getAllMajor(body: any): Observable<any> {
        return this.http.post(this.Point + '/searchRequest', body);
    }

    getdetailMajor(id: any): Observable<Major[]> {
        return this.http.get<Major[]>(this.Point + '/id?Id=' + id); // trường debtLimit chuyển từ string => boolean
    }

    addMajor(body: any): Observable<Major[]> {
        return this.http.post<Major[]>(this.Point + '/add', body);
    }

    updateMajor(body: any): Observable<Major[]> {
        return this.http.put<Major[]>(this.Point + '/update', body);
    }

    searchMajor(keyword: any): Observable<Major[]> {
        return this.http.post<Major[]>(this.Point + '/searchRequest', keyword);
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
