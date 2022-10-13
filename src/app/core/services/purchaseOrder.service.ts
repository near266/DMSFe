import { Injectable } from '@angular/core';
import { Observable, map, of, delay, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import purchaseOrdersList from 'src/app/features/orders-mgm/mocks/PurchaseOrders';
@Injectable({
    providedIn: 'root',
})
export class PurchaseOrderService {
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

    url = 'https://6346eabf04a6d457579c4afd.mockapi.io/purchaseOrders';
    productUrl = 'https://6346eabf04a6d457579c4afd.mockapi.io/products';
    constructor(private http: HttpClient) {}
    // searchFilterPurchaseOrder(): Observable<any> {
    //     return of(purchaseOrdersList).pipe(delay(50));
    // }
    searchFilterPurchaseOrder(): Observable<any> {
        return this.http.get(this.url).pipe(map((reponse: any) => reponse));
    }
    getPurchaseDetail(id: any): Observable<any> {
        return this.http.get(this.url + '/' + id).pipe(map((reponse: any) => reponse));
    }
    updateStatusPurchaseDetail(body: any, id: any): Observable<any> {
        return this.http.put(this.url + '/' + id, body).pipe(map((reponse: any) => reponse));
    }
    deletePurchase(id: string): Observable<any> {
        return this.http.delete(this.url + '/' + id).pipe(map((reponse: any) => reponse));
    }
    searchListProduct(): Observable<any> {
        return this.http.get(this.productUrl).pipe(map((reponse: any) => reponse));
    }
}
