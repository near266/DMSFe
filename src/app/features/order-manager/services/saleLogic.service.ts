import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { ConfirmDialogService } from 'src/app/core/services/confirmDialog.service';
import { SaleReceiptService } from 'src/app/core/services/saleReceipt.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { RootSaleReceipt, SaleOrder } from '../models/sale';
import { FormatSaleService } from './formatSale.service';

@Injectable({
    providedIn: 'root',
})
export class SaleLogicService {
    private totalSource = new BehaviorSubject<number>(0);
    private isLoadingSource = new BehaviorSubject<boolean>(true);
    private listDataSource = new BehaviorSubject<any>('');
    private idNavigateSource = new BehaviorSubject<string>('');
    private isSuccessArchivedSoure = new BehaviorSubject<boolean>(false);

    total$ = this.totalSource.asObservable();
    isLoading$ = this.isLoadingSource.asObservable();
    listData$ = this.listDataSource.asObservable();
    id$ = this.idNavigateSource.asObservable();
    isSucessArchived$ = this.isSuccessArchivedSoure.asObservable();

    constructor(
        private saleReceiptService: SaleReceiptService,
        private format: FormatSaleService,
        private router: Router,
        private confirmService: ConfirmDialogService,
        private snackbar: SnackbarService,
    ) {}

    searchAndFormatData(body: any, listIdSelected: string[]) {
        this.isLoadingSource.next(true);
        this.saleReceiptService.searchReceipt(body).subscribe((data: RootSaleReceipt) => {
            this.isLoadingSource.next(false);
            this.totalSource.next(data.totalCount);
            let dataAfterFormat = this.formatData(data.data);
            // lặp qua để lấy lại các order đã được select
            let dataAfterFormatToGetChoosedOrder = this.loopToGetOrderChoosed(dataAfterFormat, listIdSelected);
            // gửi đi giá trị
            this.listDataSource.next(dataAfterFormatToGetChoosedOrder);
        });
    }

    formatData(dataList: SaleOrder[]) {
        return this.format.formatData(dataList);
    }

    loopToGetOrderChoosed(listOrder: any, listIdSelected: string[]) {
        listOrder.forEach((order: any) => {
            if (listIdSelected.includes(order.id)) {
                order.checked = true;
            }
        });
        return listOrder;
    }

    navigateToDetail(id: string) {
        // this.idNavigateSource.next(id);
        // this.router.navigate(['/optimalOrder/sale/detail']);
        localStorage.setItem('receiptOrderId', id);
        this.router.navigate(['/ordersale/detail/viewEdit']);
    }

    filterDate(
        body: any,
        listIdSelected: string[],
        value: {
            fromDate: string | null;
            toDate: string | null;
        },
    ) {
        body.page = 1;
        body.fromDate = value.fromDate;
        body.toDate = value.toDate;
        if (body.fromDate === null || body.toDate === null) {
            body.dateFilter = null;
        } else {
            // lọc theo ngày tạo
            body.dateFilter = 1;
        }
        this.searchAndFormatData(body, listIdSelected);
        return body;
    }

    export(listIdSelected: string[]) {
        let body: any;
        body = {
            filter: null,
            listId: listIdSelected,
            type: 2,
        };
        this.confirmService
            .open(`Bạn có muốn xuất ${listIdSelected.length} bản ghi đã chọn hay không?`, ['Xuất', 'Hủy'])
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

    exportWithFilter(bodyFilter: any, total: number) {
        let bodySent: any;
        bodySent = {
            filter: bodyFilter,
            type: 1,
        };
        bodySent.filter.pageSize = total;
        bodySent.filter.page = 1;
        this.confirmService
            .open(`Bạn có muốn xuất ${total} bản ghi đã chọn không?`, ['Xuất', 'Hủy'])
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

    print(listIdSelected: string[]) {
        let body: any;
        body = {
            filter: null,
            listId: listIdSelected,
            type: 2,
        };
        this.confirmService
            .open(`Bạn có muốn in ${listIdSelected.length} bản ghi đã chọn không?`, ['In', 'Hủy'])
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

    printWithFilter(bodyFilter: string[], total: number) {
        let bodySent: any;
        bodySent = {
            filter: bodyFilter,
            type: 1,
        };
        bodySent.filter.pageSize = total;
        bodySent.filter.page = 1;
        this.confirmService.open(`Bạn có muốn in ${total} bản ghi đã chọn không?`, ['In', 'Hủy']).subscribe((data) => {
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

    archiveOrders(listIdSelected: string[]) {
        let body = {
            saleRecieptIds: listIdSelected,
            lastModifiedBy: null,
        };
        this.isSuccessArchivedSoure.next(false);
        this.confirmService
            .open(`Bạn có muốn xóa ${body.saleRecieptIds.length} bản ghi hay không ?`, ['Xóa', 'Hủy'])
            .subscribe((data) => {
                if (data === 'Xóa') {
                    this.saleReceiptService.archive(body).subscribe(
                        (data) => {},
                        (err) => {
                            this.snackbar.openSnackbar('Có lỗi xảy ra', 2000, 'Đóng', 'center', 'bottom', false);
                        },
                        () => {
                            this.isSuccessArchivedSoure.next(true);
                            this.snackbar.openSnackbar('Xóa thành công', 2000, 'Đóng', 'center', 'bottom', true);
                        },
                    );
                }
            });
    }
}
