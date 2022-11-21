import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { SaleEmployee } from 'src/app/core/model/SaleReceipt';
import { SaleDetail } from '../../../models/saleDetail';
import { CommonLogicService } from '../../../services/commonLogic.service';
import { SaleLogicService } from '../../../services/saleLogic.service';
import { DataInput, Option } from '../../../template-component/template-infor-order/template-infor-order.component';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe-decorator';
import { Payment } from '../../../template-component/template-footer-order/template-footer-order.component';

@Component({
    selector: 'app-detail',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit, AfterViewInit {
    private subscriptions: Subscription = new Subscription();
    option: Option = {
        type: 'Detail',
        order: 'Sale',
    };
    order: {
        orderType: string;
        screenType: string;
    } = {
        orderType: 'Sale',
        screenType: 'Detail',
    };
    id: string = '';
    @AutoUnsubscribe()
    isEdit$: Observable<boolean> = this.commonLogicService.isEdit$;
    @AutoUnsubscribe()
    list$: Observable<any> = this.commonLogicService.listProduct$;
    @AutoUnsubscribe()
    listPromotion$: Observable<any> = this.commonLogicService.listPromotion$;
    @AutoUnsubscribe()
    payment$: Observable<Payment> = this.saleLogicService.payment$;

    detailPassToInput: DataInput;
    constructor(private commonLogicService: CommonLogicService, private saleLogicService: SaleLogicService) {}

    ngOnInit(): void {
        this.isSuccessUpdate();
    }
    ngAfterViewInit(): void {
        setTimeout(() => {
            this.getDetail();
        }, 0);
    }

    getDetail() {
        this.id = localStorage.getItem('receiptOrderId')!;
        this.saleLogicService.getDetail(this.id);
        this.getDetailPassToInput();
    }

    isSuccessUpdate() {
        this.subscriptions.add(
            this.commonLogicService.isSucess$.subscribe((data) => {
                if (data) {
                    this.saleLogicService.clearDataInDetailOrderSource();
                    this.getDetail();
                }
            }),
        );
    }

    getDetailPassToInput() {
        this.saleLogicService.detailOrder$.subscribe((data: SaleDetail) => {
            this.detailPassToInput = {
                code: data.saleCode,
                orderDate: data.orderDate,
                status: data.status,
                saleDate: data.saleDate,
                deliveryDate: data.deliveryDate,
                groupId: data.group?.id,
                orderEmployeeId: data.orderEmployee?.id,
                routeId: data.route?.id,
                saleEmployee: data.saleEmployee?.id,
                phone: data.customer?.phone,
                address: data.customer?.address,
                description: data.description,
                customerId: data.customer?.id,
                customerName: data.customer?.customerName,
                relatedId: data.purchaseOrder?.id,
            };
            this.getListProductAndPromotionPassToInput(data);
        });
    }

    getListProductAndPromotionPassToInput(data: SaleDetail) {
        this.commonLogicService.formatUnitIdAndWareHouseId(data.listProduct, data.listPromotionProduct);
    }
}
