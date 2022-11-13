import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import moment from 'moment';
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

    constructor(
        private purchaseService: PurchaseOrderService,
        private format: FormatPurchaseService,
        private router: Router,
    ) {}
    searchAndFormatData(body: any, listIdSelected: string[]) {
        this.isLoadingSource.next(true);
        this.purchaseService.search(body).subscribe((data: RootPurchases) => {
            this.isLoadingSource.next(false);
            this.totalSource.next(data.totalCount);
            let dataAfterFormat = this.formatData(data.data);
            // lặp qua để lấy lại các order đã được select
            let dataAfterFormatToGetChoosedOrder = this.loopToGetOrderChoosed(dataAfterFormat, listIdSelected);
            // gửi đi giá trị
            this.listDataSource.next(dataAfterFormatToGetChoosedOrder);
        });
    }

    loopToGetOrderChoosed(listOrder: any, listIdSelected: string[]) {
        listOrder.forEach((order: any) => {
            if (listIdSelected.includes(order.id)) {
                order.checked = true;
            }
        });
        return listOrder;
    }

    formatData(dataList: PurchaseOrder[]) {
        return this.format.formatPurchases(dataList);
    }

    filterDate(
        body: any,
        listIdSelected: string[],
        value: {
            fromDate: string | null;
            toDate: string | null;
        },
    ) {
        body.fromDate = value.fromDate;
        body.toDate = value.toDate;
        if (body.fromDate === null || body.toDate === null) {
            body.dateFilter = null;
        } else {
            // lọc theo ngày tạo
            body.dateFilter = 1;
        }
        this.searchAndFormatData(body, listIdSelected);
        return body;
    }

    navigateToDetail(id: any) {
        localStorage.setItem('purchaseOrderId', id);
        this.router.navigate(['/orders/detailOrder/viewEdit']);
    }
}
