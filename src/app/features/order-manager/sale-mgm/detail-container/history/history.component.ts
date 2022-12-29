import { Component, OnInit } from '@angular/core';
import { HistoryOrder } from '../../../models/history';
import { HistoryOrderService } from '../../../services/historyOrder.service';
import { TypeOrder } from '../../../template-component/template-history-order/typeOrder';

@Component({
    selector: 'app-history',
    templateUrl: './history.component.html',
    styleUrls: ['./history.component.scss'],
})
export class HistoryComponent implements OnInit {
    data: HistoryOrder = new HistoryOrder();
    TypeOrder = TypeOrder;
    constructor(private historyOrderService: HistoryOrderService) {}

    ngOnInit(): void {
        this.historyOrderService
            .getHistoryOrder(localStorage.getItem('receiptOrderId')!, 2)
            .subscribe((data: HistoryOrder) => {
                this.data = data;
            });
    }
}
