import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Observable } from 'rxjs';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { CommonLogicService } from '../../services/commonLogic.service';
import { SaleLogicService } from '../../services/saleLogic.service';
import { Validate, ValidateService } from '../../services/validate.service';
import { Payment } from '../../template-component/template-footer-order/template-footer-order.component';
import {
    Option,
    TemplateInforOrderComponent,
} from '../../template-component/template-infor-order/template-infor-order.component';
import { TemplateTableProductComponent } from '../../template-component/template-table-product/template-table-product.component';

@Component({
    selector: 'app-create',
    templateUrl: './create.component.html',
    styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit {
    @ViewChild(TemplateInforOrderComponent) templateInforOrder: TemplateInforOrderComponent;
    @ViewChildren(TemplateTableProductComponent) templateTableProducts: QueryList<TemplateTableProductComponent>;
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
    paymentNew: Payment = new Payment();
    paymentCreate$: Observable<Payment> = this.saleLogicService.paymentCreate$;
    constructor(
        private commonLogicService: CommonLogicService,
        private saleLogicService: SaleLogicService,
        private validateService: ValidateService,
        private snackBarService: SnackbarService,
    ) {}

    ngOnInit(): void {
        this.commonLogicService.changeToCreateType();
    }

    create() {
        let validate: Validate = this.validateService.validateSale(this.templateInforOrder, this.templateTableProducts);
        if (validate.isValid) {
            this.saleLogicService.create();
        } else {
            this.snackBarService.openSnackbar(validate.noteList.join('\n'), 2000, 'Đóng', 'center', 'bottom', false, [
                'bg-red-500',
            ]);
        }
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

    handleEmitPaymentCreate(body: any) {
        this.saleLogicService.setPaymentCreateSource(body);
    }
}
