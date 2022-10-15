import { AfterViewInit, Component, OnInit, HostListener, DoCheck, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { map, Subscription } from 'rxjs';
import { DetailPurchaseOrder } from 'src/app/core/data/PurchaseOrderList';
import { PurchaseOrder, PurchaseOrderDetail } from 'src/app/core/model/PurchaseOrder';
import { DataService } from 'src/app/core/services/data.service';
import { PurchaseOrderService } from 'src/app/core/services/purchaseOrder.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { ConfirmDialogComponent } from 'src/app/core/shared/components/confirm-dialog/confirm-dialog.component';
import { ConfirmRejectComponent } from '../confirm-reject/confirm-reject.component';
import { GenOrderSaleComponent } from '../gen-order-sale/gen-order-sale.component';

@Component({
    selector: 'app-view-edit-detail-order',
    templateUrl: './view-edit-detail-order.component.html',
    styleUrls: ['./view-edit-detail-order.component.scss'],
})
export class ViewEditDetailOrderComponent implements OnInit, AfterViewInit, DoCheck, OnDestroy {
    type!: string;
    statusNow!: number;
    id!: string;
    subscription: Subscription[] = [];
    constructor(
        public activatedRoute: ActivatedRoute,
        public router: Router,
        private dataService: DataService,
        private purchaseOrder: PurchaseOrderService,
        private snackbar: SnackbarService,
        private dialog: MatDialog,
    ) {}

    ngOnInit(): void {
        this.type = 'View';
        this.changeType('View');
        this.id = localStorage.getItem('purchaseOrderId')!;
        console.log(this.id);
    }

    ngAfterViewInit(): void {
        // get id
        // setTimeout(() => {
        //     this.subscription.push(
        //         this.purchaseOrder.id.subscribe((data) => {
        //             this.id = data;
        //             if (this.id) {
        //                 this.getDetail();
        //             }
        //         }),
        //     );
        // }, 0);
        this.getDetail();
    }

    ngOnDestroy(): void {
        this.subscription.forEach((service) => service.unsubscribe());
    }

    getDetail() {
        this.purchaseOrder.detail(this.id).subscribe((data) => {
            this.statusNow = data.status;
        });
    }

    ngDoCheck(): void {
        this.update();
    }

    changeType(type: any) {
        this.type = type;
        this.dataService.changeType(this.type);
    }

    updateOrder(changeTo: number) {
        const body = {
            status: changeTo,
        };
        // Chuyển sang trạng thái đã duyệt
        if (changeTo === 2) {
            this.purchaseOrder.updateStatusPurchaseDetail(body, this.id).subscribe(
                (data) => {},
                (err) => {},
                () => {
                    this.purchaseOrder.isChangeStatus('Done');
                    this.getDetail();
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
                    this.purchaseOrder.updateStatusPurchaseDetail(body, this.id).subscribe(
                        (data) => {},
                        (err) => {},
                        () => {
                            this.purchaseOrder.isChangeStatus('Done');
                            this.getDetail();
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
        else if (changeTo === 3) {
            if (this.statusNow === 2) {
                this.dialog.open(GenOrderSaleComponent, {
                    maxWidth: '100vw',
                    maxHeight: '100vh',
                    height: '100%',
                    width: '100%',
                    panelClass: 'full-screen-modal',
                    data: {
                        isSaled: false,
                    },
                });
                console.log('Tạo mới đơn bán hàng khi trạng thái hiện tại là đã duyệt');
            } else if (this.statusNow === 3) {
                this.dialog.open(GenOrderSaleComponent, {
                    maxWidth: '100vw',
                    maxHeight: '100vh',
                    height: '100%',
                    width: '100%',
                    panelClass: 'full-screen-modal',
                    data: {
                        isSaled: true,
                    },
                });
                console.log('Tạo mới đơn bán hàng khi trạng thái hiện tại là đã bán hàng');
            }
        }
    }

    update() {
        const body = {
            purchaseOrderId: this.id,
            orderDate: '2022-10-14T07:22:15.195Z',
            groupId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
            orderEmployeeId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
            warehouseId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
            customerId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
            routeId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
            type: 0,
            status: 0,
            paymentMethod: 0,
            description: 'string',
            phone: 'string',
            address: 'string',
            customerName: 'string',
            totalAmount: 0,
            totalOfVAT: 0,
            totalDiscountProduct: 0,
            tradeDiscount: 0,
            totalPayment: 0,
            archived: true,
            lastModifiedBy: 'string',
            lastModifiedDate: '2022-10-14T07:22:15.195Z',
            orderCode: 'string',
            deliveryDate: '2022-10-14T07:22:15.195Z',
            prePayment: 0,
        };
    }

    delete() {
        let dialogRef = this.dialog.open(ConfirmDialogComponent, {
            data: {
                content: 'Bạn có chắc chắn muốn xóa bản ghi này không',
                action: ['Xóa', 'Hủy'],
            },
        });
        dialogRef.afterClosed().subscribe((data) => {
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
