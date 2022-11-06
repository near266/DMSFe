import { Component, DoCheck, OnInit, OnDestroy, Inject, AfterViewInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { PurchaseOrder } from 'src/app/core/model/PurchaseOrder';
// import * as moment from 'moment';
import { DatePipe } from '@angular/common';
import { DataService } from './services/data.service';
import { PurchaseOrderService } from 'src/app/core/services/purchaseOrder.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import moment from 'moment';
import { ConfirmDialogService } from 'src/app/core/services/confirmDialog.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';

@Component({
    selector: 'app-orders-mgm',
    templateUrl: './orders-mgm.component.html',
    styleUrls: ['./orders-mgm.component.scss'],
})
export class OrdersMgmComponent implements OnInit, DoCheck, OnDestroy, AfterViewInit {
    type!: string;
    listOrder: any = [];
    id: any = [];

    isLoading = true;
    isShowSidebarToMargin = true;
    OrderDateUp: boolean = false;
    OrderDateDown: boolean = false;
    sideBarWidth!: string;
    totalCount: number;
    page: number = 1;
    pageSize: number = 30;
    total: number = 0;

    dateSearchForm: FormGroup;

    defaultBody: any = {
        sortField: 'CreatedDate',
        isAscending: false,
        page: 1,
        pageSize: 30,
        archived: false, // mặc định lấy những đơn k lưu trữ
    };
    body: any = {
        sortField: 'CreatedDate',
        isAscending: false,
        page: 1,
        pageSize: 30,
        archived: false,
    };
    constructor(
        public datepipe: DatePipe,
        public router: Router,
        private purchaseOrderService: PurchaseOrderService,
        private dataService: DataService,
        private fb: FormBuilder,
        private purchaseSer: PurchaseOrderService,
        private confirmService: ConfirmDialogService,
        private snackbar: SnackbarService,
    ) {}

    ngOnInit(): void {
        this.purchaseOrderService.page.subscribe((data) => {
            this.page = data;
            this.page = data;
            this.body.page = this.page;
            this.search(this.body);
        });
        this.dataService.searchText.subscribe((data) => {
            // lấy text
            this.body.keyword = data.trim();
            // set lại page
            this.page = 1;
            this.body.page = 1;
            this.search(this.body);
        });
        // create dateSearchForm
        this.dateSearchForm = this.fb.group({
            fromDate: [null],
            toDate: [null],
        });
    }

    ngAfterViewInit(): void {
        this.search(this.body);
    }

    search(body: any) {
        this.isLoading = true;
        this.purchaseOrderService.search(body).subscribe((data) => {
            this.listOrder = data.data;
            this.total = data.totalCount;
            this.purchaseOrderService.setTotal(this.total);
            this.isLoading = false;
            this.loopToGetOrderChoosed();
        });
    }

    loopToGetOrderChoosed() {
        this.listOrder.forEach((order: any) => {
            if (this.id.includes(order.id)) {
                order.checked = true;
            }
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

    filterDate() {
        if (this.dateSearchForm.get('fromDate')?.value) {
            this.body.fromDate = moment(this.dateSearchForm.get('fromDate')?.value).format('YYYY-MM-DD');
        }
        if (this.dateSearchForm.get('toDate')?.value) {
            this.body.toDate = moment(this.dateSearchForm.get('toDate')?.value).format('YYYY-MM-DD');
        }
        if (this.body.fromDate === null || this.body.toDate === null) {
            this.body.dateFilter = null;
        } else {
            this.body.dateFilter = 1;
        }
        // set lại page
        this.page = 1;
        this.body.page = 1;
        this.search(this.body);
    }

    chooseID(event: any, id: any, order: any) {
        if (event.checked == true) {
            this.id.push(id);
            order.checked = true;
        } else {
            this.id.splice(this.id.indexOf(id), 1);
        }
        console.log(this.id);
    }

    filter(body: any) {
        // set lại page
        this.page = 1;
        this.body = body;
        this.search(this.body);
    }

    print() {
        let body;
        body = {
            filter: null,
            listId: this.id,
            type: 2,
        };
        console.log('Print');
        this.purchaseSer.print(body).subscribe({
            next: (data) => {
                var blob = new Blob([data], {
                    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                });
                const blobUrl = window.URL.createObjectURL(blob);
                window.open(blobUrl);
            },
        });
    }

    clearDatePicker() {
        this.dateSearchForm.setValue({
            fromDate: null,
            toDate: null,
        });
        this.body.fromDate = null;
        this.body.toDate = null;
    }

    chooseAll(e: any) {
        if (e.checked) {
            this.listOrder.forEach((order: any) => {
                // push vào id array khi chưa được chọn trước đó
                if (!order.checked) {
                    this.id.push(order.id);
                }
                order.checked = true;
            });
        } else {
            this.listOrder.forEach((order: any) => {
                order.checked = false;
                this.id.splice(this.id.indexOf(order.id), 1);
            });
        }
    }

    filterDateWithTime(type: number) {
        this.body.dateFilter = type;
        this.search(this.body);
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
        this.search(this.body);
    }

    archiveOrders() {
        // console.log(this.id);
        if (this.id.length > 0) {
            this.confirmService
                .open(`Bạn có muốn xóa ${this.id.length} bản ghi hay không ?`, ['Xóa', 'Hủy'])
                .subscribe((data) => {
                    if (data === 'Xóa') {
                        this.purchaseOrderService
                            .archive({
                                purchaseOrderIds: this.id,
                                lastModifiedBy: null,
                            })
                            .subscribe(
                                (data) => {},
                                (err) => {
                                    this.snackbar.openSnackbar(
                                        'Có lỗi xảy ra',
                                        2000,
                                        'Đóng',
                                        'center',
                                        'bottom',
                                        false,
                                    );
                                },
                                () => {
                                    this.snackbar.openSnackbar(
                                        'Xóa thành công',
                                        2000,
                                        'Đóng',
                                        'center',
                                        'bottom',
                                        true,
                                    );
                                    this.id = [];
                                    this.search(this.defaultBody);
                                },
                            );
                    }
                });
        }
    }
}
