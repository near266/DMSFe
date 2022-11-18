import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import moment from 'moment';
import { BehaviorSubject, forkJoin, of } from 'rxjs';
import { ConfirmDialogService } from 'src/app/core/services/confirmDialog.service';
import { SaleReceiptService } from 'src/app/core/services/saleReceipt.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { NumberToTextService } from 'src/app/core/shared/services/number-to-text.service';
import { RootSaleReceipt, SaleOrder } from '../models/sale';
import { SaleUpdateBody } from '../models/SaleAPI';
import { SaleDetail } from '../models/saleDetail';
import { Payment } from '../template-component/template-footer-order/template-footer-order.component';
import { CommonLogicService } from './commonLogic.service';
import { FormatSaleService } from './formatSale.service';
import { PurchaseLogicService } from './purchaseLogic.service';

@Injectable({
    providedIn: 'root',
})
export class SaleLogicService {
    private totalSource = new BehaviorSubject<number>(0);
    private isLoadingSource = new BehaviorSubject<boolean>(true);
    private listDataSource = new BehaviorSubject<any>('');
    private idNavigateSource = new BehaviorSubject<string>('');
    private isSuccessArchivedSoure = new BehaviorSubject<boolean>(false);
    private detailOrderSoure = new BehaviorSubject<SaleDetail>(new SaleDetail());
    private paymentSource = new BehaviorSubject<Payment>(new Payment());

    total$ = this.totalSource.asObservable();
    isLoading$ = this.isLoadingSource.asObservable();
    listData$ = this.listDataSource.asObservable();
    id$ = this.idNavigateSource.asObservable();
    isSucessArchived$ = this.isSuccessArchivedSoure.asObservable();
    detailOrder$ = this.detailOrderSoure.asObservable();
    payment$ = this.paymentSource.asObservable();

    constructor(
        private saleReceiptService: SaleReceiptService,
        private format: FormatSaleService,
        private router: Router,
        private confirmService: ConfirmDialogService,
        private snackbar: SnackbarService,
        private numberToText: NumberToTextService,
        private commonLogicService: CommonLogicService,
        private puchaseLogicService: PurchaseLogicService,
    ) {}

    clearDataInDetailOrderSource() {
        this.detailOrderSoure.next(new SaleDetail());
    }

    setPaymentSource(payment: Payment) {
        payment.textMoney = this.numberToText.doc(payment.totalPayment);
        this.paymentSource.next(payment);
    }

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
        localStorage.setItem('receiptOrderId', id);
        this.router.navigate(['/order/sale/detail/viewEdit']);
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

