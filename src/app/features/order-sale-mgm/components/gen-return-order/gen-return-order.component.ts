import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ProductListComponent } from 'src/app/features/orders-mgm/components/product-list/product-list.component';

@Component({
    selector: 'app-gen-return-order',
    templateUrl: './gen-return-order.component.html',
    styleUrls: ['./gen-return-order.component.scss'],
})
export class GenReturnOrderComponent implements OnInit {
    statusList = ['Chờ duyệt', 'Đã duyệt', 'Đã giao hàng'];
    groupCites = ['Hà Nội', 'TP Hồ Chí Minh', 'Đà Nẵng'];
    constructor(private dialog: MatDialog, public dialogRef: MatDialogRef<GenReturnOrderComponent>) {}

    ngOnInit(): void {}
    stopPropagation(e: any) {
        e.stopPropagation();
    }
    openDialogProduct() {
        const dialogRef = this.dialog.open(ProductListComponent, {
            maxWidth: '100vw',
            maxHeight: '100vh',
            height: '100%',
            width: '100%',
            panelClass: 'full-screen-modal',
        });
    }
    save() {
        this.dialogRef.close('Lưu');
    }
}
