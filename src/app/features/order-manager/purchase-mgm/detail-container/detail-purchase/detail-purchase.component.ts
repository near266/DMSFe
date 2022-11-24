import { AsyncPipe } from '@angular/common';
import { AfterViewInit, Component, OnInit, OnDestroy } from '@angular/core';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe-decorator';
import { Observable, Subscription } from 'rxjs';
import { NumberToTextService } from 'src/app/core/shared/services/number-to-text.service';
import { PurchaseDetail } from '../../../models/purchaseDetail';
import { CommonLogicService } from '../../../services/commonLogic.service';
import { PurchaseLogicService } from '../../../services/purchaseLogic.service';
import {
    coppyObject,
    DataInput,
    Option,
} from '../../../template-component/template-infor-order/template-infor-order.component';
export const StatusList = [
    {
        value: 1,
        name: 'Chờ duyệt',
    },
    {
        value: 2,
        name: 'Đã duyệt',
    },
    {
        value: 3,
        name: 'Đã bán hàng',
    },
    {
        value: 4,
        name: 'Đã xuất hàng',
    },
    {
        value: 5,
        name: 'Từ chối',
    },
    {
        value: 6,
        name: 'Đã nhập trả',
    },
];

@Component({
    selector: 'app-detail-purchase',
    templateUrl: './detail-purchase.component.html',
    styleUrls: ['./detail-purchase.component.scss'],
})
export class DetailPurchaseComponent implements OnInit, AfterViewInit, OnDestroy {
    option: Option = {
        routerLink: 'order',
        type: 'Detail',
        order: 'Purchase',
        status: StatusList,
    };
    order: {
        orderType: string;
        screenType: string;
    } = {
        orderType: 'Purchase',
        screenType: 'Detail',
    };
    private subscriptions = new Subscription();

    coppyObject: coppyObject;
    id: string;
    @AutoUnsubscribe()
    detail$: Observable<PurchaseDetail> = this.purchaseLogicService.detail$;
    @AutoUnsubscribe()
    isEdit$: Observable<boolean> = this.commonLogicService.isEdit$;
    @AutoUnsubscribe()
    isSave$: Observable<boolean> = this.commonLogicService.isSave$;
    @AutoUnsubscribe()
    list$: Observable<any> = this.commonLogicService.listProduct$;
    @AutoUnsubscribe()
    payment$: Observable<any> = this.purchaseLogicService.payment$;
    @AutoUnsubscribe()
    listPromotion$: Observable<any> = this.commonLogicService.listPromotion$;

    detailPassToInput: DataInput;

    constructor(
        private purchaseLogicService: PurchaseLogicService,
        private async: AsyncPipe,
        private commonLogicService: CommonLogicService,
        private numberToText: NumberToTextService,
    ) {}

    ngOnInit(): void {
        this.isSuccessUpdate();
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    isSuccessUpdate() {
        this.subscriptions.add(
            this.commonLogicService.isSucess$.subscribe((data) => {
                if (data) {
                    this.purchaseLogicService.clearDataInDetailOrderSource();
                    this.getDetail();
                }
            }),
        );
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.getDetail();
        }, 0);
    }

    getDetail() {
        this.id = localStorage.getItem('purchaseOrderId')!;
        this.purchaseLogicService.getDetail(this.id);
        this.getDetailPassToInput();
    }

    getDetailPassToInput() {
        this.subscriptions.add(
            this.purchaseLogicService.detail$.subscribe((data: PurchaseDetail) => {
                this.getDetailOrderPassToInput(data);
                this.getListProductAndPromotionPassToInput(data);
            }),
        );
    }

    private getDetailOrderPassToInput(data: PurchaseDetail) {
        this.detailPassToInput = {
            code: data.orderCode,
            status: data.status,
            orderDate: data.orderDate,
            deliveryDate: data.deliveryDate,
            groupId: data.group?.id,
            orderEmployeeId: data.orderEmployee?.id,
            routeId: data.route?.id,
            customerId: data.customer?.id,
            customerName: data.customer?.customerName,
            phone: data.customer?.phone,
            address: data.customer?.address,
            description: data.description,
        };
        this.coppyObject = {
            groupCoppy: data.group?.name,
            orderCoppy: data.orderEmployee?.employeeCode + ' - ' + data.orderEmployee?.employeeName,
            routeCoppy: data.route?.routeCode + ' - ' + data.route?.routeName,
            customerCoppy: data.customer?.customerCode + ' - ' + data.customer?.customerName,
        };
    }

    getListProductAndPromotionPassToInput(data: PurchaseDetail) {
        this.commonLogicService.formatUnitIdAndWareHouseId(data.listProduct, data.listPromotionProduct);
    }

    handleEmitListUpdate(e: { data: any; isUpdate: boolean }) {
        console.log(e);
    }

    handleEmitListPromotionUpdate(e: { data: any; isUpdate: boolean }) {
        console.log(e);
    }
}
