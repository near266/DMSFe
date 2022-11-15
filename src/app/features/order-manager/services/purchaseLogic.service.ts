import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { log } from 'console';
import { BehaviorSubject } from 'rxjs';
import { PurchaseOrderDetail } from 'src/app/core/model/PurchaseOrder';
import { ConfirmDialogService } from 'src/app/core/services/confirmDialog.service';
import { PurchaseOrderService } from 'src/app/core/services/purchaseOrder.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { PurchaseDetail } from '../models/purchaseDetail';
import { PurchaseOrder, RootPurchases } from '../models/purchases';
import { FormatPurchaseService } from './formatPurchase.service';

@Injectable({
    providedIn: 'root',
})
export class PurchaseLogicService {
    private listDataSource = new BehaviorSubject<any>([]);
    private isLoadingSource = new BehaviorSubject<boolean>(true);
    private totalSource = new BehaviorSubject<number>(0);
    private isSucessArchivedSource = new BehaviorSubject<boolean>(false);
    private detailSource = new BehaviorSubject<PurchaseDetail>(new PurchaseDetail());

    listData$ = this.listDataSource.asObservable();
    isLoading$ = this.isLoadingSource.asObservable();
    total$ = this.totalSource.asObservable();
    isSucessArchived$ = this.isSucessArchivedSource.asObservable();
    detail$ = this.detailSource.asObservable();

    constructor(
        private purchaseService: PurchaseOrderService,
        private format: FormatPurchaseService,
        private router: Router,
        private snackbar: SnackbarService,
        private confirmService: ConfirmDialogService,
    ) {}
    searchAndFormatData(body: any, listIdSelected: string[]) {
        this.isLoadingSource.next(true);
        this.purchaseService.search(body).subscribe((data: RootPurchases) => {
            this.isLoadingSource.next(false);
            this.totalSource.next(data.totalCount);
            let dataAfterFormat = this.formatData(data.data);
            // lặp qua để lấy lại các order đã được select
            let dataAfterFormatToGetChoosedOrder = this.loopToGetOrderChoosed(dataAfterFormat, listIdSelected);
            // gửi đi giá trị
            this.listDataSource.next(dataAfterFormatToGetChoosedOrder);
        });
    }

    loopToGetOrderChoosed(listOrder: any, listIdSelected: string[]) {
        listOrder.forEach((order: any) => {
            if (listIdSelected.includes(order.id)) {
                order.checked = true;
            }
        });
        return listOrder;
    }

    formatData(dataList: PurchaseOrder[]) {
        return this.format.formatPurchases(dataList);
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

    navigateToDetail(id: any) {
        localStorage.setItem('purchaseOrderId', id);
        this.router.navigate(['/order/purchase/detail']);
    }

    print(body: any) {
        this.confirmService
            .open(`Bạn có muốn in ${body.listId.length} bản ghi đã chọn không?`, ['In', 'Hủy'])
            .subscribe((data) => {
                if (data === 'In') {
                    this.purchaseService.print(body).subscribe(
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

    printFilter(body: any) {
        this.confirmService
            .open(`Bạn có muốn in ${body.filter.pageSize} bản ghi đã chọn không?`, ['In', 'Hủy'])
            .subscribe((data) => {
                if (data === 'In') {
                    this.purchaseService.print(body).subscribe(
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
            purchaseOrderIds: listIdSelected,
            lastModifiedBy: null,
        };
        this.isSucessArchivedSource.next(false);
        this.confirmService
            .open(`Bạn có muốn xóa ${body.purchaseOrderIds.length} bản ghi hay không ?`, ['Xóa', 'Hủy'])
            .subscribe((data) => {
                if (data === 'Xóa') {
                    this.purchaseService.archive(body).subscribe(
                        (data) => {},
                        (err) => {
                            this.snackbar.openSnackbar('Có lỗi xảy ra', 2000, 'Đóng', 'center', 'bottom', false);
                        },
                        () => {
                            this.isSucessArchivedSource.next(true);
                            this.snackbar.openSnackbar('Xóa thành công', 2000, 'Đóng', 'center', 'bottom', true);
                        },
                    );
                }
            });
    }

    getDetail(id: any) {
        this.purchaseService.detail(id).subscribe((data: PurchaseDetail) => {
            this.detailSource.next(data);
        });
    }
}
