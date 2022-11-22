import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import moment from 'moment';
import { Observable } from 'rxjs';
import { PurchaseOrderService } from 'src/app/core/services/purchaseOrder.service';
import { NumberToTextService } from 'src/app/core/shared/services/number-to-text.service';
import { PurchaseDetail } from '../../models/purchaseDetail';
import { CommonLogicService } from '../../services/commonLogic.service';
import { PurchaseLogicService } from '../../services/purchaseLogic.service';
import { SaleLogicService } from '../../services/saleLogic.service';
import { Payment } from '../../template-component/template-footer-order/template-footer-order.component';
import { DataInput, Option } from '../../template-component/template-infor-order/template-infor-order.component';

@Component({
    selector: 'app-gen-sale',
    templateUrl: './gen-sale.component.html',
    styleUrls: ['./gen-sale.component.scss'],
})
export class GenSaleComponent implements OnInit, AfterViewInit {
    option: Option = {
        type: 'Gen',
        order: 'Sale',
    };
    order: {
        orderType: string;
        screenType: string;
    } = {
        orderType: 'Sale',
        screenType: 'Create',
    };

    payment$: Observable<Payment> = this.saleLogicService.paymentGen$;

    detailPassToInput: DataInput;
    purchaseOrderId: string = '';
    listProduct$ = this.commonLogicService.listProduct$;
    listPromotion$ = this.commonLogicService.listPromotion$;
    listProductSentApi: any[] = [];
    listPromotionSentApi: any[] = [];
    infoForm: FormGroup;
    relatedPurchase: PurchaseDetail;

    constructor(
        private saleLogicService: SaleLogicService,
        private purchaseLogicService: PurchaseLogicService,
        private purchaseService: PurchaseOrderService,
        private commonLogicService: CommonLogicService,
        private numberToText: NumberToTextService,
    ) {}

    ngOnInit(): void {
        this.purchaseOrderId = localStorage.getItem('purchaseOrderId')!;
        this.commonLogicService.changeToCreateType();
    }

    ngAfterViewInit(): void {
        this.getDetailPassToInput();
    }

    getDetailPassToInput() {
        this.purchaseService.detail(this.purchaseOrderId).subscribe((data: PurchaseDetail) => {
            this.relatedPurchase = data;
            this.detailPassToInput = {
                orderDate: data.orderDate,
                status: data.status,
                saleDate: moment(Date.now()).format('YYYY-MM-DD'),
                deliveryDate: data.deliveryDate,
                groupId: data.group?.id,
                orderEmployeeId: data.orderEmployee?.id,
                routeId: data.route?.id,
                saleEmployee: this.commonLogicService.getIdDefault(),
                phone: data.customer?.phone,
                address: data.customer?.address,
                description: data.description
                    ? `${data.description} - Bán hàng theo phiếu đặt hàng số [${data.orderCode}]`
                    : `Bán hàng theo phiếu đặt hàng số [${data.orderCode}]`,
                customerId: data.customer?.id,
                customerName: data.customer?.customerName,
                relatedId: data.id,
            };
            let payment: Payment = {
                prePayment: data.prePayment,
                totalAmount: data.totalAmount,
                totalDiscountProduct: data.totalDiscountProduct,
                tradeDiscount: data.tradeDiscount,
                totalPayment: data.totalPayment,
                textMoney: this.numberToText.doc(data.totalPayment),
            };
            this.saleLogicService.setPaymentGenSource(payment);
            this.getListProductAndPromotionPassToInput(data);
        });
    }

    genSale() {
        this.purchaseLogicService.genSale();
    }

    getListProductAndPromotionPassToInput(data: PurchaseDetail) {
        this.commonLogicService.formatUnitIdAndWareHouseId(data.listProduct, data.listPromotionProduct);
    }

    handleEmitListProduct(e: { list: any[]; listAdd: any[] }) {
        let list = [...e.list, ...e.listAdd];
        let listProductAfterFormat = this.commonLogicService.formatListAddToSentApi(list, 1);
        this.listProductSentApi = listProductAfterFormat;
    }

    handleEmitListPromotion(e: { list: any[]; listAdd: any[] }) {
        let list = [...e.list, ...e.listAdd];
        let listPromotiocnAfterFormat = this.commonLogicService.formatListAddToSentApi(list, 2);
        this.listPromotionSentApi = listPromotiocnAfterFormat;
        this.createSale();
    }

    createSale() {
        this.saleLogicService.createSaleGen(
            {
                infoForm: this.infoForm,
                listProduct: this.listProductSentApi,
                listPromotion: this.listPromotionSentApi,
            },
            this.relatedPurchase,
        );
    }

    handleEmitInfo(e: FormGroup) {
        this.infoForm = e;
    }
}
