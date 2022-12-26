import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, map, Observable, Subject } from 'rxjs';
import { CustomerType } from 'src/app/core/model/CustomerType';
import { environment } from 'src/environments/environment';
import { CustomerTypeComponent } from '../customer-type/customer-type.component';

@Injectable({
  providedIn: 'root'
})
export class CustomerTypeService {

  private totalcustomerTypes: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public totalcustomerTypes$ = this.totalcustomerTypes.asObservable();

  header: BehaviorSubject<string> = new BehaviorSubject<string>('');
  header$: Observable<string> = this.header.asObservable();
  submitForm$: Subject<boolean> = new Subject<boolean>();
  toggleEdit$: Subject<boolean> = new Subject<boolean>();
  open(data: CustomerType | null = null) {
    const dialogRef = this.dialogService.open(CustomerTypeComponent, {
        width: '730px',
        height: '90vh',
        data,
    });
      dialogRef.afterClosed().subscribe(result => {
        if(result?.event === true){
          // this.getAllBrand();
        }
      });
  }
  changeHeader(value: string) {
    this.header.next(value);
  }

  private Point = environment.API_URL + '/gw/CustomerType'

  constructor(private http: HttpClient, private dialogService: MatDialog) { }

  getAllCustomerType(body: any): Observable<any> {
    return this.http.post(this.Point + '/search', body);
  }

  getdetailCustomerType(id: any): Observable<CustomerType[]> {
    return this.http.get<CustomerType[]>(this.Point + '/id?Id=' + id);
  }

  addCustomerType(body: any): Observable<CustomerType[]> {
    return this.http.post<CustomerType[]>(this.Point + '/add', body);
  }

  updateCustomerType(body: any): Observable<CustomerType[]> {
    return this.http.put<CustomerType[]>(this.Point + '/update', body);
  }

  searchCustomerType(keyword: any): Observable<any> {
    return this.http.post(this.Point + '/search', keyword);
  }

  del(body: any): Observable<any> {
    return this.http.delete(this.Point + '/delete', {body}).pipe(map((response: any) => response));
  }
  
}
