import { AfterViewInit, Component, OnInit, HostListener, DoCheck, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import * as moment from 'moment';
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
    id!: any;
    subscription: Subscription[] = [];
    detailOrder: any;
    roleMain = 'member';

    bodyUpdate: any;
    listProductUpdate: any;
    listProductPromotionUpdate: any;
    listProductRemove: any = [];
    listProductPromotionRemove: any = [];
    listProductAdd: any = [];
    listProductPromotionAdd: any = [];

    isRemoveProduct = false;
    isRemovePromotion = false;
    constructor(
        public activatedRoute: ActivatedRoute,
        public router: Router,
        private dataService: DataService,
        private purchaseOrder: PurchaseOrderService,
        private snackbar: SnackbarService,
        private dialog: MatDialog,
    ) {}

    ngOnInit(): void {
        this.roleMain = localStorage.getItem('roleMain')!;
        this.type = 'View';
        this.changeType('View');

        this.activatedRoute.queryParamMap.subscribe(param => {
          console.log(param.get('id'));
          if(param.get('id')){
            console.log('Có');
            this.id = param.get('id');
            console.log(param.get('id'));

          }else{
            console.log('Không');
            this.id = localStorage.getItem('purchaseOrderId')!;
            console.log(this.id);

          }
        })




        // get body Update
        this.purchaseOrder.updateOrder.subscribe((data) => {
            this.bodyUpdate = data;
        });
        // get list Product Update
        this.purchaseOrder.productUpdate.subscribe((data) => {
            this.listProductUpdate = data;
        });
        // get list Product Promotion Update
        this.purchaseOrder.productPromotionUpdate.subscribe((data) => {
            this.listProductPromotionUpdate = data;
        });
        // get list Product Remove
        this.purchaseOrder.productRemove.subscribe((data) => {
            this.listProductRemove = data.list;
            this.isRemoveProduct = data.isRemove;
        });
        // get list Product Promotion Remove
        this.purchaseOrder.productPromotionRemove.subscribe((data) => {
            this.listProductPromotionRemove = data.list;
            this.isRemovePromotion = data.isRemove;
        });
        // get list product add
        this.purchaseOrder.productAdd.subscribe((data) => {
            this.listProductAdd = data;
        });
        // get list product promotion add
        this.purchaseOrder.productPromotionAdd.subscribe((data) => {
            this.listProductPromotionAdd = data;
        });
    }

    ngAfterViewInit(): void {
        this.getDetail();
    }

    ngOnDestroy(): void {
        this.subscription.forEach((service) => service.unsubscribe());
    }

    getDetail() {
        this.purchaseOrder.detail(this.id).subscribe((data) => {
            this.statusNow = data.status;
            this.detailOrder = data;
            localStorage.setItem('customerId', data.customer?.id);
        });
    }

    ngDoCheck(): void {
        // this.update();
    }

    changeType(type: any) {
        this.type = type;
        this.dataService.changeType(this.type);
    }

    // update status
    updateOrder(changeTo: number) {
        const body = {
            purchaseOrderId: this.detailOrder.id,
            orderDate: this.detailOrder.orderDate,
            groupId: this.detailOrder.group?.id,
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
            totalAmount: this.detailOrder.totalAmount,
            totalOfVAT: this.detailOrder.totalOfVAT,
            totalDiscountProduct: this.detailOrder.totalDiscountProduct,
            tradeDiscount: this.detailOrder.tradeDiscount,
            totalPayment: this.detailOrder.totalPayment,
            archived: false,
            // lastModifiedBy: 'string',
            lastModifiedDate: moment(Date.now()).format('YYYY-MM-DD'),
            orderCode: this.detailOrder.orderCode,
            deliveryDate: this.detailOrder.deliveryDate,
            prePayment: this.detailOrder.prePayment,
        };
        // Chuyển sang trạng thái đã duyệt
        if (changeTo === 2) {
            this.purchaseOrder.update(body).subscribe(
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
                    this.purchaseOrder.update(body).subscribe(
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
                        detailOrder: this.detailOrder,
                    },
                });
            } else if (this.statusNow === 3) {
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
            }
        }
    }

    // update body order
    update() {
        const body = this.bodyUpdate;
        this.purchaseOrder.update(body).subscribe(
            (data) => {},
            (err) => {
                this.snackbar.openSnackbar('Có lỗi xảy ra', 2000, 'Đóng', 'center', 'bottom', false);
            },
            () => {
                // custom Status when done
                this.snackbar.openSnackbar('Cập nhật thành công', 2000, 'Đóng', 'center', 'bottom', true);
                this.getDetail();
                // gửi trạng thái để detail-order component biết rồi reload lại data
                this.purchaseOrder.isSuccessUpdate('Done');
            },
        );
    }

    // update ProductList
    updateProductList() {
        // update detail Product
        this.updateDetailProduct();
        // remove Product
        this.removeProduct();
        // add product
        this.addProduct();
    }

    updateDetailProduct() {
        // update Product
        const bodyProduct = {
            purchaseOrderProducts: this.listProductUpdate,
        };
        this.purchaseOrder.updateProductList(bodyProduct).subscribe(
            (data) => {},
            (err) => {
                this.snackbar.openSnackbar('Có lỗi xảy ra', 2000, 'Đóng', 'center', 'bottom', false);
            },
            () => {
                // custom Status when done
                this.snackbar.openSnackbar('Cập nhật thành công', 2000, 'Đóng', 'center', 'bottom', true);
                this.getDetail();
                // gửi trạng thái để detail-order component biết rồi reload lại data
                this.purchaseOrder.isSuccessUpdate('Done');
            },
        );
        // update Product Promotion
        const bodyPromotion = {
            purchaseOrderProducts: this.listProductPromotionUpdate,
        };
        this.purchaseOrder.updateProductList(bodyPromotion).subscribe(
            (data) => {},
            (err) => {
                this.snackbar.openSnackbar('Có lỗi xảy ra', 2000, 'Đóng', 'center', 'bottom', false);
            },
            () => {
                // custom Status when done
                this.snackbar.openSnackbar('Cập nhật thành công', 2000, 'Đóng', 'center', 'bottom', true);
                this.getDetail();
                // gửi trạng thái để detail-order component biết rồi reload lại data
                this.purchaseOrder.isSuccessUpdate('Done');
            },
        );
    }

    removeProduct() {
        // remove product
        const removeListProduct = {
            listIdRemove: this.listProductRemove,
            purchaseOrderId: this.id,
        };
        if (this.isRemoveProduct) {
            this.purchaseOrder.removeProduct(removeListProduct).subscribe(
                (data) => {},
                (err) => {},
                () => {
                    // custom Status when done
                    // this.snackbar.openSnackbar('Cập nhật thành công', 2000, 'Đóng', 'center', 'bottom', true);
                    // this.getDetail();
                    // gửi trạng thái để detail-order component biết rồi reload lại data
                    this.purchaseOrder.isSuccessUpdate('Done');
                    this.purchaseOrder.sendProductRemove({ isRemove: false, list: [] });
                },
            );
        }
        // remove product Promotion
        const removeListPromotion = {
            listIdRemove: this.listProductPromotionRemove,
            purchaseOrderId: this.id,
        };
        if (this.isRemovePromotion) {
            this.purchaseOrder.removeProduct(removeListPromotion).subscribe(
                (data) => {},
                (err) => {},
                () => {
                    this.purchaseOrder.isSuccessUpdate('Done');
                    this.purchaseOrder.sendProductPromotionRemove({ isRemove: false, list: [] });
                },
            );
        }
    }

    addProduct() {
        // add product
        const bodyAddProduct = {
            purchaseOrderProducts: this.listProductAdd,
        };
        this.purchaseOrder.addProduct(bodyAddProduct).subscribe(
            (data) => {},
            (err) => {},
            () => {},
        );
        // add promotion
        const bodyAddPromotion = {
            purchaseOrderProducts: this.listProductPromotionAdd,
        };
        this.purchaseOrder.addProduct(bodyAddPromotion).subscribe(
            (data) => {},
            (err) => {},
            () => {},
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
                    purchaseOrderIds: [this.id],
                };
                this.purchaseOrder.archive(body).subscribe(
                    (data) => {},
                    (err) => {
                        this.snackbar.openSnackbar('Có lỗi xảy ra', 2000, 'Đóng', 'center', 'bottom', false);
                    },
                    () => {
                        this.snackbar.openSnackbar('Lưu trữ thành công', 2000, 'Đóng', 'center', 'bottom', true);
                        setTimeout(() => {
                            this.router.navigate(['/orders']);
                        }, 1000);
                    },
                );
            } else {
            }
        });
    }

    exportExcel() {
        let body;
        body = {
            filter: null,
            listId: [this.id],
            type: 2,
        };
        this.purchaseOrder.print(body).subscribe({
            next: (data) => {
                const blob = new Blob([data], {
                    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                });
                const url = window.URL.createObjectURL(blob);
                window.open(url);
            },
        });
    }
}
