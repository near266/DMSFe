import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, map, Observable, Subject } from 'rxjs';
import { Unit } from 'src/app/features/product/models/product';
import { environment } from 'src/environments/environment';
import { DetailUnitComponent } from '../detail-unit/detail-unit.component';

@Injectable({
  providedIn: 'root'
})
export class UnitService {

  private totalUnits: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public totalUnits$ = this.totalUnits.asObservable();

  header: BehaviorSubject<string> = new BehaviorSubject<string>('');
  header$: Observable<string> = this.header.asObservable();
  submitForm$: Subject<boolean> = new Subject<boolean>();
  toggleEdit$: Subject<boolean> = new Subject<boolean>();
  open(data: Unit | null = null) {
    const dialogRef = this.dialogService.open(DetailUnitComponent, {
        width: '730px',
        height: '90vh',
        data,
    });
      dialogRef.afterClosed().subscribe(result => {
        if(result?.event === true){
          this.getAllUnits();
        }
      });
  }
  changeHeader(value: string) {
    this.header.next(value);
  }

  private endPoint = environment.API_URL + '/gw/Catalog';
  private Point = environment.API_URL + '/gw/Unit'

  constructor(private http: HttpClient, private dialogService: MatDialog) { }

  getAllUnits(): Observable<Unit[]> {
    return this.http.get<Unit[]>(this.endPoint + '/UnitGetAll');
  }

  getdetailUnit(id: any): Observable<Unit[]> {
    return this.http.get<Unit[]>(this.Point + '/id?Id=' + id);
  }

  addUnit(body: any): Observable<Unit[]> {
    return this.http.post<Unit[]>(this.Point + '/add', body);
  }

  updateUnit(body: any): Observable<Unit[]> {
    return this.http.put<Unit[]>(this.Point + '/update', body);
  }

  searchUnit(a: any): Observable<Unit[]> {
    return this.http.post<Unit[]>(this.Point + '/search', a);
  }

  del(body: any): Observable<any> {
    // const body = {
    //     id: unitId,
    // };
    return this.http.delete(this.Point + '/delete', {body});
  }
  

  // deleteUnit(id: string | undefined) {
  //   if (id) {
  //     return this.del(id).subscribe({
  //         next: () => {
  //             this.dialogService.closeAll();
  //         },
  //         error: (err: HttpErrorResponse) => {
  //             console.log(err);
  //         },
  //     });
  //   }
  // };

}
