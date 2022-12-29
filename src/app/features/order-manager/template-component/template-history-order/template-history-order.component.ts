import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { HistoryOrder } from '../../models/history';
import { TypeOrder } from './typeOrder';

@Component({
    selector: 'app-template-history-order',
    templateUrl: './template-history-order.component.html',
    styleUrls: ['./template-history-order.component.scss'],
})
export class TemplateHistoryOrderComponent implements OnInit, OnChanges {
    @Input() data: HistoryOrder = new HistoryOrder();
    @Input() type: number = TypeOrder.NONE;
    TypeOrder = TypeOrder;
    constructor() {}

    ngOnInit(): void {}

    ngOnChanges(changes: SimpleChanges): void {
        console.log(this.data);
    }
}
