import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonLogicService } from '../../services/commonLogic.service';
import { SaleLogicService } from '../../services/saleLogic.service';
import { Payment } from '../../template-component/template-footer-order/template-footer-order.component';
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
    order: {
        orderType: string;
        screenType: string;
    } = {
        orderType: 'Sale',
        screenType: 'Create',
    };
    paymentCreate$: Observable<Payment> = this.saleLogicService.paymentCreate$;
    constructor(private commonLogicService: CommonLogicService, private saleLogicService: SaleLogicService) {}

    ngOnInit(): void {
        this.commonLogicService.changeToCreateType();
    }

    create() {
        this.saleLogicService.create();
    }

    handleEmitBodyInfo(body: any) {
        this.saleLogicService.setInfoCreateSource(body);
    }

    handleEmitListProduct(body: any) {
        this.saleLogicService.setProductCreateSource(body);
    }

    handleEmitListPromotion(body: any) {
        this.saleLogicService.setPromotionCreateSource(body);
    }

    handleEmitPaymentCreate(body: Payment) {
        console.log(body);
        this.saleLogicService.setPaymentCreateSource(body);
    }
}
