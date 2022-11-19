import { AfterViewInit, Component, OnInit } from '@angular/core';
import { SaleDetail } from '../../models/saleDetail';
import { CommonLogicService } from '../../services/commonLogic.service';
import { SaleLogicService } from '../../services/saleLogic.service';

@Component({
    selector: 'app-detail-container',
    templateUrl: './detail-container.component.html',
    styleUrls: ['./detail-container.component.scss'],
})
export class DetailContainerComponent implements OnInit, AfterViewInit {
    roleMain: string = 'member';
    statusNow: number;
    isEdit: boolean = false;
    id: string = '';

    constructor(private saleLogicService: SaleLogicService, private commonLogicService: CommonLogicService) {}

    ngOnInit(): void {
        this.roleMain = localStorage.getItem('roleMain')!;
        this.clearDataInDetailOrderSource();
        this.commonLogicService.changeToEditType()
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.getStatusNow();
        });
    }

    clearDataInDetailOrderSource() {
        this.saleLogicService.clearDataInDetailOrderSource();
    }

    getStatusNow() {
        this.saleLogicService.detailOrder$.subscribe((data: SaleDetail) => {
            this.statusNow = data.status;
            this.id = data.id;
        });
    }

    changeType() {
        this.isEdit = !this.isEdit;
        this.commonLogicService.changeTypeEdit(this.isEdit);
    }

    save() {
        this.commonLogicService.save();
    }

    archive() {
        this.saleLogicService.archiveOrders([this.id], 'order/sale');
    }

    print() {
        this.saleLogicService.print([this.id]);
    }

    export() {
        this.saleLogicService.export([this.id]);
    }

    updateOrder(changeTo: number) {
        this.saleLogicService.updateStatusOrder(changeTo);
    }
}
