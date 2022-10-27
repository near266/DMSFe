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
import { ProductDialogService } from './services/product-dialog.service';
import { RolesService } from 'src/app/core/services/roles.service';
import { FilterService } from './services/filter.service';

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

    constructor(
        private dialogService: ProductDialogService,
        public datepipe: DatePipe,
        private sidenavService: SidenavService,
        private router: Router,
        private filterService: FilterService,
        private rolesService: RolesService,
        private productService: ProductService,
    ) {}

    ngOnInit(): void {
        this.productService.totalProducts$.subscribe((total) => (this.totalProducts = total));
    }
    ngAfterViewInit(): void {
        this.sidenavService.setSideNav(this.sidenav);
        this.router.events.subscribe((e) => {});
    }
    ngDoCheck(): void {}
    select(event: any) {
        this.filterService.currentFiler$.next(event.key);
        this.filterService.isAscending$.next(event.isAsc);
        this.productService.getInititalProducts(1);
    }
    addUser() {
        this.dialogService.openProductDialog();
    }
    requiredRoles(role: string) {
        return this.rolesService.requiredRoles(role);
    }
}
