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

@Component({
    selector: 'app-view-edit-detail',
    templateUrl: './view-edit-detail.component.html',
    styleUrls: ['./view-edit-detail.component.scss'],
})
export class ViewEditDetailComponent implements OnInit {
    type!: string;
    statusNow!: number;
    id!: string;
    subscription: Subscription[] = [];
    detailOrder: any = [];
    bodyUpdate: any = [];

    listProductUpdate: any;
    listProductRemove: any = [];
    listProductAdd: any = [];

    isRemove = false;
    constructor(
        public activatedRoute: ActivatedRoute,
        public router: Router,
        private dataService: DataService,
        private snackbar: SnackbarService,
        private dialog: MatDialog,
        private saleReceipt: SaleReceiptService,
        private purchaseOrder: PurchaseOrderService,
    ) {}

    ngOnInit(): void {
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
            this.isRemove = data.isRemove;
        });
        // get list product add
        this.saleReceipt.productAdd.subscribe((data) => {
            this.listProductAdd = data;
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
            let dialogRef = this.dialog.open(GenReturnOrderComponent, {
                maxWidth: '100vw',
                maxHeight: '100vh',
                height: '100%',
                width: '100%',
                panelClass: 'full-screen-modal',
                data: this.detailOrder,
            });
            dialogRef.afterClosed().subscribe((data) => {
                if (data === 'Lưu') {
                    // call api create returnOrder
                    this.snackbar.openSnackbar('Tạo phiếu trả thành công', 2000, 'Đóng', 'center', 'bottom', true);
                } else {
                }
            });
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
        this.updateDetailAndAddProduct();
        // remove Product
        this.removeProduct();
    }

    updateDetailAndAddProduct() {
        const bodyUpdate = {
            saleRecieptProducts: this.listProductUpdate,
        };
        const updateDetail = this.saleReceipt.updateProductList(bodyUpdate);
        const bodyAdd = {
            saleRecieptProducts: this.listProductAdd,
        };
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
            (err) => {
                console.log('Them sp that bai');
            },
            () => {
                console.log('Them sp thanh cong');
            },
        );
    }

    removeProduct() {
        const removeList = {
            listIdRemove: this.listProductRemove,
            purchaseOrderId: this.id,
        };
        if (this.isRemove) {
            this.saleReceipt.removeProduct(removeList).subscribe(
                (data) => {},
                (err) => {},
                () => {
                    this.saleReceipt.isSuccessUpdate('Done');
                    this.saleReceipt.sendProductRemove({ isRemove: false, list: [] });
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
