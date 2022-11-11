import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, map, Observable, Subject } from 'rxjs';
import { Brand } from 'src/app/features/product/models/product';
import { environment } from 'src/environments/environment';
import { BrandComponent } from '../brand/brand.component';

@Injectable({
  providedIn: 'root'
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
      dialogRef.afterClosed().subscribe(result => {
        if(result?.event === true){
          this.getAllBrand();
        }
      });
  }
  changeHeader(value: string) {
    this.header.next(value);
  }

  private endPoint = environment.API_URL + '/gw/Catalog';
  private Point = environment.API_URL + '/gw/Branch'

  constructor(private http: HttpClient, private dialogService: MatDialog) { }

  getAllBrand(): Observable<Brand[]> {
    return this.http.post<Brand[]>(this.Point + '/search', '');
  }

  getdetailBrand(body: any): Observable<Brand[]> {
    return this.http.post<Brand[]>(this.endPoint + '/BrandViewDetail', body);
  }

  addBrand(body: any): Observable<Brand[]> {
    return this.http.post<Brand[]>(this.Point + '/add', body);
  }

  updateBrand(body: any): Observable<Brand[]> {
    return this.http.put<Brand[]>(this.Point + '/update', body);
  }

  searchBrand(body: any): Observable<Brand[]> {
    return this.http.post<Brand[]>(this.Point + '/search', body);
  }

  del(body: any): Observable<any> {
    return this.http.delete(this.Point + '/delete', {body}).pipe(map((response: any) => response));
  }

}
