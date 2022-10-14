import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProductListComponent } from 'src/app/features/orders-mgm/components/product-list/product-list.component';

@Component({
    selector: 'app-create-order-sale',
    templateUrl: './create-order-sale.component.html',
    styleUrls: ['./create-order-sale.component.scss'],
})
export class CreateOrderSaleComponent implements OnInit {
    groupCites = ['Hà Nội', 'TP Hồ Chí Minh', 'Đà Nẵng'];

    constructor(private dialog: MatDialog) {}

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
}
