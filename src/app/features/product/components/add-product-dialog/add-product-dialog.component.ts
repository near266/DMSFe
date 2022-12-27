import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { RolesService } from 'src/app/core/services/roles.service';
import { ConfirmDialogComponent } from 'src/app/core/shared/components/confirm-dialog/confirm-dialog.component';
import { ConfirmDialogService } from 'src/app/core/shared/services/confirm-dialog.service';
import { Product } from '../../models/product';
import { ProductDialogService } from '../../services/product-dialog.service';

@Component({
    selector: 'app-add-product-dialog',
    templateUrl: './add-product-dialog.component.html',
    styleUrls: ['./add-product-dialog.component.scss'],
})
export class AddProductDialogComponent implements OnInit {
    mode: 'edit' | 'create' | 'view' = 'create';
    title = 'Thông tin chung';
    header = 'Thêm mới sản phẩm';
    subscription: Subscription = new Subscription();
    productId = '';
    constructor(
        private productDialogService: ProductDialogService,
        private rolesService: RolesService,
        private dialog: MatDialog,
        private confirmDialogService: ConfirmDialogService,
        @Inject(MAT_DIALOG_DATA) public product: Product | null,
    ) {
        if (product) {
            this.header = 'Cập nhật sản phẩm';
        }
    }

    ngOnInit(): void {
        this.subscribeHeaderChanges();
        if (this.product) {
            this.mode = 'view';
        }
    }
    requiredRoles(role: string) {
        return this.rolesService.requiredRoles(role);
    }
    private subscribeHeaderChanges() {
        this.subscription = this.productDialogService.header$.subscribe((value) => {
            this.productId = value;
        });
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
    toggleEditMode(): void {
        this.mode = 'edit';
        this.productDialogService.toggleEdit$.next(true);
    }
    submitForm(): void {
        this.productDialogService.submitForm$.next(true);
    }
    submitChange(): void {
        this.productDialogService.submitForm$.next(true);
    }
    deleteProduct(): void {
        let dialogRef = this.dialog.open(ConfirmDialogComponent, {
            data: {
                content: 'Bạn có chắc chắn muốn xóa sản phẩm này không',
                action: ['Xóa', 'Hủy'],
            },
        });
        dialogRef.afterClosed().subscribe((data: any) => {
            if (data === 'Xóa') {
                this.productDialogService.deleteProduct(this.product?.id);
            } else {
            }
        });
    }
    tabList: tabModel[] = [
        { title: 'Thông tin chung', leftIcon: 'fa-regular fa-file-lines' },
        { title: 'Bảng giá', leftIcon: 'fa-solid fa-dollar-sign' },
        { title: 'Định mức tồn kho', leftIcon: 'fa-solid fa-flag' },
        { title: 'Tồn kho', leftIcon: 'fa-solid fa-box-archive' },
        { title: 'Tồn kho theo lô', leftIcon: 'fa-solid fa-box-archive' },
        { title: 'Lịch sử', leftIcon: 'fa-solid fa-clock-rotate-left' },
        // { title: 'Chấm thi phòng nhóm', leftIcon: 'fa-solid fa-location-dot' },
    ];

    tabNow: tabModel = this.tabList[0];
}

export class tabModel {
    title: string;
    leftIcon: string;
}
