import { Component, DoCheck, OnInit, OnDestroy, Inject, AfterViewInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { PurchaseOrderList } from 'src/app/core/data/PurchaseOrderList';
import { PurchaseOrder } from 'src/app/core/model/PurchaseOrder';
// import * as moment from 'moment';
import { DatePipe } from '@angular/common';
import { DataService } from 'src/app/core/services/data.service';
import { PurchaseOrderService } from 'src/app/core/services/purchaseOrder.service';

@Component({
    selector: 'app-orders-mgm',
    templateUrl: './orders-mgm.component.html',
    styleUrls: ['./orders-mgm.component.scss'],
})
export class OrdersMgmComponent implements OnInit, DoCheck, OnDestroy, AfterViewInit {
    isShowSidebarToMargin = true;
    sideBarWidth!: string;
    type!: string;
    listOrder: PurchaseOrder[] = [];
    totalCount: number;

    page: number = 1;
    pageSize: number = 30;
    total: number = 0;
    constructor(
        private activatedroute: ActivatedRoute,
        public datepipe: DatePipe,
        public router: Router,
        private dataService: DataService,
        private purchaseOrderService: PurchaseOrderService,
    ) {}

    ngOnInit(): void {
        this.purchaseOrderService.page.subscribe((data) => {
            this.page = data;
        });
    }

    ngAfterViewInit(): void {
        // this.purchaseOrderService.searchFilterPurchaseOrder().subscribe((data) => {
        //     this.listOrder = data;
        //     this.total = this.listOrder.length;
        //     this.purchaseOrderService.setTotal(this.total);
        // });
        this.purchaseOrderService.searchFilterPurchaseOrder().subscribe((data) => {
            console.log(data);
            this.listOrder = data.data;
            this.total = data.total;
            this.purchaseOrderService.setTotal(this.total);
        });
    }

    ngDoCheck(): void {
        let table = document.getElementById('table');
        table?.classList.add('width-vw-260');
        if (this.isShowSidebarToMargin) {
            table?.classList.remove('width-vw-60');
            table?.classList.add('width-vw-260');
        } else {
            table?.classList.add('width-vw-60');
            table?.classList.remove('width-vw-260');
        }
    }

    ngOnDestroy(): void {}

    isShowSidebar(e: any) {
        this.isShowSidebarToMargin = e;
        let table = document.getElementById('table');
        if (this.isShowSidebarToMargin) {
            table?.classList.remove('width-vw-60');
            table?.classList.add('width-vw-260');
        } else {
            table?.classList.add('width-vw-60');
            table?.classList.remove('width-vw-260');
        }
    }

    navigateToDetail(order: any) {
        localStorage.setItem('status', order.status);
        // this.purchaseOrderService.passId(order.purchaseOrderId)
        this.router.navigate(['/orders/detailOrder/viewEdit', order.purchaseOrderId]);
    }
}
