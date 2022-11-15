import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SaleEmployee } from 'src/app/core/model/SaleReceipt';
import { SaleDetail } from '../../../models/saleDetail';
import { CommonLogicService } from '../../../services/commonLogic.service';
import { SaleLogicService } from '../../../services/saleLogic.service';
import { DataInput, Option } from '../../../template-component/template-infor-order/template-infor-order.component';

@Component({
    selector: 'app-detail',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit, AfterViewInit {
    option: Option = {
        type: 'Detail',
        order: 'Sale',
    };
    id: string = '';
    isEdit$: Observable<boolean> = this.commonLogicService.isEdit$;
    detailPassToInput: DataInput;
    constructor(private commonLogicService: CommonLogicService, private saleLogicService: SaleLogicService) {}

    ngOnInit(): void {}
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
            };
        });
    }
}
