import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-create-return-promotion-table',
    templateUrl: './create-return-promotion-table.component.html',
    styleUrls: ['./create-return-promotion-table.component.scss'],
})
export class CreateReturnPromotionTableComponent implements OnInit {
    productQuantitySum: number;
    productsInput: any[];
    unitOptions: any[] = [];
    warehouseOptions: any[] = [];
    constructor() {}

    ngOnInit(): void {}
    updateItemTotalPrice(item: any): void {}
    updateDiscountRate(item: any): void {}
}
