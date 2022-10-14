import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Product } from '../../models/product';
import { ProductDialogService } from '../../services/product-dialog.service';

@Component({
    selector: 'app-add-product-dialog',
    templateUrl: './add-product-dialog.component.html',
    styleUrls: ['./add-product-dialog.component.scss'],
})
export class AddProductDialogComponent implements OnInit {
    editMode = true;
    title = 'Thông tin chung';
    header = 'Thêm mới sản phẩm';
    subscription: Subscription = new Subscription();
    productId = '';
    constructor(
        private productDialogService: ProductDialogService,
        @Inject(MAT_DIALOG_DATA) public product: Product | null,
    ) {
        if (product) {
            this.header = 'Cập nhật sản phẩm';
        }
    }

    ngOnInit(): void {
        this.subscribeHeaderChanges();
        if (this.product) {
            this.editMode = false;
        }
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
        this.editMode = !this.editMode;
    }
    tabList = [
        { title: 'Thông tin chung', leftIcon: 'fa-regular fa-file-lines' },
        { title: 'Bảng giá', leftIcon: 'fa-solid fa-dollar-sign' },
        { title: 'Định mức tồn kho', leftIcon: 'fa-solid fa-flag' },
        { title: 'Tồn kho', leftIcon: 'fa-solid fa-box-archive' },
        { title: 'Tồn kho theo lô', leftIcon: 'fa-solid fa-box-archive' },
        { title: 'Lịch sử', leftIcon: 'fa-solid fa-clock-rotate-left' },
        // { title: 'Chấm thi phòng nhóm', leftIcon: 'fa-solid fa-location-dot' },
    ];
}
