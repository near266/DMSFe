import { Component, OnInit, AfterViewInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { set } from 'lodash';
import { Observable } from 'rxjs';
import { headerSaleReceiptTable } from '../../../models/header';
import { LogicService } from '../../../services/logic.service';

@Component({
    selector: 'app-sale-receipt-report-table',
    templateUrl: './sale-receipt-report-table.component.html',
    styleUrls: ['./sale-receipt-report-table.component.scss'],
})
export class SaleReceiptReportTableComponent implements OnInit, AfterViewInit, OnChanges {
    @Input() body = JSON.stringify({
        page: 1,
        pageSize: 30,
    });
    tableHeader: string[] = headerSaleReceiptTable;
    listData$: Observable<any> = this.logicService.reportOrders$;
    total$: Observable<any> = this.logicService.total$;
    constructor(private logicService: LogicService) {}
    ngOnInit(): void {
        // clear data
        this.logicService.clearSource();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if ('body' in changes) {
            this.getData();
        }
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.getData();
        }, 0);
    }

    getData() {
        this.logicService.getAllReportOrders(JSON.parse(this.body), 'saleReceipt');
    }

    handleEmitId(e: any) {
        this.navigateToDetail(e);
    }

    handlePageChange(e: any) {
        JSON.parse(this.body).page = e;
        this.getData();
    }

    navigateToDetail(id: any) {
        localStorage.setItem('receiptOrderId', id);
        window.open('/order/sale/detail/viewEdit');
    }
}
