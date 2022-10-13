import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of, delay, BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class SaleReceiptService {
    mockApi = 'https://6346eabf04a6d457579c4afd.mockapi.io/salesReceipt';

    private pageSource = new BehaviorSubject<number>(1);
    private totalSource = new BehaviorSubject<number>(1);
    private idSource = new BehaviorSubject<any>('');
    private indexSource = new BehaviorSubject<any>({ startIndex: 1, endIndex: 2 });
    private msgSource = new BehaviorSubject<string>('');
    private productPageSource = new BehaviorSubject<number>(1);
    page = this.pageSource.asObservable();
    total = this.totalSource.asObservable();
    index = this.indexSource.asObservable();
    id = this.idSource.asObservable();
    msg = this.msgSource.asObservable();
    productPage = this.msgSource.asObservable();

    setTotal(total: number) {
        this.totalSource.next(total);
    }
    setStartAndEndIndex(startIndex: number, endIndex: number) {
        this.indexSource.next({ startIndex, endIndex });
    }
    passId(id: string) {
        this.idSource.next(id);
    }
    isChangeStatus(msg: string) {
        this.msgSource.next(msg);
    }
    changePage(page: number) {
        this.pageSource.next(page);
    }
    changeProductPage(productPage: number) {
        this.productPageSource.next(productPage);
    }

    constructor(private http: HttpClient) {}
    search(): Observable<any> {
        return this.http.get(this.mockApi).pipe(map((reponse: any) => reponse));
    }
    searchById(id: string): Observable<any> {
        return this.http.get(this.mockApi + '/' + id).pipe(map((reponse: any) => reponse));
    }
    updateOrder(id: string, body: any): Observable<any> {
        return this.http.put(this.mockApi + '/' + id, body).pipe(map((reponse: any) => reponse));
    }
}
