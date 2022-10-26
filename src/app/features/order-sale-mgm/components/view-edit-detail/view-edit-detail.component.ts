import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { map, Subscription, forkJoin } from 'rxjs';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { DataService } from 'src/app/core/services/data.service';
import { PurchaseOrderService } from 'src/app/core/services/purchaseOrder.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { ConfirmDialogComponent } from 'src/app/core/shared/components/confirm-dialog/confirm-dialog.component';
import { ConfirmRejectComponent } from 'src/app/features/orders-mgm/components/confirm-reject/confirm-reject.component';
import { GenOrderSaleComponent } from 'src/app/features/orders-mgm/components/gen-order-sale/gen-order-sale.component';
import { SaleReceiptService } from 'src/app/core/services/saleReceipt.service';
import { GenReturnOrderComponent } from '../gen-return-order/gen-return-order.component';
import * as moment from 'moment';
import { ReturnOrderService } from 'src/app/features/returns/services/return-order.service';

@Component({
    selector: 'app-view-edit-detail',
    templateUrl: './view-edit-detail.component.html',
    styleUrls: ['./view-edit-detail.component.scss'],
})
export class ViewEditDetailComponent implements OnInit {
    type!: string;
    statusNow!: number;
    id!: string;
    roleMain: string = 'member';
    subscription: Subscription[] = [];
    detailOrder: any = [];
    bodyUpdate: any = [];

    listProductUpdate: any;
    listProductPromotionUpdate: any;
    listProductRemove: any = [];
    listProductAdd: any = [];
    listProductPromotionAdd: any = [];
    listProductPromotionRemove: any = [];

    isRemoveProduct = false;
    isRemovePromotion = false;
    constructor(
        public activatedRoute: ActivatedRoute,
        public router: Router,
        private returnOrderService: ReturnOrderService,
        private dataService: DataService,
        private snackbar: SnackbarService,
        private dialog: MatDialog,
        private saleReceipt: SaleReceiptService,
        private purchaseOrder: PurchaseOrderService,
    ) {}

    ngOnInit(): void {
        this.roleMain = localStorage.getItem('roleMain')!;
        this.type = 'View';
        this.changeType('View');
        this.id = localStorage.getItem('receiptOrderId')!;
        // get body Update
        this.saleReceipt.updateOrderPass.subscribe((data) => {
            this.bodyUpdate = data;
        });
        // get list Product Update
        this.saleReceipt.productUpdate.subscribe((data) => {
            this.listProductUpdate = data;
        });
        // get list Product Remove
        this.saleReceipt.productRemove.subscribe((data) => {
            this.listProductRemove = data.list;
            this.isRemoveProduct = data.isRemove;
        });
        // get list product add
        this.saleReceipt.productAdd.subscribe((data) => {
            this.listProductAdd = data;
        });

        // get list ProductPromotion Add
        this.saleReceipt.productPromotionAdd.subscribe((data) => {
            this.listProductPromotionAdd = data;
        });
        // get list ProductPromotion Remove
        this.saleReceipt.productPromotionRemove.subscribe((data) => {
            this.listProductPromotionRemove = data.list;
            this.isRemovePromotion = data.isRemove;
        });
        // get list ProductPromotion Update
        this.saleReceipt.productPromotionUpdate.subscribe((data) => {
            this.listProductPromotionUpdate = data;
        });
    }

    ngAfterViewInit(): void {
        this.getDetail();
    }

    ngOnDestroy(): void {
        this.subscription.forEach((service) => service.unsubscribe());
    }

    getDetail() {
        this.saleReceipt.searchReceiptById(this.id).subscribe((data) => {
            this.statusNow = data.status;
            this.detailOrder = data;
            localStorage.setItem('customerId', data.customer?.id);
        });
    }

    ngDoCheck(): void {}

    changeType(type: any) {
        this.type = type;
        this.dataService.changeType(this.type);
    }

