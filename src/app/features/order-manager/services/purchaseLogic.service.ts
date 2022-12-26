import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import moment from 'moment';
import { BehaviorSubject, combineLatest, forkJoin, of } from 'rxjs';
import { ConfirmDialogService } from 'src/app/core/services/confirmDialog.service';
import { PurchaseOrderService } from 'src/app/core/services/purchaseOrder.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { NumberToTextService } from 'src/app/core/shared/services/number-to-text.service';
import { ConfirmRejectComponent } from '../../orders-mgm/components/confirm-reject/confirm-reject.component';
import { GenOrderSaleComponent } from '../../orders-mgm/components/gen-order-sale/gen-order-sale.component';
import {
    InfoCreate,
    ListProductCreate,
    ListPromotionProductCreate,
    PaymentCreate,
    PurchaseBodyCreate,
    PurchaseBodyUpdate,
} from '../models/purchaseAPI';
import { PurchaseDetail } from '../models/purchaseDetail';
import { PurchaseOrder, RootPurchases } from '../models/purchases';
import { SaleCreateBody } from '../models/SaleAPI';
import { Payment } from '../template-component/template-footer-order/template-footer-order.component';
import { CommonLogicService } from './commonLogic.service';
import { FormatPurchaseService } from './formatPurchase.service';

@Injectable({
    providedIn: 'root',
})
export class PurchaseLogicService {
    private listDataSource = new BehaviorSubject<any>([]);
    private isLoadingSource = new BehaviorSubject<boolean>(true);
    private totalSource = new BehaviorSubject<number>(0);
    private isSucessArchivedSource = new BehaviorSubject<boolean>(false);
    private isGenSource = new BehaviorSubject<boolean>(false);
    private detailSource = new BehaviorSubject<PurchaseDetail>(new PurchaseDetail());
    private paymentSource = new BehaviorSubject<Payment>(new Payment());
    private infoCreateSource = new BehaviorSubject<any>('');
    private productCreateSource = new BehaviorSubject<ListProductCreate[]>([]);
    private promtionCreateSource = new BehaviorSubject<ListPromotionProductCreate[]>([]);
    private paymentCreateSource = new BehaviorSubject<Payment>({
        textMoney: '0',
        prePayment: 0,
        totalAmount: 0,
        tradeDiscount: 0,
        totalDiscountProduct: 0,
        totalPayment: 0,
    });
    private genSaleSource = new BehaviorSubject<any>('');

    listData$ = this.listDataSource.asObservable();
    isLoading$ = this.isLoadingSource.asObservable();
    total$ = this.totalSource.asObservable();
    isSucessArchived$ = this.isSucessArchivedSource.asObservable();
    detail$ = this.detailSource.asObservable();
    payment$ = this.paymentSource.asObservable();
    paymentCreate$ = this.paymentCreateSource.asObservable();
    genSale$ = this.genSaleSource.asObservable();
    isGen$ = this.isGenSource.asObservable();

    constructor(
        private purchaseService: PurchaseOrderService,
        private format: FormatPurchaseService,
        private router: Router,
        private snackbar: SnackbarService,
        private confirmService: ConfirmDialogService,
        private commonLogicService: CommonLogicService,
        private numberToText: NumberToTextService,
        private dialog: MatDialog,
    ) {}

    setGenSaleSource(value: boolean) {
        this.isGenSource.next(value);
    }

    genSale() {
        this.isGenSource.next(true);
    }

    setInfoCreateSource(body: any) {
        this.infoCreateSource.next(body);
    }

    setProductCreateSource(body: ListProductCreate[]) {
        this.productCreateSource.next(body);
    }

    setPromotionCreateSource(body: ListPromotionProductCreate[]) {
        this.promtionCreateSource.next(body);
    }

    setPaymentCreateSource(payment: Payment) {
        payment.textMoney = this.numberToText.doc(payment.totalPayment);
        this.paymentCreateSource.next(payment);
    }

    setPaymentSource(payment: Payment) {
        payment.textMoney = this.numberToText.doc(payment.totalPayment);
        this.paymentSource.next(payment);
    }

