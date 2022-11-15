import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { readMoney } from 'src/app/core/shared/utils/readMoney';
import { ReturnOrderService } from '../../../services/return-order.service';

@Component({
    selector: 'app-create-return-from-order',
    templateUrl: './create-return-from-order.component.html',
    styleUrls: ['./create-return-from-order.component.scss'],
})
export class CreateReturnFromOrderComponent implements OnInit {
    orderInfo: any;
    tradeDiscount: number = 0;
    totalPrice: number;
    textMoney: string;
    discountAmount: number;
    subscription: Subscription[] = [];
    constructor(private returnOrderService: ReturnOrderService) {}
    ngOnInit(): void {
        this.subscription.push(
            this.returnOrderService.totalPrice$.subscribe((data) => {
                this.totalPrice = data;
                const ins = new readMoney(data);
                this.textMoney = ins.doc(data - this.discountAmount);
            }),
        );
        this.subscription.push(
            this.returnOrderService.discountAmount$.subscribe((data) => {
                this.discountAmount = data;
                this.calculateTotalPay();
            }),
        );
    }
    calculateTotalPay() {
        const ins = new readMoney(this.discountAmount);
        this.textMoney = ins.doc(this.totalPrice - this.discountAmount - this.tradeDiscount);
    }
    updateTradeDiscount() {
        this.returnOrderService.tradeDiscount$.next(this.tradeDiscount);
    }

    submitAddReturnForm() {
        this.returnOrderService.submitFormInfo$.next(true);
    }
    ngOnDestroy(): void {
        this.subscription.forEach((item) => {
            item.unsubscribe();
        });
    }
}
