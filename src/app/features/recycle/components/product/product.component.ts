import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-product',
    templateUrl: './product.component.html',
    styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {
    title = 'Sản phẩm';
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
