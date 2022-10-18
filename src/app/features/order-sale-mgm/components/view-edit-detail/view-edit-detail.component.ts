import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { map, Subscription } from 'rxjs';
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
            console.log(this.statusNow);
        });
    }

    ngDoCheck(): void {}

    changeType(type: any) {
        this.type = type;
        this.dataService.changeType(this.type);
    }

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
                    this.snackbar.openSnackbar('Xuất hàng thành công', 2000, 'Đóng', 'center', 'bottom', true);
                    this.getDetail();
                },
            );
        }
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
