import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-customer',
    templateUrl: './customer.component.html',
    styleUrls: ['./customer.component.scss'],
})
export class CustomerComponent implements OnInit {
    title = 'Khách hàng';
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