    clearDataInDetailOrderSource() {
        this.detailSource.next(new PurchaseDetail());
    }

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
                    this.purchaseService.print006(body).subscribe(
                        (data) => {
                            var blob = new Blob([data], {
                                type: 'application/pdf',
                            });
                            const blobUrl = window.URL.createObjectURL(blob);
                            const iframe = document.createElement('iframe');
                            iframe.style.display = 'none';
                            iframe.src = blobUrl;
                            document.body.appendChild(iframe);
                            iframe.contentWindow?.print();
                            // window.open(blobUrl);
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
                    this.purchaseService.print006(body).subscribe(
                        (data) => {
                            var blob = new Blob([data], {
                                type: 'application/pdf',
                            });
                            const blobUrl = window.URL.createObjectURL(blob);
                            const iframe = document.createElement('iframe');
                            iframe.style.display = 'none';
                            iframe.src = blobUrl;
                            document.body.appendChild(iframe);
                            iframe.contentWindow?.print();
                            // window.open(blobUrl);
                        },
                        (err) => {
                            this.snackbar.failureSnackBar();
                        },
                    );
                } else {
                }
            });
    }

    exportExcel(listId: string[]) {
        let body;
        body = {
            filter: null,
            listId: listId,
            type: 2,
        };
        this.purchaseService.print006(body).subscribe(
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
    }

    archiveOrders(listIdSelected: string[], routeLink: string | null) {
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
                            this.snackbar.failureSnackBar();
                        },
                        () => {
                            this.isSucessArchivedSource.next(true);
                            this.snackbar.openSnackbar('Xóa thành công', 2000, 'Đóng', 'center', 'bottom', true);
                            if (routeLink) {
                                this.router.navigate([routeLink]);
                            }
                        },
                    );
                }
            });
    }

    getDetail(id: any) {
        this.purchaseService.detail(id).subscribe((data: PurchaseDetail) => {
            this.detailSource.next(data);
            let payment: Payment = {
                textMoney: this.numberToText.doc(data.totalPayment),
                prePayment: data.prePayment,
                totalAmount: data.totalAmount,
                totalDiscountProduct: data.totalDiscountProduct,
                tradeDiscount: data.tradeDiscount,
                totalPayment: data.totalPayment,
            };
            this.setPaymentSource(payment);
        });
    }

    updateOrder(bodyPayment: Payment, inforForm: FormGroup, id: string) {
        let body = {
            purchaseOrderId: id,
            orderDate: moment(inforForm.get('orderDate')?.value).format('YYYY-MM-DD'),
            groupId: inforForm.get('groupId')?.value,
            orderEmployeeId: inforForm.get('orderEmployeeId')?.value,
            customerId: inforForm.get('customerId')?.value,
            routeId: inforForm.get('routeId')?.value,
            type: 0,
            status: inforForm.get('status')?.value,
            paymentMethod: 0,
            description: inforForm.get('description')?.value,
            phone: inforForm.get('phone')?.value,
            address: inforForm.get('address')?.value,
            customerName: inforForm.get('customerName')?.value,
            totalAmount: bodyPayment.totalAmount,
            totalOfVAT: 0,
            totalDiscountProduct: bodyPayment.totalDiscountProduct,
            tradeDiscount: bodyPayment.tradeDiscount,
            totalPayment: bodyPayment.totalPayment,
            archived: false,
            lastModifiedDate: moment(Date.now()).format('YYYY-MM-DD'),
            orderCode: inforForm.get('code')?.value,
            deliveryDate: moment(inforForm.get('deliveryDate')?.value).format('YYYY-MM-DD'),
            prePayment: bodyPayment.prePayment,
        };
        this.purchaseService.update(body).subscribe(
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
                purchaseOrderProducts: listAdd.data,
            };
            addAPI = this.purchaseService.addProduct(bodyAddProduct);
        }
        if (listRemove.isRemove) {
            const bodyRemove = {
                listIdRemove: this.commonLogicService.formatListRemoveToSentAPI(listRemove.data),
                purchaseOrderId: id,
            };
            console.log(bodyRemove);
            removeAPI = this.purchaseService.removeProduct(bodyRemove);
        }
        if (listUpdate.length > 0) {
            let bodyUpdate = {
                purchaseOrderProducts: listUpdate,
            };
            updateAPI = this.purchaseService.updateProductList(bodyUpdate);
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

    // updateProduct(listUpdate: any) {
    //     if (listUpdate.length > 0) {
    //         let body = {
    //             purchaseOrderProducts: listUpdate,
    //         };
    //         this.purchaseService.updateProductList(body).subscribe(
    //             (data) => {},
    //             (err) => {
    //                 this.snackbar.failureSnackBar();
    //             },
    //             () => {
    //                 this.snackbar.successSnackBar();
    //                 this.commonLogicService.successUpdate();
    //             },
    //         );
    //     }
    // }

    // update status
    updateStatusOrder(changeTo: number) {
        const body: PurchaseBodyUpdate = {
            purchaseOrderId: this.detailSource.getValue().id,
            orderDate: this.detailSource.getValue().orderDate,
            groupId: this.detailSource.getValue().group?.id,
            orderEmployeeId: this.detailSource.getValue().orderEmployee?.id,
            warehouseId: this.detailSource.getValue().warehouse?.id,
            customerId: this.detailSource.getValue().customer?.id,
            routeId: this.detailSource.getValue().route?.id,
            type: this.detailSource.getValue().type,
            status: changeTo,
            paymentMethod: 0,
            description: this.detailSource.getValue().description,
            phone: this.detailSource.getValue().phone,
            address: this.detailSource.getValue().address,
            customerName: this.detailSource.getValue().customerName,
            totalAmount: this.detailSource.getValue().totalAmount,
            totalOfVAT: this.detailSource.getValue().totalOfVAT,
            totalDiscountProduct: this.detailSource.getValue().totalDiscountProduct,
            tradeDiscount: this.detailSource.getValue().tradeDiscount,
            totalPayment: this.detailSource.getValue().totalPayment,
            archived: false,
            lastModifiedDate: moment(Date.now()).format('YYYY-MM-DD'),
            orderCode: this.detailSource.getValue().orderCode,
            deliveryDate: this.detailSource.getValue().deliveryDate,
            prePayment: this.detailSource.getValue().prePayment,
        };
        // Chuyển sang trạng thái đã duyệt
        if (changeTo === 2) {
            this.purchaseService.update(body).subscribe(
                (data) => {},
                (err) => {},
                () => {
                    // update thành công sẽ gửi tín hiểu để reload thông tin
                    this.commonLogicService.successUpdate();
                    // custom Status when done
                    this.snackbar.openSnackbar('Duyệt thành công', 2000, 'Đóng', 'center', 'bottom', true);
                },
            );
        }
        // Chuyển sang trạng thái từ chối -> mở dialog confirm
        else if (changeTo === 5) {
            let dialogRef = this.dialog.open(ConfirmRejectComponent, {
                maxWidth: '100vw',
                maxHeight: '100vh',
                height: '100%',
                width: '100%',
                panelClass: 'full-screen-modal',
            });
            dialogRef.afterClosed().subscribe((data) => {
                if (data === 'Lưu') {
                    this.purchaseService.update(body).subscribe(
                        (data) => {},
                        (err) => {},
                        () => {
                            // update thành công sẽ gửi tín hiểu để reload thông tin
                            this.commonLogicService.successUpdate();
                            // custom Status when done
                            this.snackbar.openSnackbar(
                                'Từ chối đơn đặt hàng thành công',
                                2000,
                                'Đóng',
                                'center',
                                'bottom',
                                true,
                            );
                        },
                    );
                } else {
                }
            });
        }
        // khi ấn vào nút bán hàng (chia 2 trường hợp nếu trạng thái hiện tại là duyệt hay đã bán hàng)
        // Tạm thời chỉ để 1 trường hợp là đã duyệt
        else if (changeTo === 3) {
            // this.dialog.open(GenOrderSaleComponent, {
            //     maxWidth: '100vw',
            //     maxHeight: '100vh',
            //     height: '100%',
            //     width: '100%',
            //     panelClass: 'full-screen-modal',
            //     data: {
            //         isSaled: false,
            //         detailOrder: this.detailSource.getValue(),
            //     },
            // });

            this.router.navigate(['order/purchase/genSale']);
            // this.genSaleSource.next(this.detailSource.getValue());

            // if (this.statusNow === 2) {
            // } else if (this.statusNow === 3) {
            // this.dialog.open(GenOrderSaleComponent, {
            //     maxWidth: '100vw',
            //     maxHeight: '100vh',
            //     height: '100%',
            //     width: '100%',
            //     panelClass: 'full-screen-modal',
            //     data: {
            //         isSaled: true,
            //     },
            // });
            // console.log('Tạo mới đơn bán hàng khi trạng thái hiện tại là đã bán hàng');
        } else if (changeTo === 4) {
            this.purchaseService.update(body);
        }
    }

    updateToStatus4(id: string) {
        this.purchaseService.detail(id).subscribe((data: PurchaseDetail) => {
            const body: PurchaseBodyUpdate = {
                purchaseOrderId: data.id,
                orderDate: data.orderDate,
                groupId: data.group?.id,
                orderEmployeeId: data.orderEmployee?.id,
                warehouseId: data.warehouse?.id,
                customerId: data.customer?.id,
                routeId: data.route?.id,
                type: data.type,
                status: 4,
                paymentMethod: 0,
                description: data.description,
                phone: data.phone,
                address: data.address,
                customerName: data.customerName,
                totalAmount: data.totalAmount,
                totalOfVAT: data.totalOfVAT,
                totalDiscountProduct: data.totalDiscountProduct,
                tradeDiscount: data.tradeDiscount,
                totalPayment: data.totalPayment,
                archived: false,
                // lastModifiedBy: 'string',
                lastModifiedDate: moment(Date.now()).format('YYYY-MM-DD'),
                orderCode: data.orderCode,
                deliveryDate: data.deliveryDate,
                prePayment: data.prePayment,
            };
            this.purchaseService.update(body).subscribe(
                (data) => {},
                (err) => {},
                () => {
                    this.snackbar.openSnackbar('Xuất hàng thành công', 2000, 'Đóng', 'center', 'bottom', true);
                },
            );
        });
    }

    create() {
        let infoSource = this.infoCreateSource.getValue();
        let productSource = this.productCreateSource.getValue();
        let promotionSource = this.promtionCreateSource.getValue();
        let paymentSource = this.paymentCreateSource.getValue();

        let body: PurchaseBodyCreate = {
            orderDate: moment(infoSource.get('orderDate')?.value).format('YYYY-MM-DDTHH:mm:ss'),
            groupId: infoSource.get('groupId')?.value,
            orderEmployeeId: infoSource.get('orderEmployeeId')?.value,
            customerId: infoSource.get('customerId')?.value,
            routeId: infoSource.get('routeId')?.value,
            type: 0,
            status: infoSource.get('status')?.value,
            description: infoSource.get('description')?.value,
            phone: infoSource.get('phone')?.value,
            address: infoSource.get('address')?.value,
            customerName: infoSource.get('customerName')?.value,
            archived: false,
            createdDate: moment(Date.now()).format('YYYY-MM-DDTHH:mm:ss'),
            deliveryDate: moment(infoSource.get('deliveryDate')?.value).format('YYYY-MM-DD'),
            listProduct: this.commonLogicService.formatListAddToSentApi(productSource, 1),
            listPromotionProduct: this.commonLogicService.formatListAddToSentApi(promotionSource, 2),
            paymentMethod: 0, // có 1 loại payment
            prePayment: paymentSource.prePayment,
            totalAmount: paymentSource.totalAmount,
            totalOfVAT: 0, // là trường gì?
            totalDiscountProduct: paymentSource.totalDiscountProduct,
            tradeDiscount: paymentSource.tradeDiscount,
            totalPayment: paymentSource.totalPayment,
            source: 'Web',
        };
        this.purchaseService.createOrder(body).subscribe(
            (data) => {},
            (err) => {
                this.snackbar.failureSnackBar();
            },
            () => {
                this.snackbar.openSnackbar('Tạo mới đơn đặt hàng thành công', 2000, 'Đóng', 'center', 'bottom', true);
                this.router.navigate(['/order']);
            },
        );
    }
}
