import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs';
import { headerSaleReceiptTable } from '../../../models/header';
import { LogicService } from '../../../services/logic.service';

@Component({
    selector: 'app-sale-receipt-report-table',
    templateUrl: './sale-receipt-report-table.component.html',
    styleUrls: ['./sale-receipt-report-table.component.scss'],
})
export class SaleReceiptReportTableComponent implements OnInit, AfterViewInit {
    tableHeader: string[] = headerSaleReceiptTable;
    listData$: Observable<any> = this.logicService.reportOrders$;
    total$: Observable<any> = this.logicService.total$;
    constructor(private logicService: LogicService) {}
    body = {
        page: 1,
        pageSize: 30,
    };
    ngOnInit(): void {}

    ngAfterViewInit(): void {
        this.getData();
    }

    getData() {
        this.logicService.getAllReportOrders(this.body, 'saleReceipt');
    }

    handleEmitId(e: any) {
        this.navigateToDetail(e);
    }

    handlePageChange(e: any) {
        this.body.page = e;
        this.getData();
    }

    navigateToDetail(id: any) {
        console.log(id);
        localStorage.setItem('receiptOrderId', id);
        window.open('/ordersale/detail/viewEdit');
    }
}
