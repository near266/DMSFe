import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { HistoryOrder } from '../../../models/history';
import { HistoryOrderService } from '../../../services/historyOrder.service';
import { TypeOrder } from '../../../template-component/template-history-order/typeOrder';

@Component({
    selector: 'app-history',
    templateUrl: './history.component.html',
    styleUrls: ['./history.component.scss'],
})
export class HistoryComponent implements OnInit, OnDestroy {
    isDetailReceipt: boolean = false;
    data: HistoryOrder = new HistoryOrder();
    TypeOrder = TypeOrder;
    subscription: Subscription = new Subscription();
    constructor(private historyOrderService: HistoryOrderService) {}

    ngOnInit(): void {
        this.subscription.add(
            this.historyOrderService
                .getHistoryOrder(localStorage.getItem('receiptOrderId')!, 2)
                .subscribe((data: HistoryOrder) => {
                    this.data = data;
                }),
        );
    }
    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}
