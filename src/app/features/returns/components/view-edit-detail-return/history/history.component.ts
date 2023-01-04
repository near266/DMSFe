import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { HistoryOrder } from 'src/app/features/order-manager/models/history';
import { HistoryOrderService } from 'src/app/features/order-manager/services/historyOrder.service';
import { TypeOrder } from 'src/app/features/order-manager/template-component/template-history-order/typeOrder';

@Component({
    selector: 'return-history',
    templateUrl: './history.component.html',
    styleUrls: ['./history.component.scss'],
})
export class HistoryComponent implements OnInit {
    id!: string;
    data: HistoryOrder = new HistoryOrder();
    TypeOrder = TypeOrder;
    constructor(public activatedRoute: ActivatedRoute, private historyOrderService: HistoryOrderService) {}

    ngOnInit(): void {
        this.activatedRoute.paramMap.subscribe((data) => {
            this.id = data.get('id')!;
        });
        this.historyOrderService.getHistoryOrder(this.id, 3).subscribe((data: HistoryOrder) => {
            this.data = data;
        });
    }
}
