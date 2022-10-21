import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { map, Subscription, switchMap } from 'rxjs';
import { ActivatedRoute, NavigationExtras, ParamMap, Router } from '@angular/router';
import { DataService } from 'src/app/core/services/data.service';
import { PurchaseOrderService } from 'src/app/core/services/purchaseOrder.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { ConfirmDialogComponent } from 'src/app/core/shared/components/confirm-dialog/confirm-dialog.component';
import { ConfirmRejectComponent } from 'src/app/features/orders-mgm/components/confirm-reject/confirm-reject.component';
import { GenOrderSaleComponent } from 'src/app/features/orders-mgm/components/gen-order-sale/gen-order-sale.component';
import { GenReturnOrderComponent } from 'src/app/features/order-sale-mgm/components/gen-return-order/gen-return-order.component';
import { ReturnDetailsService } from '../../services/return-details.service';
import { HttpParams } from '@angular/common/http';
import { ComponentMode } from '../../models/componentMode';
import { Status } from '../../models/return';

@Component({
    selector: 'app-view-edit-detail-return',
    templateUrl: './view-edit-detail-return.component.html',
    styleUrls: ['./view-edit-detail-return.component.scss'],
})
export class ViewEditDetailReturnComponent implements OnInit {
    type!: ComponentMode;
    status: Status;
    StatusList = Status;
    id!: string;
    subscription: Subscription[] = [];
    ComponentMode = ComponentMode;
    constructor(
        public activatedRoute: ActivatedRoute,
        public router: Router,
        private dataService: DataService,
        private snackbar: SnackbarService,
        private dialog: MatDialog,
        private returnDetailsService: ReturnDetailsService,
        private purchaseOrder: PurchaseOrderService,
    ) {}

    ngOnInit(): void {
        this.activatedRoute.paramMap
            .pipe(
                switchMap((params: ParamMap) => {
                    const id = params.get('id');
                    return this.returnDetailsService.getReturnById(id);
                }),
            )
            .subscribe((data) => {
                console.log(data);
                this.status = data.status;
            });
        this.returnDetailsService.currentMode$.subscribe((_) => {
            this.type = _;
        });
    }

    ngOnDestroy(): void {
        this.subscription.forEach((service) => service.unsubscribe());
    }

    closeAndReset() {
        this.returnDetailsService.currentMode$.next(ComponentMode.VIEW);
        this.returnDetailsService.returnDetails$.next({});
        this.returnDetailsService.returnListProducts$.next([]);
        this.router.navigate(['/returns']);
    }

    ngDoCheck(): void {}

    toggleEditMode(_: boolean) {
        this.returnDetailsService.currentMode$.next(_ ? ComponentMode.EDIT : ComponentMode.VIEW);
    }
    updateReturn() {
        this.returnDetailsService.updateReturnProducts$.next(true);
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
