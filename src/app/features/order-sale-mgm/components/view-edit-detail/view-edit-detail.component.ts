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
    }

    ngAfterViewInit(): void {
        // get id
        setTimeout(() => {
            this.subscription.push(
                this.saleReceipt.id.subscribe((data) => {
                    this.id = data;
                    if (this.id) {
                        this.getDetail();
                    }
                }),
            );
        }, 0);
    }

    ngOnDestroy(): void {
        this.subscription.forEach((service) => service.unsubscribe());
    }

    getDetail() {
        this.saleReceipt.searchById(this.id).subscribe((data) => {
            this.statusNow = data.status;
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
            status: changeTo,
        };
        // ấn vào nút trả hàng
        if (changeTo === 0) {
            let dialogRef = this.dialog.open(GenReturnOrderComponent, {
                maxWidth: '100vw',
                maxHeight: '100vh',
                height: '100%',
                width: '100%',
                panelClass: 'full-screen-modal',
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
            this.saleReceipt.updateOrder(this.id, body).subscribe(
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
        // Khi ấn vào nút hủy
        // else if(changeTo === 7 ) {

        // }
    }

    delete() {
        let dialogRef = this.dialog.open(ConfirmDialogComponent, {
            data: {
                content: 'Bạn có chắc chắn muốn xóa bản ghi này không',
                action: ['Xóa', 'Hủy'],
            },
        });
        dialogRef.afterClosed().subscribe((data: any) => {
            if (data === 'Xóa') {
                this.purchaseOrder.deletePurchase(this.id).subscribe(
                    (data) => {},
                    (err) => {
                        this.snackbar.openSnackbar('Có lỗi xảy ra', 2000, 'Đóng', 'center', 'bottom', false);
                    },
                    () => {
                        this.snackbar.openSnackbar('Xóa thành công', 100000, 'Đóng', 'center', 'bottom', true);
                        this.router.navigate(['/orders']);
                    },
                );
            } else {
            }
        });
    }
}
