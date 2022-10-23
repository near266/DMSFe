import { Component, OnInit } from '@angular/core';
import { Unit, Warehouse } from 'src/app/features/product/models/product';
import { ProductDialogService } from 'src/app/features/product/services/product-dialog.service';
import { ReturnDetailsService } from 'src/app/features/returns/services/return-details.service';

@Component({
    selector: 'app-detail-return-promotion',
    templateUrl: './detail-return-promotion.component.html',
    styleUrls: ['./detail-return-promotion.component.scss'],
})
export class DetailReturnPromotionComponent implements OnInit {
    productsInput: any[] = [];
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
