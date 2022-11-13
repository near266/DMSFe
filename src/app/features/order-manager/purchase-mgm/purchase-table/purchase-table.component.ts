import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { PurchaseHeader } from '../../models/headers';
import { FormatPurchaseService } from '../../services/formatPurchase.service';
import { PurchaseLogicService } from '../../services/purchaseLogic.service';

@Component({
    selector: 'app-purchase-table',
    templateUrl: './purchase-table.component.html',
    styleUrls: ['./purchase-table.component.scss'],
})
export class PurchaseTableComponent implements OnInit {
    purchaseOrder: string[] = PurchaseHeader;
    listIdSelected: string[] = [];

    defaultBody: any = {
        sortField: 'CreatedDate',
        isAscending: false,
        page: 1,
        pageSize: 30,
        archived: false, // mặc định lấy những đơn k lưu trữ
    };
    // body có thể ghi đè để search filter
    body: any = {
        sortField: 'CreatedDate',
        isAscending: false,
        page: 1,
        pageSize: 30,
        archived: false,
    };
    page: number = 1;

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
        this.search(this.defaultBody, []);
    }

    search(body: any, listIdSelected: string[]) {
        this.purchaseLogicService.searchAndFormatData(body, listIdSelected);
    }

    handleEmitDateFilter(e: any) {
        this.body = this.purchaseLogicService.filterDate(this.body, this.listIdSelected, e);
    }

    handleEmitValue(e: any) {
        this.purchaseLogicService.navigateToDetail(e);
    }

    handleEmitListIds(e: any) {
        this.listIdSelected = e;
    }

    handleEmitPageCurrent(e: any) {
        this.page = e;
        this.body.page = e;
        this.search(this.body, this.listIdSelected);
    }
}
