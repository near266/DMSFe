import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-template-order-table-container',
    templateUrl: './template-order-table-container.component.html',
    styleUrls: ['./template-order-table-container.component.scss'],
})
export class TemplateOrderTableContainerComponent implements OnInit {
    _isShowSidebar = true;
    constructor() {}

    ngOnInit(): void {}

    isShowSidebar(value: boolean) {
        setTimeout(() => {
            this._isShowSidebar = value;
        }, 100000);
    }
}
