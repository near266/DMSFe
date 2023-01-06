import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-order',
    templateUrl: './order.component.html',
    styleUrls: ['./order.component.scss'],
})
export class OrderComponent implements OnInit {
    title = 'Đơn hàng, bán hàng, trả hàng';
    totalCount = 0;

    constructor() {}

    ngOnInit(): void {}

    signal(event: any) {
        console.log(event);

    }

    search(event: any) {
        console.log(event);
    }
}
