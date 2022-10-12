import { Component, DoCheck, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PurchaseOrderList } from 'src/app/core/data/PurchaseOrderList';
import { MatSidenav } from '@angular/material/sidenav';
import { PurchaseOrder } from 'src/app/core/model/PurchaseOrder';
// import * as moment from 'moment';
import { DatePipe } from '@angular/common';
import { SidenavService } from './services/sidenav.service';
import { ProductService } from './services/product.service';
import { sortList } from './utils/sort';

@Component({
    selector: 'app-product',
    templateUrl: './product.component.html',
    styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit, DoCheck, AfterViewInit {
    @ViewChild('drawer') sidenav: MatSidenav;
    isShowSidebarToMargin = true;

    listMenu = sortList;
    sideBarWidth!: string;
    totalProducts: number;
    type!: string;
    // listOrder: PurchaseOrder[] = PurchaseOrderList;

    constructor(
        private activatedroute: ActivatedRoute,
        public datepipe: DatePipe,
        private sidenavService: SidenavService,
        private router: Router,
        private productService: ProductService,
    ) {}

    ngOnInit(): void {
        this.totalProducts = this.productService.totalProducts;
    }
    ngAfterViewInit(): void {
        this.sidenavService.setSideNav(this.sidenav);
        this.router.events.subscribe((e) => {
            this.sidenavService.close();
        });
    }
    ngDoCheck(): void {}
    select(event: any) {
        console.log(event);
    }
}
