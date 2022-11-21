import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-customer',
    templateUrl: './customer.component.html',
    styleUrls: ['./customer.component.scss'],
})
export class CustomerComponent implements OnInit {
    custId: string;
    constructor() {}

    ngOnInit(): void {
        this.custId = localStorage.getItem('customerId')!;
    }
}