    archiveOrders(listIdSelected: string[], routerLink: string | null) {
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
                            if (routerLink) {
                                this.router.navigate([routerLink]);
                            }
                        },
                    );
                }
            });
    }

    getDetail(id: string) {
        this.saleReceiptService.searchReceiptById(id).subscribe((data: SaleDetail) => {
            this.detailOrderSoure.next(data);
            let payment: Payment = {
                textMoney: this.numberToText.doc(data.totalPayment),
                prePayment: data.prePayment,
                totalAmount: data.totalAmount,
                totalDiscountProduct: data.totalDiscountProduct,
                tradeDiscount: data.tradeDiscount,
                totalPayment: data.totalPayment,
                paymentTerm: data.paymentTerm,
                debtRecord: data.debtRecord,
            };
            this.setPaymentSource(payment);
        });
    }

    updateOrder(payment: Payment, form: FormGroup, id: string) {
        let body: SaleUpdateBody = {
            id: id,
            orderDate: moment(form.get('orderDate')?.value).format('YYYY-MM-DD'),
            groupId: form.get('groupId')?.value,
            saleCode: form.get('code')?.value,
            saleEmployeeId: form.get('saleEmployee')?.value,
            orderEmployeeId: form.get('orderEmployeeId')?.value,
            // warehouseId: this.detailOrder.warehouse?.id,
            customerId: form.get('customerId')?.value,
            routeId: form.get('routeId')?.value,
            type: 0,
            status: form.get('status')?.value,
            paymentMethod: 0,
            description: form.get('description')?.value,
            phone: form.get('phone')?.value,
            address: form.get('address')?.value,
            customerName: form.get('customerName')?.value,
            purchaseOrderId: form.get('relatedId')?.value,
            deliveryDate: moment(form.get('deliveryDate')?.value).format('YYYY-MM-DD'),
            saleDate: moment(form.get('saleDate')?.value).format('YYYY-MM-DD'),
            paymentTerm: payment.paymentTerm!,
            totalAmount: payment.totalAmount,
            totalOfVAT: 0,
            totalDiscountProduct: payment.totalDiscountProduct,
            tradeDiscount: payment.tradeDiscount,
            totalPayment: payment.totalPayment,
            prePayment: payment.prePayment,
            debtRecord: payment.debtRecord!,
            lastModifiedDate: moment(Date.now()).format('YYYY-MM-DD'),
            archived: false,
        };
        this.saleReceiptService.update(body).subscribe(
            (data) => {},
            (err) => {
                this.snackbar.failureSnackBar();
            },
            () => {
                this.snackbar.successSnackBar();
            },
        );
    }

    updateList(
        listUpdate: any,
        listAdd: { data: any; isAdd: boolean },
        listRemove: { data: any; isRemove: boolean },
        id: string,
    ) {
        let addAPI = of(1);
        let updateAPI = of(1);
        let removeAPI = of(1);
        if (listAdd.isAdd) {
            const bodyAddProduct = {
                saleRecieptProducts: listAdd.data,
            };
            addAPI = this.saleReceiptService.addProduct(bodyAddProduct);
        }
        if (listRemove.isRemove) {
            const bodyRemove = {
                listIdRemove: this.commonLogicService.formatListRemoveToSentAPI(listRemove.data),
                purchaseOrderId: id,
            };
            console.log(bodyRemove);
            removeAPI = this.saleReceiptService.removeProduct(bodyRemove);
        }
        if (listUpdate.length > 0) {
            let bodyUpdate = {
                saleRecieptProducts: listUpdate,
            };
            updateAPI = this.saleReceiptService.updateProductList(bodyUpdate);
        }
        forkJoin([addAPI, updateAPI, removeAPI]).subscribe(
            (data) => {},
            (err) => {
                this.snackbar.failureSnackBar();
            },
            () => {
                this.commonLogicService.successUpdate();
                this.snackbar.successSnackBar();
            },
        );
    }

    // update status
    updateStatusOrder(changeTo: number) {
        const body = {
            id: this.detailOrderSoure.getValue().id,
            orderDate: this.detailOrderSoure.getValue().orderDate,
            groupId: this.detailOrderSoure.getValue().group?.id,
            saleCode: this.detailOrderSoure.getValue().saleCode,
            saleEmployeeId: this.detailOrderSoure.getValue().saleEmployee?.id,
            orderEmployeeId: this.detailOrderSoure.getValue().orderEmployee?.id,
            warehouseId: this.detailOrderSoure.getValue().warehouse?.id,
            customerId: this.detailOrderSoure.getValue().customer?.id,
            routeId: this.detailOrderSoure.getValue().route?.id,
            type: this.detailOrderSoure.getValue().type,
            status: changeTo,
            paymentMethod: 0,
            description: this.detailOrderSoure.getValue().description,
            phone: this.detailOrderSoure.getValue().phone,
            address: this.detailOrderSoure.getValue().address,
            customerName: this.detailOrderSoure.getValue().customerName,
            purchaseOrderId: this.detailOrderSoure.getValue().purchaseOrder?.id,
            deliveryDate: this.detailOrderSoure.getValue().deliveryDate,
            saleDate: this.detailOrderSoure.getValue().saleDate,
            paymentTerm: this.detailOrderSoure.getValue().paymentTerm,
            totalAmount: this.detailOrderSoure.getValue().totalAmount,
            totalOfVAT: this.detailOrderSoure.getValue().totalOfVAT,
            totalDiscountProduct: this.detailOrderSoure.getValue().totalDiscountProduct,
            tradeDiscount: this.detailOrderSoure.getValue().tradeDiscount,
            totalPayment: this.detailOrderSoure.getValue().totalPayment,
            prePayment: this.detailOrderSoure.getValue().prePayment,
            debtRecord: this.detailOrderSoure.getValue().debtRecord,
        };
        // ấn vào nút trả hàng -> navigate
        if (changeTo === 0) {
            this.router.navigate(['returns/return_from_order']);
        }
        // Ấn vào nút xuất hàng
        else if (changeTo === 4) {
            this.saleReceiptService.update(body).subscribe(
                (data) => {},
                (err) => {
                    this.snackbar.openSnackbar('Có lỗi xảy ra', 2000, 'Đóng', 'center', 'bottom', false);
                },
                () => {
                    if (this.detailOrderSoure.getValue().purchaseOrder?.id) {
                        this.puchaseLogicService.updateToStatus4(this.detailOrderSoure.getValue().purchaseOrder?.id);
                    }
                    this.commonLogicService.successUpdate();
                },
            );
        }
    }
}
