import { Component, OnInit } from '@angular/core';
import { ReturnDetailsService } from 'src/app/features/returns/services/return-details.service';

@Component({
    selector: 'app-detail-return-table-promotion-edit',
    templateUrl: './detail-return-table-promotion-edit.component.html',
    styleUrls: ['./detail-return-table-promotion-edit.component.scss'],
})
export class DetailReturnTablePromotionEditComponent implements OnInit {
    productsInput: any[] = [];
    warehouseOptions: { label?: string; value?: string }[] = [];
    unitOptions: { label?: string; value?: string }[] = [];
    constructor(private returnDetailsService: ReturnDetailsService) {}

    ngOnInit(): void {
        this.returnDetailsService.promotionListProduct$.subscribe((_) => {
            this.productsInput = _;
        });
    }
    removeProductFromReturn(id: string) {
        //find id in listProduct.product and remove
        this.productsInput = this.productsInput.filter((item) => item.product.id !== id);
        this.returnDetailsService.promotionListProduct$.next(this.productsInput);
    }
}
