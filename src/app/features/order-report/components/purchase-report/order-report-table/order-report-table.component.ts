import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { headerOrderReportTable } from '../../../models/header';
import { LogicService } from '../../../services/logic.service';

@Component({
    selector: 'app-order-report-table',
    templateUrl: './order-report-table.component.html',
    styleUrls: ['./order-report-table.component.scss'],
})
export class OrderReportTableComponent implements OnInit, AfterViewInit {
    tableHeader: string[] = headerOrderReportTable;
    listData$: Observable<any> = this.logicService.reportOrders$;
    total$: Observable<any> = this.logicService.total$;

    body = {
        page: 1,
        pageSize: 30,
    };

    constructor(private router: Router, private logicService: LogicService) {}

    ngOnInit(): void {}

    ngAfterViewInit(): void {
        this.getData();
    }

    getData() {
        this.logicService.getAllReportOrders(this.body, 'ordersReport');
    }

    handlePageChange(e: any) {
        this.body.page = e;
        this.getData();
    }

    handleEmitId(id: any) {
        this.navigateToDetail(id);
    }

    navigateToDetail(id: any) {
        localStorage.setItem('purchaseOrderId', id);
        window.open('/order/purchase/detail/viewEdit');
    }
}
