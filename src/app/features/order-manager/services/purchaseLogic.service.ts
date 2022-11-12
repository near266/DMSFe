import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { api_gateway_url } from 'src/app/core/const/url';
import { PurchaseOrderService } from 'src/app/core/services/purchaseOrder.service';
import { PurchaseOrder, RootPurchases } from '../models/purchases';
import { FormatPurchaseService } from './formatPurchase.service';

@Injectable({
    providedIn: 'root',
})
export class PurchaseLogicService {
    private listDataSource = new BehaviorSubject<any>([]);
    private isLoadingSource = new BehaviorSubject<boolean>(true);
    private totalSource = new BehaviorSubject<number>(0);

    listData$ = this.listDataSource.asObservable();
    isLoading$ = this.isLoadingSource.asObservable();
    total$ = this.totalSource.asObservable();

    constructor(private purchaseService: PurchaseOrderService, private format: FormatPurchaseService) {}
    searchAndFormatData(body: any) {
        this.isLoadingSource.next(true);
        this.purchaseService.search(body).subscribe((data: RootPurchases) => {
            this.isLoadingSource.next(false);
            this.totalSource.next(data.totalCount);
            this.formatData(data.data);
        });
    }

    formatData(dataList: PurchaseOrder[]) {
        this.listDataSource.next(this.format.formatPurchases(dataList));
    }
}
