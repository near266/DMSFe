import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, map, Observable, Subject } from 'rxjs';
import { Area } from 'src/app/core/model/Area';
import { environment } from 'src/environments/environment';
import { TypeExport } from '../../common/common.service';
import { AreaComponent } from '../area/area.component';

@Injectable({
    providedIn: 'root',
})
export class AreaService {
    private totalAreas: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    public totalAreas$ = this.totalAreas.asObservable();

    header: BehaviorSubject<string> = new BehaviorSubject<string>('');
    header$: Observable<string> = this.header.asObservable();
    submitForm$: Subject<boolean> = new Subject<boolean>();
    toggleEdit$: Subject<boolean> = new Subject<boolean>();
    open(data: Area | null = null) {
        const dialogRef = this.dialogService.open(AreaComponent, {
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
    private Point = environment.API_URL + '/gw/Area';

    constructor(private http: HttpClient, private dialogService: MatDialog) {}

    getAllArea(body: any): Observable<any> {
        return this.http.post(this.Point + '/search', body);
    }

    getdetailArea(id: any): Observable<Area[]> {
        return this.http.get<Area[]>(this.Point + '/id?Id=' + id);
    }

    addArea(body: any): Observable<Area[]> {
        return this.http.post<Area[]>(this.Point + '/add', body);
    }

    updateArea(body: any): Observable<Area[]> {
        return this.http.put<Area[]>(this.Point + '/update', body);
    }

    searchArea(keyword: any): Observable<any> {
        return this.http.post<Area[]>(this.Point + '/search', keyword);
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
