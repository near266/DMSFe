import { AfterViewInit, Component, DoCheck, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/core/services/data.service';
import { PurchaseOrderService } from 'src/app/core/services/purchaseOrder.service';

@Component({
    selector: 'app-product-promotion-table',
    templateUrl: './product-promotion-table.component.html',
    styleUrls: ['./product-promotion-table.component.scss'],
})
export class ProductPromotionTableComponent implements OnInit, AfterViewInit, DoCheck {
    @Input() listPromotionProduct: any = [];
    @Input() listWarehouse: any = [];
    type: string = 'View';
    subscription: Subscription[] = [];

    constructor(private dataservice: DataService, private purchaseOrder: PurchaseOrderService) {}

    ngOnInit(): void {
        this.subscription.push(
            this.dataservice.type.subscribe((data: any) => {
                this.type = data;
            }),
        );
    }

    ngAfterViewInit(): void {}

    ngDoCheck(): void {}

    discountRate(product: any) {
        if (product.totalPrice) {
            product.discountRate = ((product.discount * 100) / product.totalPrice).toFixed(1);
        }
    }

    stopPropagation(e: any) {
        e.stopPropagation();
    }
}
