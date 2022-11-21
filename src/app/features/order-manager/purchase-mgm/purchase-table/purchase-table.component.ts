import { AsyncPipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe-decorator';
import { Observable, Subscription } from 'rxjs';
import { PurchaseHeader } from '../../models/headers';
import { PurchaseLogicService } from '../../services/purchaseLogic.service';

@Component({
    selector: 'app-purchase-table',
    templateUrl: './purchase-table.component.html',
    styleUrls: ['./purchase-table.component.scss'],
})
export class PurchaseTableComponent implements OnInit, OnDestroy {
    private subscriptions: Subscription = new Subscription();

    purchaseOrder: string[] = PurchaseHeader;
    listIdSelected: string[] = [];
    OrderDateUp: boolean = false;
    OrderDateDown: boolean = false;

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
    @AutoUnsubscribe()
    listData$: Observable<any> = this.purchaseLogicService.listData$;
    @AutoUnsubscribe()
    isLoading$: Observable<boolean> = this.purchaseLogicService.isLoading$;
    @AutoUnsubscribe()
    total$: Observable<number> = this.purchaseLogicService.total$;

    constructor(private purchaseLogicService: PurchaseLogicService, private async: AsyncPipe) {}

    ngOnInit(): void {}

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.search(this.defaultBody, []);
        }, 0);
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    search(body: any, listIdSelected: string[]) {
        this.purchaseLogicService.searchAndFormatData(body, listIdSelected);
    }

    handleEmitDateFilter(e: any) {
        this.page = 1;
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

    handleEmitBody(body: any) {
        this.body = body;
        this.page = 1;
        this.search(this.body, this.listIdSelected);
    }

    refresh() {
        this.body.page = 1;
        this.page = 1;
        this.search(this.body, this.listIdSelected);
    }

    print() {
        let body: any;
        body = {
            filter: null,
            listId: this.listIdSelected,
            type: 2,
        };
        this.purchaseLogicService.print(body);
    }

    printFilter() {
        let bodySent: any;
        bodySent = {
            filter: this.body,
            type: 1,
        };
        bodySent.filter.pageSize = this.async.transform(this.total$);
        bodySent.filter.page = 1;
        this.purchaseLogicService.printFilter(bodySent);
    }

    filterDateWithTime(type: number) {
        this.body.dateFilter = type;
        this.search(this.body, this.listIdSelected);
    }

    sortByOrderDate(type: any) {
        if (type === 'up') {
            this.OrderDateUp = true;
            this.OrderDateDown = false;
            this.body.isAscending = true;
        } else if (type === 'down') {
            this.OrderDateDown = true;
            this.OrderDateUp = false;
            this.body.isAscending = false;
        }
        this.search(this.body, this.listIdSelected);
    }

    archiveOrders() {
        if (this.listIdSelected.length > 0) {
            this.purchaseLogicService.archiveOrders(this.listIdSelected, null);
            this.subscriptions.add(
                this.purchaseLogicService.isSucessArchived$.subscribe((data: boolean) => {
                    if (data) {
                        this.listIdSelected = [];
                        this.search(this.defaultBody, []);
                    } else {
                    }
                }),
            );
        }
    }
}
