import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-product-list',
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {
    isSelectAll = false;
    constructor() {}

    ngOnInit(): void {}
    stopPropagation(e: any) {
        e.stopPropagation();
    }
}
