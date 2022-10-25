import { Component, DoCheck, OnInit, OnDestroy, Inject, AfterViewInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { PurchaseOrder } from 'src/app/core/model/PurchaseOrder';
// import * as moment from 'moment';
import { DatePipe } from '@angular/common';
import { DataService } from './services/data.service';
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
    listOrder: any = [];
    totalCount: number;

    page: number = 1;
    pageSize: number = 30;
    total: number = 0;
    searchAllBody = {
        sortField: 'CreatedDate',
        isAscending: false,
        page: this.page,
        pageSize: this.pageSize,
    };
    constructor(
        private activatedroute: ActivatedRoute,
        public datepipe: DatePipe,
        public router: Router,
        private purchaseOrderService: PurchaseOrderService,
        private dataService: DataService,
    ) {}

    ngOnInit(): void {
        this.purchaseOrderService.page.subscribe((data) => {
            this.page = data;
            let body = {
                sortField: 'CreatedDate',
                isAscending: false,
                page: this.page,
                pageSize: this.pageSize,
            };
            this.search(body);
        });
        this.dataService.searchText.subscribe((data) => {
            const body = {
                keyword: data,
                sortField: 'CreatedDate',
                isAscending: false,
                page: this.page,
                pageSize: this.pageSize,
            };
            this.search(body);
        });
    }

    ngAfterViewInit(): void {
        this.search(this.searchAllBody);
    }

    search(body: any) {
        this.purchaseOrderService.search(body).subscribe((data) => {
            this.listOrder = data.data;
            this.total = data.totalCount;
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
        localStorage.setItem('purchaseOrderId', order.id);
        this.router.navigate(['/orders/detailOrder/viewEdit']);
    }
}
