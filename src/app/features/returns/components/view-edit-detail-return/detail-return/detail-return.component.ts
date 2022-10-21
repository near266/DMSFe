import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ListProduct, ListPromotionProduct } from 'src/app/core/model/PurchaseOrder';
import { DataService } from 'src/app/core/services/data.service';
import { PurchaseOrderService } from 'src/app/core/services/purchaseOrder.service';
import { ProductListComponent } from 'src/app/features/orders-mgm/components/product-list/product-list.component';
import { Subscription } from 'rxjs';
import { SaleReceiptService } from 'src/app/core/services/saleReceipt.service';
import { statusList } from 'src/app/core/data/PurchaseOrderList';
import { ReturnDetailsService } from '../../../services/return-details.service';
import { readMoney } from 'src/app/core/shared/utils/readMoney';
import { ComponentMode } from '../../../models/componentMode';

@Component({
    selector: 'app-detail-return',
    templateUrl: './detail-return.component.html',
    styleUrls: ['./detail-return.component.scss'],
})
export class DetailReturnComponent implements OnInit {
    statusList = statusList;
    statusNow!: number;
    ComponentModeList = ComponentMode;
    detailOrderForm!: FormGroup;
    currentMode: ComponentMode;
    detailOrderFakeData: any = [];
    totalPrice: number;
    textMoney: string;
    discountAmount: number;
    listProduct?: ListProduct[] = [];
    listPromotionProduct?: ListPromotionProduct[] = [];
    subscription: Subscription[] = [];
    id: string;

    constructor(
        private activatedRoute: ActivatedRoute,
        private fb: FormBuilder,
        private dataservice: DataService,
        private dialog: MatDialog,
        private saleReceipt: SaleReceiptService,
        private returnDetailsService: ReturnDetailsService,
    ) {}

    ngOnInit(): void {
        this.returnDetailsService.currentMode$.subscribe((mode) => {
            this.currentMode = mode;
        });
        // pass id to service
        this.returnDetailsService.totalPrice$.subscribe((data) => {
            this.totalPrice = data;
            const ins = new readMoney(data);
            this.textMoney = ins.doc(data - this.discountAmount);
        });
        this.returnDetailsService.discountAmount$.subscribe((data) => {
            this.discountAmount = data;
            const ins = new readMoney(data);
            this.textMoney = ins.doc(this.totalPrice - data);
        });
        // create Form
        this.detailOrderForm = this.fb.group({
            saleReceiptCode: [''],
            orderDate: [''],
            saleDate: [''],
            saleEmployee: [''],
            deliveryDate: [''],
            group: [''],
            orderEmployee: [''],
            route: [''],
            customerCode: [''],
            customerName: [''],
            phone: [''],
            address: [''],
            description: [''],
            debtLimit: [''],
            debtCurrent: [''],
            paymentMethod: [''],
            totalAmount: [''],
            totalOfVAT: [''],
            totalDiscountProduct: [''],
            tradeDiscount: [''],
            totalPayment: [''],
            prePayment: [''],
            status: [''],
        });
        // get type (Edit or View) from parent Component

        // get isChangeStatus
        this.saleReceipt.msg.subscribe((data) => {
            if (data === 'Done') {
                this.getDetail();
            }
        });
    }

    getDetail() {
        this.saleReceipt.searchById(this.id).subscribe((data) => {
            this.detailOrderFakeData = data;
            console.log(data);
            this.patchValue();
        });
    }

    patchValue() {
        // push if have relatedPurchaseOrder
        if (this.detailOrderFakeData.relatedOrder.purchaseOrderCode) {
            this.detailOrderFakeData.description += `  - Bán hàng theo phiếu đặt hàng số [${this.detailOrderFakeData.relatedOrder.purchaseOrderCode}]`;
        }
        this.detailOrderForm.patchValue({
            saleReceiptCode: this.detailOrderFakeData.saleReceiptCode,
            orderDate: this.detailOrderFakeData.orderDate,
            saleDate: this.detailOrderFakeData.saleDate,
            deliveryDate: this.detailOrderFakeData.deliveryDate,
            group: this.detailOrderFakeData.group?.groupId,
            orderEmployee: this.detailOrderFakeData.orderEmployee?.employeeId,
            route: this.detailOrderFakeData.route?.routeId,
            customerCode: this.detailOrderFakeData.customerCode,
            customerName: this.detailOrderFakeData.customerName,
            phone: this.detailOrderFakeData.phone,
            address: this.detailOrderFakeData.address,
            description: this.detailOrderFakeData.description,
            status: this.detailOrderFakeData.status,
        });
        this.listProduct = this.detailOrderFakeData.listProduct;
        this.listPromotionProduct = this.detailOrderFakeData.listPromotionProduct;
    }

    ngOnDestroy(): void {
        this.subscription.forEach((service) => {
            service.unsubscribe();
        });
    }

    ngAfterViewInit(): void {}

    ngDoCheck(): void {}

    stopPropagation(e: any) {
        e.stopPropagation();
    }

    openDialogProduct() {
        const dialogRef = this.dialog.open(ProductListComponent, {
            maxWidth: '100vw',
            maxHeight: '100vh',
            height: '100%',
            width: '100%',
            panelClass: 'full-screen-modal',
        });
    }
}
