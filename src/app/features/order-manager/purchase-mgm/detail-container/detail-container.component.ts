import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { PurchaseDetail } from '../../models/purchaseDetail';
import { CommonLogicService } from '../../services/commonLogic.service';
import { PurchaseLogicService } from '../../services/purchaseLogic.service';

@Component({
    selector: 'app-detail-container',
    templateUrl: './detail-container.component.html',
    styleUrls: ['./detail-container.component.scss'],
})
export class DetailContainerComponent implements OnInit, AfterViewInit, OnDestroy {
    roleMain: string = 'member';
    isEdit: boolean = false;
    statusNow: number;
    isSave: boolean = false;
    id: string;
    private subscriptions = new Subscription();

    constructor(private commonLogicService: CommonLogicService, private purchaseLogicService: PurchaseLogicService) {}

    ngOnInit(): void {
        this.clearEditSource();
        this.roleMain = localStorage.getItem('roleMain')!;
        this.getStatusNow();
        this.clearDataInDetailOrderSource();
        this.setCustomerIdToLocalStorage();
        this.commonLogicService.changeToEditType();
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }
    clearEditSource() {
        this.commonLogicService.clearEditSource();
    }

    clearDataInDetailOrderSource() {
        this.purchaseLogicService.clearDataInDetailOrderSource();
    }

    getStatusNow() {
        this.subscriptions.add(
            this.purchaseLogicService.detail$.subscribe((data: PurchaseDetail) => {
                this.statusNow = data.status;
                // get IdOrder
                this.id = data.id;
            }),
        );
    }

    setCustomerIdToLocalStorage() {
        this.subscriptions.add(
            this.purchaseLogicService.detail$.subscribe((data: PurchaseDetail) => {
                this.commonLogicService.setCustomerIdToLocalStorage(data.customer?.id);
            }),
        );
    }

    ngAfterViewInit(): void {}

    changeType() {
        this.isEdit = !this.isEdit;
        this.commonLogicService.changeTypeEdit(this.isEdit);
    }

    exportExcel() {
        this.purchaseLogicService.exportExcel([this.id]);
    }

    save() {
        this.commonLogicService.save();
    }
    updateOrder(changeTo: number) {
        this.purchaseLogicService.updateStatusOrder(changeTo);
    }

    archive() {
        this.purchaseLogicService.archiveOrders([this.id], 'order/purchase');
    }
}