    // update status
    updateOrder(changeTo: number) {
        const body = {
            id: this.detailOrder.id,
            orderDate: this.detailOrder.orderDate,
            groupId: this.detailOrder.group?.id,
            saleCode: this.detailOrder.saleCode,
            saleEmployeeId: this.detailOrder.saleEmployee?.id,
            orderEmployeeId: this.detailOrder.orderEmployee?.id,
            warehouseId: this.detailOrder.warehouse?.id,
            customerId: this.detailOrder.customer?.id,
            routeId: this.detailOrder.route?.id,
            type: this.detailOrder.type,
            status: changeTo,
            paymentMethod: 0,
            description: this.detailOrder.description,
            phone: this.detailOrder.phone,
            address: this.detailOrder.address,
            customerName: this.detailOrder.customerName,
            purchaseOrderId: this.detailOrder.purchaseOrderId,
            deliveryDate: this.detailOrder.deliveryDate,
            saleDate: this.detailOrder.saleDate,
            paymentTerm: this.detailOrder.paymentTerm,
            totalAmount: this.detailOrder.totalAmount,
            totalOfVAT: this.detailOrder.totalOfVAT,
            totalDiscountProduct: this.detailOrder.totalDiscountProduct,
            tradeDiscount: this.detailOrder.tradeDiscount,
            totalPayment: this.detailOrder.totalPayment,
            prePayment: this.detailOrder.prePayment,
            // debtRecord: true,
        };
        // ấn vào nút trả hàng -> mở dialog gen phiếu trả
        if (changeTo === 0) {
            const { listProduct, listPromotionProduct, ...orderInfo } = this.detailOrder;
            this.returnOrderService.returnInfo$.next(this.returnOrderService.formatInfo(orderInfo));
            this.returnOrderService.returnOrderId$.next(this.detailOrder?.purchaseOrder?.id || null);
            this.returnOrderService.returnProductList$.next(this.returnOrderService.formatListProduct(listProduct));
            this.returnOrderService.returnPromotionList$.next(
                this.returnOrderService.formatListProduct(listPromotionProduct),
            );
            this.router.navigate(['returns/return_from_order']);
        }
        // Ấn vào nút xuất hàng
        else if (changeTo === 4) {
            this.saleReceipt.update(body).subscribe(
                (data) => {},
                (err) => {
                    this.snackbar.openSnackbar('Có lỗi xảy ra', 2000, 'Đóng', 'center', 'bottom', false);
                },
                () => {
                    if (this.detailOrder?.purchaseOrder?.id) {
                        this.updatePurchaseOrderStatus(4);
                    }
                    this.getDetail();
                },
            );
        }
    }

