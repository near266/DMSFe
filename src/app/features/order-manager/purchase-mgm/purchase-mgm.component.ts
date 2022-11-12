import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { PurchaseHeader } from '../models/headers';
import { PurchaseOrder, RootPurchases } from '../models/purchases';
import { FormatPurchaseService } from '../services/formatPurchase.service';
import { PurchaseLogicService } from '../services/purchaseLogic.service';

@Component({
    selector: 'app-purchase-mgm',
    templateUrl: './purchase-mgm.component.html',
    styleUrls: ['./purchase-mgm.component.scss'],
})
export class PurchaseMgmComponent implements OnInit, AfterViewInit {
    purchaseOrder: string[] = PurchaseHeader;

    defaultBody: any = {
        sortField: 'CreatedDate',
        isAscending: false,
        page: 1,
        pageSize: 30,
        archived: false, // mặc định lấy những đơn k lưu trữ
    };
    body: any = {
        sortField: 'CreatedDate',
        isAscending: false,
        page: 1,
        pageSize: 30,
        archived: false,
    };

    listData$: Observable<any> = this.purchaseLogicService.listData$;
    isLoading$: Observable<boolean> = this.purchaseLogicService.isLoading$;
    total$: Observable<number> = this.purchaseLogicService.total$;

    constructor(
        private purchaseLogicService: PurchaseLogicService,
        private fomat: FormatPurchaseService,
        private router: Router,
    ) {}

    ngOnInit(): void {}
    ngAfterViewInit(): void {
        this.search();
    }

    search() {
        this.purchaseLogicService.searchAndFormatData(this.defaultBody);
    }

    handleEmitDateFilter(e: any) {
        console.log(e);
    }

    handleEmitValue(e: any) {
        localStorage.setItem('purchaseOrderId', e);
        this.router.navigate(['/orders/detailOrder/viewEdit']);
    }
}
