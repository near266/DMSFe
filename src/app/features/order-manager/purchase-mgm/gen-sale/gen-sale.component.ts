import { Component, OnInit, AfterViewInit } from '@angular/core';
import moment from 'moment';
import { PurchaseOrderService } from 'src/app/core/services/purchaseOrder.service';
import { PurchaseDetail } from '../../models/purchaseDetail';
import { SaleDetail } from '../../models/saleDetail';
import { CommonLogicService } from '../../services/commonLogic.service';
import { PurchaseLogicService } from '../../services/purchaseLogic.service';
import { SaleLogicService } from '../../services/saleLogic.service';
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
    detailPassToInput: DataInput;
    purchaseOrderId: string = '';
    listProduct$ = this.commonLogicService.listProduct$;
    listPromotion$ = this.commonLogicService.listPromotion$;

    constructor(
        private saleLogicService: SaleLogicService,
        private purchaseLogicService: PurchaseLogicService,
        private purchaseService: PurchaseOrderService,
        private commonLogicService: CommonLogicService,
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
                    : data.description,
                customerId: data.customer?.id,
                customerName: data.customer?.customerName,
                relatedId: data.id,
            };
            this.getListProductAndPromotionPassToInput(data);
        });
    }

    getListProductAndPromotionPassToInput(data: PurchaseDetail) {
        this.commonLogicService.formatUnitIdAndWareHouseId(data.listProduct, data.listPromotionProduct);
    }
}