    updatePurchaseOrderStatus(status: number) {
        this.purchaseOrder.detail(this.detailOrder?.purchaseOrder?.id).subscribe((data) => {
            const body = {
                purchaseOrderId: data.id,
                orderDate: data.orderDate,
                groupId: data.unit?.id,
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
            this.purchaseOrder.update(body).subscribe(
                (data) => {},
                (err) => {},
                () => {
                    this.snackbar.openSnackbar('Xuất hàng thành công', 2000, 'Đóng', 'center', 'bottom', true);
                },
            );
        });
    }

    // update body order
    update() {
        const body = this.bodyUpdate;
        this.saleReceipt.update(body).subscribe(
            (data) => {},
            (err) => {
                this.snackbar.openSnackbar('Có lỗi xảy ra', 2000, 'Đóng', 'center', 'bottom', false);
            },
            () => {
                // custom Status when done
                this.snackbar.openSnackbar('Cập nhật thành công thành công', 2000, 'Đóng', 'center', 'bottom', true);
                this.getDetail();
                // gửi trạng thái để detail-order component biết rồi reload lại data
                this.saleReceipt.isSuccessUpdate('Done');
            },
        );
    }

    // update ProductList
    updateProductList() {
        // update detail Product and Add
        // this.updateDetailAndAddProduct();
        this.updateDetailAndAddProductAndPromotion();
        // remove Product & Product Promotion
        this.removeProductAndProductPromotion();
        // update detail ProductPromtion and Add
        // this.updateDetailAndAddProductPromotion();
    }

    updateDetailAndAddProduct() {
        const bodyUpdate = {
            saleRecieptProducts: this.listProductUpdate,
        };
        const bodyAdd = {
            saleRecieptProducts: this.listProductAdd,
        };
        const updateDetail = this.saleReceipt.updateProductList(bodyUpdate);
        const addProduct = this.saleReceipt.addProduct(bodyAdd);
        forkJoin([updateDetail, addProduct]).subscribe(
            (data) => {},
            (err) => {
                this.snackbar.openSnackbar('Có lỗi xảy ra', 2000, 'Đóng', 'center', 'bottom', false);
            },
            () => {
                this.snackbar.openSnackbar('Cập nhật thành công', 2000, 'Đóng', 'center', 'bottom', true);
                // gửi trạng thái để detail-order component biết rồi reload lại data
                this.saleReceipt.isSuccessUpdate('Done');
            },
        );
    }

    updateDetailAndAddProductAndPromotion() {
        // Product
        const bodyUpdateProduct = {
            saleRecieptProducts: this.listProductUpdate,
        };
        const bodyAddProduct = {
            saleRecieptProducts: this.listProductAdd,
        };
        // Promotion
        const bodyUpdatePromotion = {
            saleRecieptProducts: this.listProductPromotionUpdate,
        };
        const bodyAddPromotion = {
            saleRecieptProducts: this.listProductPromotionAdd,
        };

        const updateDetailProduct = this.saleReceipt.updateProductList(bodyUpdateProduct);
        const addProduct = this.saleReceipt.addProduct(bodyAddProduct);
        const updateDetailPromotion = this.saleReceipt.updateProductList(bodyUpdatePromotion);
        const addPromotion = this.saleReceipt.addProduct(bodyAddPromotion);
        forkJoin([updateDetailProduct, addProduct, updateDetailPromotion, addPromotion]).subscribe(
            (data) => {},
            (err) => {
                this.snackbar.openSnackbar('Có lỗi xảy ra', 2000, 'Đóng', 'center', 'bottom', false);
            },
            () => {
                this.snackbar.openSnackbar('Cập nhật thành công', 2000, 'Đóng', 'center', 'bottom', true);
                // gửi trạng thái để detail-order component biết rồi reload lại data
                this.saleReceipt.isSuccessUpdate('Done');
            },
        );
    }

    updateDetailAndAddProductPromotion() {
        const bodyUpdate = {
            saleRecieptProducts: this.listProductPromotionUpdate,
        };
        const bodyAdd = {
            saleRecieptProducts: this.listProductPromotionAdd,
        };
        const updateDetail = this.saleReceipt.updateProductList(bodyUpdate);
        const addProduct = this.saleReceipt.addProduct(bodyAdd);
        forkJoin([updateDetail, addProduct]).subscribe(
            (data) => {},
            (err) => {
                this.snackbar.openSnackbar('Có lỗi xảy ra', 2000, 'Đóng', 'center', 'bottom', false);
            },
            () => {
                this.snackbar.openSnackbar('Cập nhật thành công', 2000, 'Đóng', 'center', 'bottom', true);
                // gửi trạng thái để detail-order component biết rồi reload lại data
                this.saleReceipt.isSuccessUpdate('Done');
            },
        );
    }

    addProduct() {
        const bodyAdd = {
            saleRecieptProducts: this.listProductAdd,
        };
        this.saleReceipt.addProduct(bodyAdd).subscribe(
            (data) => {},
            (err) => {},
            () => {},
        );
    }

    removeProductAndProductPromotion() {
        if (this.isRemoveProduct) {
            const removeProductList = {
                listIdRemove: this.listProductRemove,
                purchaseOrderId: this.id,
            };
            this.saleReceipt.removeProduct(removeProductList).subscribe(
                (data) => {},
                (err) => {},
                () => {
                    this.saleReceipt.sendProductRemove({ isRemove: false, list: [] });
                    this.saleReceipt.isSuccessUpdate('Done');
                },
            );
        }
        if (this.isRemovePromotion) {
            const removePromotionList = {
                listIdRemove: this.listProductPromotionRemove,
                purchaseOrderId: this.id,
            };
            this.saleReceipt.removeProduct(removePromotionList).subscribe(
                (data) => {},
                (err) => {},
                () => {
                    this.saleReceipt.sendProductPromotionRemove({ isRemove: false, list: [] });
                    this.saleReceipt.isSuccessUpdate('Done');
                },
            );
        }
    }

    archive() {
        let dialogRef = this.dialog.open(ConfirmDialogComponent, {
            data: {
                content: 'Bạn có chắc chắn muốn lưu trữ bản ghi này không',
                action: ['Lưu trữ', 'Hủy'],
            },
        });
        dialogRef.afterClosed().subscribe((data) => {
            if (data === 'Lưu trữ') {
                let body = {
                    saleRecieptIds: [this.id],
                };
                this.saleReceipt.archive(body).subscribe(
                    (data) => {},
                    (err) => {
                        this.snackbar.openSnackbar('Có lỗi xảy ra', 2000, 'Đóng', 'center', 'bottom', false);
                    },
                    () => {
                        this.snackbar.openSnackbar('Lưu trữ thành công', 2000, 'Đóng', 'center', 'bottom', true);
                        setTimeout(() => {
                            this.router.navigate(['/ordersale']);
                        }, 1000);
                    },
                );
            } else {
            }
        });
    }
}
