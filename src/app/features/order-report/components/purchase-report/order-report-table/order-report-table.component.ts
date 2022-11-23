import { AfterViewInit, Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { headerOrderReportTable } from '../../../models/header';
import { LogicService } from '../../../services/logic.service';

@Component({
    selector: 'app-order-report-table',
    templateUrl: './order-report-table.component.html',
    styleUrls: ['./order-report-table.component.scss'],
})
export class OrderReportTableComponent implements OnInit, AfterViewInit, OnChanges {
    @Input() body = JSON.stringify({
        page: 1,
        pageSize: 30,
    });

    tableHeader: string[] = headerOrderReportTable;
    listData$: Observable<any> = this.logicService.reportOrders$;
    total$: Observable<any> = this.logicService.total$;

    constructor(private router: Router, private logicService: LogicService) {}

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
        });
    }

    getData() {
        this.logicService.getAllReportOrders(JSON.parse(this.body), 'ordersReport');
    }

    handlePageChange(e: any) {
        JSON.parse(this.body).page = e;
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
