import { Injectable } from '@angular/core';
import { Observable, map, of, delay, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { api_gateway_url, api_url, base_url, gateway_url, history_url } from '../const/url';
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
    private isSucessUpdateSource = new BehaviorSubject<any>('');
    private productUpdateSource = new BehaviorSubject<any>('');
    private productPromotionUpdateSource = new BehaviorSubject<any>('');
    private productRemoveSource = new BehaviorSubject<any>('');
    private productPromotionRemoveSource = new BehaviorSubject<any>('');
    private productAddSource = new BehaviorSubject<any>('');
    private productPromotionAddSource = new BehaviorSubject<any>('');

    page = this.pageSource.asObservable();
    total = this.totalSource.asObservable();
    index = this.indexSource.asObservable();
    id = this.idSource.asObservable();
    msg = this.msgSource.asObservable();
    productPage = this.productPageSource.asObservable();
    updateOrder = this.updateOrderSource.asObservable();
    isSucessUpdate = this.isSucessUpdateSource.asObservable();
    productUpdate = this.productUpdateSource.asObservable();
    productPromotionUpdate = this.productPromotionUpdateSource.asObservable();
    productRemove = this.productRemoveSource.asObservable();
    productPromotionRemove = this.productPromotionRemoveSource.asObservable();
    productAdd = this.productAddSource.asObservable();
    productPromotionAdd = this.productPromotionAddSource.asObservable();

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
    // update product
    sendProductUpdate(list: any) {
        this.productUpdateSource.next(list);
    }
    sendProductPromotionUpdate(list: any) {
        this.productPromotionUpdateSource.next(list);
    }
    // remove product
    sendProductRemove(list: any) {
        this.productRemoveSource.next(list);
    }
    sendProductPromotionRemove(list: any) {
        this.productPromotionRemoveSource.next(list);
    }

    // add product
    sendProductAdd(list: any) {
        this.productAddSource.next(list);
    }
    sendProductPromotionAdd(list: any) {
        this.productPromotionAddSource.next(list);
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

    createOrder(body: any): Observable<any> {
        return this.http
            .post(this.api_gateway_url + '/PurchaseOrder/add', body, { responseType: 'text' })
            .pipe(map((reponse: any) => reponse));
    }
    archive(body: any): Observable<any> {
        return this.http
            .put(this.api_gateway_url + '/PurchaseOrder/arhived', body)
            .pipe(map((reponse: any) => reponse));
    }

    unArchive(body: any): Observable<any> {
        return this.http
            .put(this.api_gateway_url + '/PurchaseOrder/unarhived', body)
            .pipe(map((reponse: any) => reponse));
    }

    updateProductList(body: any): Observable<any> {
        return this.http
            .put(this.api_gateway_url + '/PurchaseOrder/updateProduct', body)
            .pipe(map((reponse: any) => reponse));
    }
    removeProduct(bodyGet: any): Observable<any> {
        const options = {
            body: bodyGet,
        };
        return this.http
            .delete(this.api_gateway_url + '/PurchaseOrder/removeProduct', options)
            .pipe(map((reponse: any) => reponse));
    }
    addProduct(body: any): Observable<any> {
        return this.http
            .post(this.api_gateway_url + '/PurchaseOrder/addProduct', body)
            .pipe(map((reponse: any) => reponse));
    }

    searchArchived(body: any): Observable<any> {
        return this.http
            .post(this.api_gateway_url + '/PurchaseOrder/searchArchived', body)
            .pipe(map((reponse: any) => reponse));
    }

    searchArchivedProduct(body: any): Observable<any> {
        return this.http
            .post(this.api_gateway_url + '/Catalog/listArchivedProduct', body)
            .pipe(map((reponse: any) => reponse));
    }

    deleteProduct(body: any): Observable<any> {
        return this.http
            .delete(this.api_gateway_url + '/Catalog/delete', { body })
            .pipe(map((reponse: any) => reponse));
    }

    deleteAll(body: any): Observable<any> {
        return this.http
            .put(this.api_gateway_url + '/PurchaseOrder/deleteall', body)
            .pipe(map((reponse: any) => reponse));
    }

    // customer
    searchCustomer(body: any): Observable<any> {
        return this.http
            .post(this.api_gateway_url + '/Customer/search', body, { responseType: 'json' })
            .pipe(map((reponse: any) => reponse));
    }

    getCustomerById(id: string): Observable<any> {
        return this.http.get(this.api_gateway_url + '/Customer/id?Id=' + id).pipe(map((reponse: any) => reponse));
    }

    searchCustomerByRouteId(body: any): Observable<any> {
        return this.http
            .post(this.api_gateway_url + '/Route/searchAllCusInRoute', body)
            .pipe(map((reponse: any) => reponse));
    }

    // product
    getAllProduct(body: any): Observable<any> {
        return this.http.post(this.api_gateway_url + '/Catalog/search', body).pipe(map((reponse: any) => reponse));
    }

    getListProductActived(body: any): Observable<any> {
        return this.http
            .post(this.api_gateway_url + '/Catalog/getListActive', body)
            .pipe(map((reponse: any) => reponse));
    }

    // employee
    getAllEmployees(keyword: any, page: number, pageSize: number): Observable<any> {
        return this.http.get(
            this.id_url_gw +
                '/Employee/SearchAllEmployee?keyword=' +
                keyword +
                '&page=' +
                page +
                '&pageSize=' +
                pageSize,
        );
    }

    getEmployeeById(id: string): Observable<any> {
        return this.http
            .get(this.id_url_gw + '/Employee/GetEmployeeById?Id=' + id)
            .pipe(map((reponse: any) => reponse));
    }

    searchEmployeeInGroup(keyword: string, groupId: string, page: number, pageSize: number): Observable<any> {
        return this.http
            .get(
                this.id_url_gw +
                    '/SearchEmployeeInGroup?keyword=' +
                    keyword +
                    '&GroupId=' +
                    groupId +
                    '&page=' +
                    page +
                    '&pageSize=' +
                    pageSize,
            )
            .pipe(map((reponse: any) => reponse));
    }

    // warehouse
    getAllWarehouses(): Observable<any> {
        return this.http.get(this.api_gateway_url + '/Warehouse/getall').pipe(map((reponse: any) => reponse));
    }

    // route
    getAllRoute(page: number, pageSize: number, keyword: any): Observable<any> {
        return this.http
            .get<{ data: any[]; totalCount: number }>(
                this.api_gateway_url + '/Route/getall?keyword=' + keyword + '&page=' + page + '&pagesize=' + pageSize,
            )
            .pipe(map((reponse: any) => reponse));
    }

    getRouteByCustomerId(id: string): Observable<any> {
        return this.http.get(this.api_gateway_url + '/Route/by_cusId?Id=' + id).pipe(map((reponse: any) => reponse));
    }

    SearchAllRouteByCustomerId(id: string): Observable<any> {
        return this.http.get(this.api_gateway_url + '/Route/SearchAllRouteByCustomerId?Id=' + id);
    }

    getRouteAndGroupIdByEmployeeId(id: string, page: number, pageSize: number): Observable<any> {
        return this.http
            .get(this.api_gateway_url + '/Route/getall?EmployeeId=' + id + '&page=' + page + '&pageSize=' + pageSize)
            .pipe(map((reponse: any) => reponse));
    }

    // searach theo keyword và groupId
    searchRoute(keyword: string, groupId: string, page: number, pageSize: number): Observable<any> {
        return this.http.get(
            this.api_gateway_url +
                '/Route/getall?keyword=' +
                keyword +
                '&GroupId=' +
                groupId +
                '&page=' +
                page +
                '&pageSize=' +
                pageSize,
        );
    }

    getRouteById(id: string): Observable<any> {
        return this.http.get(this.api_gateway_url + '/Route/id?Id=' + id).pipe(map((reponse: any) => reponse));
    }

    searchAllRouteByGroupId(groupId: string): Observable<any> {
        return this.http.get(this.api_gateway_url + '/Route/SearchAllRouteByGroupId?Id=' + groupId);
    }

    // group
    getAllGroup(type: number): Observable<any> {
        return this.http.get(this.id_url_gw + '/GetAllGroupByType?type=' + type).pipe(map((reponse: any) => reponse));
    }

    print(body: any): Observable<any> {
        let optionHeader = { responseType: 'text' };
        return this.http
            .post(this.api_gateway_url + '/PurchaseOrder/print', body, { responseType: 'blob' })
            .pipe(map((res) => res));
    }

    print006(body: any): Observable<any> {
        let optionHeader = { responseType: 'text' };
        return this.http
            .post(this.api_gateway_url + '/PurchaseOrder/print006', body, { responseType: 'blob' })
            .pipe(map((res) => res));
    }
}
