import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PurchaseOrder } from 'src/app/core/model/PurchaseOrder';
import { SaleReceipt } from 'src/app/core/model/SaleReceipt';
import { SaleReceiptService } from 'src/app/core/services/saleReceipt.service';
import { DataService } from './services/data.service';
import printJS from 'print-js';
import { DomSanitizer } from '@angular/platform-browser';
import { FormBuilder, FormGroup } from '@angular/forms';
import moment from 'moment';
import { jsPDF } from 'jspdf';
import { AnyAaaaRecord } from 'dns';
import { ConfirmDialogService } from 'src/app/core/services/confirmDialog.service';
import { ifStmt } from '@angular/compiler/src/output/output_ast';
import { SnackbarService } from 'src/app/core/services/snackbar.service';

@Component({
    selector: 'app-order-sale-mgm',
    templateUrl: './order-sale-mgm.component.html',
    styleUrls: ['./order-sale-mgm.component.scss'],
})
export class OrderSaleMgmComponent implements OnInit {
    isLoading = true;
    isShowSidebarToMargin = true;
    sideBarWidth!: string;
    type!: string;
    listReceiptOrder: any = [];
    totalCount: number;
    page: number = 1;
    pageSize: number = 30;
    total: number = 0;
    id: any = [];
    roleMain = 'member';
    formFilterReceive: any;
    printThis: any;
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
        archived: false, // mặc định lấy những đơn k lưu trữ
    };

    createdDateDown = false;
    createdDateUp = false;

    constructor(
        public datepipe: DatePipe,
        private saleReceiptService: SaleReceiptService,
        private router: Router,
        private dataService: DataService,
        private fb: FormBuilder,
        private confirmService: ConfirmDialogService,
        private snackbar: SnackbarService,
    ) {}

    ngOnInit(): void {
        this.roleMain = localStorage.getItem('roleMain')!;
        this.saleReceiptService.page.subscribe((data) => {
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
        // this.saleReceiptService.search().subscribe((data) => {
        //     this.listReceiptOreder = data.data;
        // });
        this.search(this.body);
    }

    search(body: any) {
        this.isLoading = true;
        this.saleReceiptService.searchReceipt(body).subscribe((data) => {
            this.isLoading = false;
            this.listReceiptOrder = data.data;
            this.total = data.totalCount;
            this.saleReceiptService.setTotal(this.total);
            this.loopToGetOrderChoosed();
        });
    }

    loopToGetOrderChoosed() {
        console.log(this.listReceiptOrder);
        console.log(this.id);
        this.listReceiptOrder.forEach((order: any) => {
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

    detail(id: string) {
        localStorage.setItem('receiptOrderId', id);
        this.router.navigate(['/ordersale/detail/viewEdit']);
    }

    chooseID(event: any, id: AnyAaaaRecord, order: any) {
        console.log(event.checked);
        if (event.checked == true) {
            this.id.push(id);
            order.checked = true;
        } else {
            this.id.splice(this.id.indexOf(id), 1);
        }
        console.log(this.id);
    }

    receiveFilter(event: any) {
        console.log(event);
        this.formFilterReceive = event;
    }

    // theo select
    export() {
        let body: any;
        body = {
            filter: null,
            listId: this.id,
            type: 1,
        };
        this.confirmService
            .open(`Bạn có muốn xuất ${this.id.length} bản ghi đã chọn hay không?`, ['Xuất', 'Hủy'])
            .subscribe((data) => {
                if (data === 'Xuất') {
                    this.saleReceiptService.export(body).subscribe(
                        (data) => {
                            const blob = new Blob([data], {
                                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                            });
                            const url = window.URL.createObjectURL(blob);
                            window.open(url);
                        },
                        (err) => {
                            this.snackbar.failureSnackBar();
                        },
                    );
                } else {
                }
            });
    }
    // exportWithFilter() {
    //     console.log(this.formFilterReceive);
    //     let formFilter;
    //     if (this.formFilterReceive == undefined) {
    //         formFilter = {
    //             keyword: null,
    //             deliveryDate: null,
    //             orderEmployeeId: null,
    //             customerTypeId: null,
    //             customerGroupId: null,
    //             areaId: null,
    //             productKey: null,
    //             status: null,
    //             printStatus: true,
    //             paymentMethod: 0,
    //             // page: 1,
    //             // pageSize: 100000,
    //             sortField: null,
    //             isAscending: true,
    //             fromDate: moment(this.dateSearchForm.get('fromDate')?.value).format('YYYY-MM-DD'),
    //             toDate: moment(this.dateSearchForm.get('toDate')?.value).format('YYYY-MM-DD'),
    //             dateFilter: null,
    //         };
    //     } else {
    //         formFilter = null;
    //     }
    //     let body = {
    //         filter: formFilter,
    //         listId: null,
    //         type: 1,
    //     };
    //     console.log('ExportWithFilter', body);
    //     this.saleReceiptService.export(body).subscribe({
    //         next: (data) => {
    //             const blob = new Blob([data], {
    //                 type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    //             });
    //             const url = window.URL.createObjectURL(blob);
    //             window.open(url);
    //         },
    //     });
    // }

    // theo filter
    exportWithFilter() {
        let bodySent: any;
        bodySent = {
            filter: this.body,
            type: 2,
        };
        bodySent.filter.pageSize = this.total;
        bodySent.filter.page = 1;
        this.confirmService
            .open(`Bạn có muốn xuất ${this.total} bản ghi đã chọn không?`, ['Xuất', 'Hủy'])
            .subscribe((data) => {
                if (data === 'Xuất') {
                    this.saleReceiptService.export(bodySent).subscribe(
                        (data) => {
                            var blob = new Blob([data], {
                                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                            });
                            const blobUrl = window.URL.createObjectURL(blob);
                            window.open(blobUrl);
                        },
                        (err) => {
                            this.snackbar.failureSnackBar();
                        },
                    );
                } else {
                }
            });
    }

    // theo select
    print() {
        let body: any;
        body = {
            filter: null,
            listId: this.id,
            type: 1,
        };
        this.confirmService
            .open(`Bạn có muốn in ${this.id.length} bản ghi đã chọn không?`, ['In', 'Hủy'])
            .subscribe((data) => {
                if (data === 'In') {
                    this.saleReceiptService.print(body).subscribe(
                        (data) => {
                            var blob = new Blob([data], {
                                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                            });
                            const blobUrl = window.URL.createObjectURL(blob);
                            window.open(blobUrl);
                        },
                        (err) => {
                            this.snackbar.failureSnackBar();
                        },
                    );
                }
            });
    }

    // theo filter
    printFilter() {
        let bodySent: any;
        bodySent = {
            filter: this.body,
            type: 2,
        };
        bodySent.filter.pageSize = this.total;
        bodySent.filter.page = 1;
        this.confirmService
            .open(`Bạn có muốn in ${this.total} bản ghi đã chọn không?`, ['In', 'Hủy'])
            .subscribe((data) => {
                if (data === 'In') {
                    this.saleReceiptService.print(bodySent).subscribe(
                        (data) => {
                            var blob = new Blob([data], {
                                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                            });
                            const blobUrl = window.URL.createObjectURL(blob);
                            window.open(blobUrl);
                        },
                        (err) => {
                            this.snackbar.failureSnackBar();
                        },
                    );
                } else {
                }
            });
    }
    filter(body: any) {
        // set lại trang
        this.page = 1;
        this.body = body;
        this.search(this.body);
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

    filterDateWithTime(type: number) {
        this.body.dateFilter = type;
        this.search(this.body);
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
            this.listReceiptOrder.forEach((order: any) => {
                // push vào id array khi chưa được chọn trước đó
                if (!order.checked) {
                    this.id.push(order.id);
                }
                order.checked = true;
            });
        } else {
            this.listReceiptOrder.forEach((order: any) => {
                order.checked = false;
                this.id.splice(this.id.indexOf(order.id), 1);
            });
        }
    }

    sortByCreatedDate(type: any) {
        if (type === 'up') {
            this.createdDateUp = true;
            this.createdDateDown = false;
            this.body.isAscending = true;
        } else if (type === 'down') {
            this.createdDateDown = true;
            this.createdDateUp = false;
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
                        this.saleReceiptService
                            .archive({
                                saleRecieptIds: this.id,
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
