import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of, delay, BehaviorSubject } from 'rxjs';
import { api_gateway_url } from '../const/url';

@Injectable({
    providedIn: 'root',
})
export class SaleReceiptService {
    mockApi = 'https://6346eabf04a6d457579c4afd.mockapi.io/salesReceipt';
    api_gateway_url = api_gateway_url;
    private pageSource = new BehaviorSubject<number>(1);
    private totalSource = new BehaviorSubject<number>(1);
    private idSource = new BehaviorSubject<any>('');
    private indexSource = new BehaviorSubject<any>({ startIndex: 1, endIndex: 2 });
    private msgSource = new BehaviorSubject<string>('');
    private productPageSource = new BehaviorSubject<number>(1);
    private updateOrderSource = new BehaviorSubject<number>(1);
    private isSucessUpdateSource = new BehaviorSubject<any>('');
    private productUpdateSource = new BehaviorSubject<any>('');
    private productRemoveSource = new BehaviorSubject<any>('');
    private productAddSource = new BehaviorSubject<any>('');

    page = this.pageSource.asObservable();
    total = this.totalSource.asObservable();
    index = this.indexSource.asObservable();
    id = this.idSource.asObservable();
    msg = this.msgSource.asObservable();
    productPage = this.msgSource.asObservable();
    updateOrderPass = this.updateOrderSource.asObservable();
    isSucessUpdate = this.isSucessUpdateSource.asObservable();
    productUpdate = this.productUpdateSource.asObservable();
    productRemove = this.productRemoveSource.asObservable();
    productAdd = this.productAddSource.asObservable();

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
    isSuccessUpdate(msg: string) {
        this.isSucessUpdateSource.next(msg);
    }
    sendProductUpdate(list: any) {
        this.productUpdateSource.next(list);
    }
    sendProductRemove(list: any) {
        this.productRemoveSource.next(list);
    }
    sendProductAdd(list: any) {
        this.productAddSource.next(list);
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

    // API official
    create(body: any): Observable<any> {
        return this.http
            .post(this.api_gateway_url + '/SaleReceipt/add', body, { responseType: 'text' })
            .pipe(map((response: any) => response));
    }

    searchReceipt(body: any): Observable<any> {
        return this.http
            .post(this.api_gateway_url + '/SaleReceipt/search', body)
            .pipe(map((response: any) => response));
    }

    searchReceiptById(id: string): Observable<any> {
        return this.http.get(this.api_gateway_url + '/SaleReceipt/id?Id=' + id).pipe(map((response: any) => response));
    }

    update(body: any): Observable<any> {
        return this.http.put(this.api_gateway_url + '/SaleReceipt/update', body).pipe(map((response: any) => response));
    }

    archive(body: any): Observable<any> {
        return this.http
            .put(this.api_gateway_url + '/SaleReceipt/arhivedOrUnArchived', body)
            .pipe(map((response: any) => response));
    }

    createReturnOrder(body: any): Observable<any> {
        return this.http
            .post(this.api_gateway_url + '/ReturnsOrder/add', body, { responseType: 'text' })
            .pipe(map((response: any) => response));
    }
    updateProductList(body: any): Observable<any> {
        return this.http
            .put(this.api_gateway_url + '/SaleReceipt/updateProduct', body)
            .pipe(map((reponse: any) => reponse));
    }
    removeProduct(bodyGet: any): Observable<any> {
        const options = {
            body: bodyGet,
        };
        return this.http
            .delete(this.api_gateway_url + '/SaleReceipt/removeProduct', options)
            .pipe(map((reponse: any) => reponse));
    }
    addProduct(body: any): Observable<any> {
        return this.http
            .post(this.api_gateway_url + '/SaleReceipt/addProduct', body)
            .pipe(map((reponse: any) => reponse));
    }
    export(body:any):Observable<any>{
      return this.http.post(this.api_gateway_url + "SaleReceipt/export", body)
      .pipe(
        map(res => res)
      )
    }
}
