import { Injectable } from '@angular/core';
import { PurchaseOrderService } from 'src/app/core/services/purchaseOrder.service';
import { Product, ProductSerch } from '../models/product';

@Injectable({
    providedIn: 'root',
})
export class CommonLogicService {
    listSearchedProduct: Product[] = [];
    constructor(private purchaseOrder: PurchaseOrderService) {}

    searchListProductActived(value: any) {
        const body = {
            keyword: value,
            sortBy: {
                property: 'CreatedDate',
                value: true,
            },
            page: 1,
            pageSize: 3,
        };
        this.purchaseOrder.getListProductActived(body).subscribe((data: ProductSerch) => {
            this.listSearchedProduct = data?.data;
        });
        return this.listSearchedProduct;
    }
}
