import { Injectable } from '@angular/core';
import { Observable, map, of, delay, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import purchaseOrdersList from 'src/app/features/orders-mgm/mocks/PurchaseOrders';
import { api_gateway_url, api_url, base_url, gateway_url } from '../const/url';
@Injectable({
    providedIn: 'root',
})
export class PurchaseOrderService {
    private pageSource = new BehaviorSubject<number>(1);
    private totalSource = new BehaviorSubject<number>(1);
    private idSource = new BehaviorSubject<any>('');
    private indexSource = new BehaviorSubject<any>({ startIndex: 1, endIndex: 2 });
    private msgSource = new BehaviorSubject<string>('');
    private updateOrderSource = new BehaviorSubject<any>('');
    private productPageSource = new BehaviorSubject<number>(1);
    page = this.pageSource.asObservable();
    total = this.totalSource.asObservable();
    index = this.indexSource.asObservable();
    id = this.idSource.asObservable();
    msg = this.msgSource.asObservable();
    productPage = this.productPageSource.asObservable();
    updateOrder = this.updateOrderSource.asObservable();

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
    sendBodyUpdate(body: any) {
        this.updateOrderSource.next(body);
    }

    url = 'https://6346eabf04a6d457579c4afd.mockapi.io/purchaseOrders';
    productUrl = 'https://6346eabf04a6d457579c4afd.mockapi.io/products';

    api_gateway_url = api_gateway_url;
    id_url_gw = base_url + '/gw';

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

    // API Official

    search(body: any): Observable<any> {
        return this.http
            .post(this.api_gateway_url + '/PurchaseOrder/search', body)
            .pipe(map((reponse: any) => reponse));
    }

    detail(id: string): Observable<any> {
        return this.http.get(this.api_gateway_url + '/PurchaseOrder/id?Id=' + id).pipe(map((reponse: any) => reponse));
    }

    update(body: any): Observable<any> {
        return this.http.put(this.api_gateway_url + '/PurchaseOrder/update', body).pipe(map((reponse: any) => reponse));
    }

    create(body: any): Observable<any> {
        return this.http.post(this.api_gateway_url + '/PurchaseOrder/add', body).pipe(map((reponse: any) => reponse));
    }

    // customer
    searchCustomer(body: any): Observable<any> {
        return this.http.post(this.api_gateway_url + '/Customer/search', body).pipe(map((reponse: any) => reponse));
    }

    // product
    getAllProduct(body: any): Observable<any> {
        return this.http.post(this.api_gateway_url + '/Catalog/search', body).pipe(map((reponse: any) => reponse));
    }

    // employee
    getAllEmployees(page: number, pageSize: number): Observable<any> {
        return this.http.get(this.id_url_gw + '/Employee/SearchAllEmployee?page=' + page + '&pageSize=' + pageSize);
    }
}
