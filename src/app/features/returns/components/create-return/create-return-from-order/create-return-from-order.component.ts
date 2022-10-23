import { Component, OnInit } from '@angular/core';
import { readMoney } from 'src/app/core/shared/utils/readMoney';
import { ReturnOrderService } from '../../../services/return-order.service';

@Component({
    selector: 'app-create-return-from-order',
    templateUrl: './create-return-from-order.component.html',
    styleUrls: ['./create-return-from-order.component.scss'],
})
export class CreateReturnFromOrderComponent implements OnInit {
    orderInfo: any;
    productList: any[];
    promotionList: any[];
    totalPrice: number;
    textMoney: string;
    discountAmount: number;
    constructor(private returnOrderService: ReturnOrderService) {}

    ngOnInit(): void {
        this.returnOrderService.returnInfo$.subscribe((data) => {
            this.orderInfo = data;
        });
        this.returnOrderService.returnProductList$.subscribe((data) => {
            this.productList = data;
        });
        this.returnOrderService.returnPromotionList$.subscribe((data) => {
            this.promotionList = data;
        });
        this.returnOrderService.totalPrice$.subscribe((data) => {
            this.totalPrice = data;
            const ins = new readMoney(data);
            this.textMoney = ins.doc(data - this.discountAmount);
        });
        this.returnOrderService.discountAmount$.subscribe((data) => {
            this.discountAmount = data;
            const ins = new readMoney(data);
            this.textMoney = ins.doc(this.totalPrice - data);
        });
    }
    submitAddReturnForm() {
        this.returnOrderService.submitFormInfo$.next(true);
    }
}
