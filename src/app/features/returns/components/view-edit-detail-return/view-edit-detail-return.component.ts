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
import { ReturnFormService } from '../../services/return-form.service';
import { RolesService } from 'src/app/core/services/roles.service';

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
        private snackbar: SnackbarService,
        private rolesService: RolesService,
        private dialog: MatDialog,
        private returnFormService: ReturnFormService,
        private returnDetailsService: ReturnDetailsService,
    ) {}

    ngOnInit(): void {
        this.activatedRoute.paramMap
            .pipe(
                switchMap((params: ParamMap) => {
                    const id = params.get('id');
                    this.id = id!;
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

    requiredRoles(role: string) {
        return this.rolesService.requiredRoles(role);
    }

    ngOnDestroy(): void {
        this.subscription.forEach((service) => service.unsubscribe());
    }

    updateStatus(status: Status) {
        this.returnDetailsService.updateReturnInfo$.next({
            totalPayment:
                this.returnDetailsService.totalPrice$.getValue() - this.returnDetailsService.discountAmount$.getValue(),
            discountAmount: this.returnDetailsService.discountAmount$.getValue(),
            status,
        });
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

    deleteReturn() {
        let dialogRef = this.dialog.open(ConfirmDialogComponent, {
            data: {
                content: 'Bạn có chắc chắn muốn xóa bản ghi này không',
                action: ['Xóa', 'Hủy'],
            },
        });
        dialogRef.afterClosed().subscribe((data: any) => {
            if (data === 'Xóa') {
                this.returnFormService.deleteReturn(this.id);
            } else {
            }
        });
    }
}
