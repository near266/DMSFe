import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PurchaseOrderService } from 'src/app/core/services/purchaseOrder.service';
import { GroupModel } from '../models/group';
import { Product, ProductSearch } from '../models/product';

@Injectable({
    providedIn: 'root',
})
export class CommonLogicService {
    listSearchedProduct: Product[] = [];

    private listRouteSource = new BehaviorSubject<any[]>([]);
    private listEmployeeSource = new BehaviorSubject<any[]>([]);
    private listSaleEmployeeSource = new BehaviorSubject<any[]>([]);
    private listCusSource = new BehaviorSubject<any[]>([]);
    private listGroupSource = new BehaviorSubject<GroupModel[]>([]);
    private isEditSource = new BehaviorSubject<boolean>(false);
    private listProductActiveSource = new BehaviorSubject<Product[]>([]);

    listRoute$ = this.listRouteSource.asObservable();
    listEmployee$ = this.listEmployeeSource.asObservable();
    listSaleEmployee$ = this.listSaleEmployeeSource.asObservable();
    listCus$ = this.listCusSource.asObservable();
    listGroup$ = this.listGroupSource.asObservable();
    isEdit$ = this.isEditSource.asObservable();
    listProductActive$ = this.listProductActiveSource.asObservable();

    constructor(private purchaseOrder: PurchaseOrderService) {}

    searchListProductActived(value: any) {
        const body = {
            keyword: value,
            sortBy: {
                property: 'CreatedDate',
                value: true,
            },
            page: 1,
            pageSize: 3,
        };
        this.purchaseOrder.getListProductActived(body).subscribe((data: ProductSearch) => {
            this.listProductActiveSource.next(data.data);
        });
    }

    getListRoute(roleMain: string) {
        this.purchaseOrder.getAllRoute(1, 30, '').subscribe((data) => {
            console.log(data.data);
            this.listRouteSource.next(data.data);
        });
    }

    // gọi tùy theo role
    getListEmployee(roleMain: string) {
        let idDefault = this.getIdDefault();
        if (roleMain != 'member') {
            this.purchaseOrder.getAllEmployees('', 1, 30).subscribe((data) => {
                this.listEmployeeSource.next(data.data);
            });
        } else if (roleMain === 'member') {
            this.purchaseOrder.getEmployeeById(idDefault).subscribe((data) => {
                if (data) {
                    this.listEmployeeSource.next(data);
                }
            });
        }
    }

    // gọi tùy theo role
    getListSaleEmployee(roleMain: string) {
        let idDefault = this.getIdDefault();
        if (roleMain != 'member') {
            this.purchaseOrder.getAllEmployees('', 1, 30).subscribe((data) => {
                this.listSaleEmployeeSource.next(data.data);
            });
        } else if (roleMain === 'member') {
            this.purchaseOrder.getEmployeeById(idDefault).subscribe((data) => {
                if (data) {
                    this.listSaleEmployeeSource.next(data);
                }
            });
        }
    }

    // gọi tùy theo role
    getIdDefault() {
        return this.parseJwt(localStorage.getItem('access_token')).sid;
    }

    // gọi tùy theo role
    getListCus(roleMain: string) {
        // if (roleMain != 'member') {

        // } else if (roleMain === 'member') {
        //     this.purchaseOrder.searchCustomer({ keyword: '', page: 1, pageSize: 30 }).subscribe((data) => {
        //         this.listCusSource.next(data.data);
        //     });
        // }
        this.purchaseOrder.searchCustomer({ keyword: '', page: 1, pageSize: 30 }).subscribe((data) => {
            console.log(data.data);
            this.listCusSource.next(data.data);
        });
    }

    getListGroup() {
        this.purchaseOrder.getAllGroup(1).subscribe((data) => {
            this.listGroupSource.next(data);
        });
    }

    parseJwt(token: any) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(
            window
                .atob(base64)
                .split('')
                .map(function (c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                })
                .join(''),
        );
        return JSON.parse(jsonPayload);
    }

    changeTypeEdit(value: boolean) {
        this.isEditSource.next(value);
    }

    pushCusToListCus(id: string) {
        this.purchaseOrder.getCustomerById(id).subscribe((data) => this.listCusSource.next([data]));
    }

    pushOrderEmployeeToListEmployee(orderEmployeeId: string) {
        this.purchaseOrder.getEmployeeById(orderEmployeeId).subscribe((data) => this.listEmployeeSource.next([data]));
    }

    pushSaleEmployeeToListEmployee(saleEmployeeId: string) {
        this.purchaseOrder
            .getEmployeeById(saleEmployeeId)
            .subscribe((data) => this.listSaleEmployeeSource.next([data]));
    }

    pushRouteToListRoute(routeId: string) {
        this.purchaseOrder.getRouteById(routeId).subscribe((data) => this.listRouteSource.next([data]));
    }
}
