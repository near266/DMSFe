import { Component, OnInit } from '@angular/core';
import { ReturnDetailsService } from 'src/app/features/returns/services/return-details.service';

@Component({
    selector: 'app-detail-return-table',
    templateUrl: './detail-return-table.component.html',
    styleUrls: ['./detail-return-table.component.scss'],
})
export class DetailReturnTableComponent implements OnInit {
    productsInput: any[] = [];
    productQuantitySum: number;
    constructor(private returnDetailsService: ReturnDetailsService) {}

    ngOnInit(): void {
        this.productsInput = this.returnDetailsService.returnListProducts$.getValue();
        this.returnDetailsService.returnListProducts$.subscribe((_) => {
            this.productsInput = _;
            this.returnDetailsService.totalPrice$.next(this.getSumOfTotalPrice());
            this.returnDetailsService.discountAmount$.next(this.getSumOfDiscount());
            this.productQuantitySum = this.productsInput.reduce((a, b) => +a + +b.quantity, 0);
        });
    }
    getSumOfTotalPrice() {
        return this.productsInput.reduce((a, b) => +a + +b.totalPrice, 0);
    }
    getSumOfDiscount() {
        return this.productsInput.reduce((a, b) => +a + +b.discount, 0);
    }
}
