import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ComponentRef, QueryList } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { PurchaseDetail } from '../../models/purchaseDetail';
import { CommonLogicService } from '../../services/commonLogic.service';
import { PurchaseLogicService } from '../../services/purchaseLogic.service';
import { Validate, ValidateService } from '../../services/validate.service';
import { TemplateInforOrderComponent } from '../../template-component/template-infor-order/template-infor-order.component';
import { TemplateTableProductComponent } from '../../template-component/template-table-product/template-table-product.component';
import { DetailPurchaseComponent } from './detail-purchase/detail-purchase.component';

@Component({
    selector: 'app-detail-container',
    templateUrl: './detail-container.component.html',
    styleUrls: ['./detail-container.component.scss'],
})
export class DetailContainerComponent implements OnInit, AfterViewInit, OnDestroy {
    templateInforOrder: TemplateInforOrderComponent;
    templateTableProducts: QueryList<TemplateTableProductComponent>;
    roleMain: string = 'member';
    isEdit: boolean = false;
    statusNow: number;
    isSave: boolean = false;
    id: string;
    private subscriptions = new Subscription();

    constructor(
        private commonLogicService: CommonLogicService,
        private purchaseLogicService: PurchaseLogicService,
        private validateService: ValidateService,
        private snackBarService: SnackbarService,
    ) {}

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

    onActivate(componentActive: any) {
        if (componentActive.isDetailPurchase) {
            setTimeout(() => {
                this.templateInforOrder = componentActive.templateInforOrder;
                this.templateTableProducts = componentActive.templateTableProducts;
            });
        }
    }

    changeType() {
        this.isEdit = !this.isEdit;
        this.commonLogicService.changeTypeEdit(this.isEdit);
    }

    exportExcel() {
        this.purchaseLogicService.exportExcel([this.id]);
    }

    save() {
        let validate: Validate = this.validateService.validatePurchase(
            this.templateInforOrder,
            this.templateTableProducts,
        );
        if (validate.isValid) {
            this.commonLogicService.save();
            this.changeType();
        } else {
            this.snackBarService.openSnackbar(validate.noteList.join('\n'), 2000, 'Đóng', 'center', 'bottom', false, [
                'bg-red-500',
            ]);
        }
    }
    updateOrder(changeTo: number) {
        this.purchaseLogicService.updateStatusOrder(changeTo);
    }

    archive() {
        this.purchaseLogicService.archiveOrders([this.id], 'order/purchase');
    }
}
