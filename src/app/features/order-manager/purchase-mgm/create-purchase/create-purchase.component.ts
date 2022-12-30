import { AfterViewInit, Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Observable } from 'rxjs';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { CommonLogicService } from '../../services/commonLogic.service';
import { PurchaseLogicService } from '../../services/purchaseLogic.service';
import { Validate, ValidateService } from '../../services/validate.service';
import { Payment } from '../../template-component/template-footer-order/template-footer-order.component';
import {
    Option,
    TemplateInforOrderComponent,
} from '../../template-component/template-infor-order/template-infor-order.component';
import { TemplateTableProductComponent } from '../../template-component/template-table-product/template-table-product.component';

@Component({
    selector: 'app-create-purchase',
    templateUrl: './create-purchase.component.html',
    styleUrls: ['./create-purchase.component.scss'],
})
export class CreatePurchaseComponent implements OnInit, AfterViewInit {
    @ViewChild(TemplateInforOrderComponent) templateInforOrder: TemplateInforOrderComponent;
    @ViewChildren(TemplateTableProductComponent) templateTableProducts: QueryList<TemplateTableProductComponent>;

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
    paymentNew: Payment = new Payment();
    paymentCreate$: Observable<Payment> = this.purchaseLogicService.paymentCreate$;

    constructor(
        private commonLogicService: CommonLogicService,
        private purchaseLogicService: PurchaseLogicService,
        private validateService: ValidateService,
        private snackBarService: SnackbarService,
    ) {}

    create() {
        let validate: Validate = this.validateService.validatePurchase(
            this.templateInforOrder,
            this.templateTableProducts,
        );
        if (validate.isValid) {
            this.purchaseLogicService.create();
        } else {
            this.snackBarService.openSnackbar(validate.noteList.join('\n'), 2000, 'Đóng', 'center', 'bottom', false, [
                'bg-red-500',
            ]);
        }
    }

    ngOnInit(): void {
        this.commonLogicService.changeToCreateType();
    }

    ngAfterViewInit(): void {}

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
