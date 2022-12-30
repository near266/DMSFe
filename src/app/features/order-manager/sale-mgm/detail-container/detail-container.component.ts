import { AfterViewInit, Component, OnInit, QueryList } from '@angular/core';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { SaleDetail } from '../../models/saleDetail';
import { CommonLogicService } from '../../services/commonLogic.service';
import { SaleLogicService } from '../../services/saleLogic.service';
import { Validate, ValidateService } from '../../services/validate.service';
import { TemplateInforOrderComponent } from '../../template-component/template-infor-order/template-infor-order.component';
import { TemplateTableProductComponent } from '../../template-component/template-table-product/template-table-product.component';

@Component({
    selector: 'app-detail-container',
    templateUrl: './detail-container.component.html',
    styleUrls: ['./detail-container.component.scss'],
})
export class DetailContainerComponent implements OnInit, AfterViewInit {
    templateInforOrder: TemplateInforOrderComponent;
    templateTableProducts: QueryList<TemplateTableProductComponent>;
    roleMain: string = 'member';
    statusNow: number;
    isEdit: boolean = false;
    id: string = '';

    constructor(
        private saleLogicService: SaleLogicService,
        private commonLogicService: CommonLogicService,
        private validateService: ValidateService,
        private snackBarService: SnackbarService,
    ) {}

    ngOnInit(): void {
        this.roleMain = localStorage.getItem('roleMain')!;
        this.clearDataInDetailOrderSource();
        this.commonLogicService.changeToEditType();
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.getStatusNow();
        }, 0);
    }

    onActivate(componentActive: any) {
        if (componentActive.isDetailReceipt) {
            setTimeout(() => {
                this.templateInforOrder = componentActive.templateInforOrder;
                this.templateTableProducts = componentActive.templateTableProducts;
            });
        }
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
        let validate: Validate = this.validateService.validateSale(this.templateInforOrder, this.templateTableProducts);
        if (validate.isValid) {
            this.commonLogicService.save();
            this.changeType();
        } else {
            this.snackBarService.openSnackbar(validate.noteList.join('\n'), 2000, 'Đóng', 'center', 'bottom', false, [
                'bg-red-500',
            ]);
        }
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
