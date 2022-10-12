import { Injectable } from '@angular/core';
import { Observable, map, of, delay, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import purchaseOrdersList from 'src/app/features/orders-mgm/mocks/PurchaseOrders';
@Injectable({
    providedIn: 'root',
})
export class PurchaseOrderService {
    private pageSource = new BehaviorSubject<number>(1);
    page = this.pageSource.asObservable();
    private totalSource = new BehaviorSubject<number>(1);
    total = this.totalSource.asObservable();
    private indexSource = new BehaviorSubject<any>({ startIndex: 1, endIndex: 2 });
    index = this.indexSource.asObservable();

    url = 'https://6346eabf04a6d457579c4afd.mockapi.io/purchaseOrders';
    constructor(private http: HttpClient) {}
    searchFilterPurchaseOrder(): Observable<any> {
        return of(purchaseOrdersList).pipe(delay(50));
    }
    searchFilterPurchaseOrderMockAPI(): Observable<any> {
        return this.http.get(this.url).pipe(map((reponse: any) => reponse));
    }
    getPurchaseDetail(id: any): Observable<any> {
        return this.http.get(this.url + '/:' + id).pipe(map((reponse: any) => reponse));
    }
    changePage(page: number) {
        this.pageSource.next(page);
    }
    setTotal(total: number) {
        this.totalSource.next(total);
    }
    setStartAndEndIndex(startIndex: number, endIndex: number) {
        this.indexSource.next({ startIndex, endIndex });
    }
}
