import { Component, OnInit } from '@angular/core';
import { CommonLogicService } from '../../services/commonLogic.service';
import { Option } from '../../template-component/template-infor-order/template-infor-order.component';

@Component({
    selector: 'app-create-purchase',
    templateUrl: './create-purchase.component.html',
    styleUrls: ['./create-purchase.component.scss'],
})
export class CreatePurchaseComponent implements OnInit {
    option: Option = {
        title: 'Thêm mới đơn đặt hàng',
        routerLink: 'order',
        type: 'Create',
        order: 'Purchase',
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
    order: {
        orderType: string;
        screenType: string;
    } = {
        orderType: 'Purchase',
        screenType: 'Create',
    };

    constructor(private commonLogicService: CommonLogicService) {}

    create() {
        this.commonLogicService.create();
    }
    ngOnInit(): void {}

    handleEmitBodyInfo(e: any) {
        console.log(e);
    }
    handleEmitListProduct(e: any) {
        console.log(e);
    }
    handleEmitListPromotion(e: any) {
        console.log(e);
    }
}
