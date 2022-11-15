import { AsyncPipe } from '@angular/common';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs';
import { PurchaseDetail } from '../../../models/purchaseDetail';
import { CommonLogicService } from '../../../services/commonLogic.service';
import { PurchaseLogicService } from '../../../services/purchaseLogic.service';
import { DataInput, Option } from '../../../template-component/template-infor-order/template-infor-order.component';

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
export class DetailPurchaseComponent implements OnInit, AfterViewInit {
    option: Option = {
        routerLink: 'order',
        type: 'Detail',
        order: 'Purchase',
        status: StatusList,
    };
    id: string;
    detail$: Observable<PurchaseDetail> = this.purchaseLogicService.detail$;
    isEdit$: Observable<boolean> = this.commonLogicService.isEdit$;
    detailPassToInput: DataInput;

    constructor(
        private purchaseLogicService: PurchaseLogicService,
        private async: AsyncPipe,
        private commonLogicService: CommonLogicService,
    ) {}

    ngOnInit(): void {}

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
        this.purchaseLogicService.detail$.subscribe(
            (data: PurchaseDetail) =>
                (this.detailPassToInput = {
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
                }),
        );
    }
}
