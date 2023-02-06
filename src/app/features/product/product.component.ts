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
import { Subscription } from 'rxjs';
import { ConfirmDialogService } from 'src/app/core/services/confirmDialog.service';
import { ProductApiService } from './apis/product.api.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { TypeExport } from '../user-manage/common/common.service';

@Component({
    selector: 'app-product',
    templateUrl: './product.component.html',
    styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit, DoCheck, AfterViewInit, OnDestroy {
    @ViewChild('drawer') sidenav: MatSidenav;
    isShowSidebarToMargin = true;
    listMenu = sortList;
    sideBarWidth!: string;
    totalProducts: number;
    idList: string[] = [];
    subscriptions: Subscription = new Subscription();
    isLoading: boolean = false;
    exportMenu = {
        title: 'Xuất dữ liệu',
        leftTitleIcon: 'fa-file-export',
        listMenuPosition: [
            { title: 'Được chọn', leftIcon: 'fa-circle-check', value: 'Được chọn' },
            { title: 'Điều kiện tìm', leftIcon: 'fa-filter', value: 'Điều kiện tìm' },
        ],
    };

    constructor(
        private dialogService: ProductDialogService,
        public datepipe: DatePipe,
        private sidenavService: SidenavService,
        private router: Router,
        private filterService: FilterService,
        private rolesService: RolesService,
        private productService: ProductService,
        private confirmService: ConfirmDialogService,
        private productAPIService: ProductApiService,
        private snackbar: SnackbarService,
    ) {}

    ngOnInit(): void {
        this.productService.totalProducts$.subscribe((total) => (this.totalProducts = total));
        this.subscriptions.add(
            this.productService.archivedProducts$.subscribe((data: any) => {
                this.idList = data;
            }),
        );
    }
    ngAfterViewInit(): void {
        this.sidenavService.setSideNav(this.sidenav);
        this.router.events.subscribe((e) => {});
    }
    ngDoCheck(): void {}
    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }
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
    archive() {
        if (this.idList.length > 0) {
            this.confirmService
                .open(`Bạn có muốn xóa ${this.idList.length} sản phẩm không ?`, ['Xóa', 'Hủy'])
                .subscribe((data) => {
                    if (data === 'Xóa') {
                        this.productAPIService.archiveListProduct(this.idList).subscribe(
                            (data: any) => {},
                            (err: any) => {
                                this.snackbar.failureSnackBar();
                            },
                            () => {
                                this.productService.setSucessUpdate(true);
                                this.idList = [];
                                this.snackbar.openSnackbar('Xóa thành công', 2000, 'Đóng', 'center', 'bottom', true);
                            },
                        );
                    }
                });
        }
    }

    Export(type: number, data$: any, message: string) {
        this.confirmService.open(message, ['Có', 'Không']).subscribe((data) => {
            if (data === 'Có') {
                this.isLoading = true;
                this.productAPIService.export(type, data$).subscribe(
                    (data) => {
                        const blob = new Blob([data], {
                            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                        });
                        const url = window.URL.createObjectURL(blob);
                        window.open(url);
                        this.isLoading = false;
                    },
                    (err) => {
                        this.snackbar.failureSnackBar();
                    },
                );
            }
        });
    }

    handleEmitMessage(e: any) {
        switch (e) {
            case 'Được chọn': {
                if (this.idList.length) {
                    this.Export(
                        TypeExport.Selected,
                        this.idList,
                        `Bạn có muốn xuất ${this.idList.length} sản phẩm không?`,
                    );
                }
                break;
            }
            case 'Điều kiện tìm': {
                const type =
                    this.filterService.currentFiler$.getValue() === ''
                        ? 'CreatedDate'
                        : this.filterService.currentFiler$.getValue();
                const ascending = this.filterService.isAscending$.getValue();
                const keyword = this.filterService.keyword$.getValue();
                const page = this.filterService.page$.getValue();
                const settings = {
                    keyword,
                    sortBy: {
                        property: type,
                        value: ascending,
                    },
                    page,
                    pageSize: 30,
                };
                if (this.totalProducts) {
                    this.Export(TypeExport.Filter, settings, `Bạn có muốn xuất ${this.totalProducts} sản phẩm không?`);
                }
                break;
            }
        }
    }
}
