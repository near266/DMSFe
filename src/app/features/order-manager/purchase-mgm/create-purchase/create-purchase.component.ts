import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonLogicService } from '../../services/commonLogic.service';
import { PurchaseLogicService } from '../../services/purchaseLogic.service';
import { Payment } from '../../template-component/template-footer-order/template-footer-order.component';
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
    paymentNew: Payment = new Payment()

    paymentCreate$: Observable<Payment> = this.purchaseLogicService.paymentCreate$;

    constructor(private commonLogicService: CommonLogicService, private purchaseLogicService: PurchaseLogicService) {}

    create() {
        this.purchaseLogicService.create();
    }

    ngOnInit(): void {
        this.commonLogicService.changeToCreateType();
    }

    handleEmitBodyInfo(body: any) {
        this.purchaseLogicService.setInfoCreateSource(body);
    }

    handleEmitListProduct(body: any) {
        this.purchaseLogicService.setProductCreateSource(body);
    }

    handleEmitListPromotion(body: any) {
        this.purchaseLogicService.setPromotionCreateSource(body);
    }

    handleEmitPaymentCreate(body: Payment) {
        this.purchaseLogicService.setPaymentCreateSource(body);
    }
}
