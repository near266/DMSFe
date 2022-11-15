import { Component, OnInit } from '@angular/core';
import { Option } from '../../template-component/template-infor-order/template-infor-order.component';

@Component({
    selector: 'app-create',
    templateUrl: './create.component.html',
    styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit {
    option: Option = {
        title: 'Thêm mới đơn bán hàng',
        routerLink: 'order/sale',
        type: 'Create',
        order: 'Sale',
        status: [
            {
                name: 'Chờ duyệt',
                value: 1,
            },
            {
                name: 'Đã duyệt',
                value: 2,
            },
        ],
    };
    constructor() {}

    ngOnInit(): void {}
}
