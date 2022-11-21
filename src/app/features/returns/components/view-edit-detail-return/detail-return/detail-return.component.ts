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
    tradeDiscount: number;
    currentMode: ComponentMode;
    totalPrice: number;
    textMoney: string;
    discountAmount: number;
    subscription: Subscription[] = [];
    id: string;
    constructor(private returnDetailsService: ReturnDetailsService) {}

    ngOnInit(): void {
        this.subscription.push(
            this.returnDetailsService.currentMode$.subscribe((mode) => {
                this.currentMode = mode;
            }),
        );
        // pass id to service
        this.subscription.push(
            this.returnDetailsService.totalPrice$.subscribe((data) => {
                this.totalPrice = data;
                const ins = new readMoney(data);
                this.textMoney = ins.doc(data - this.discountAmount);
            }),
        );
        this.subscription.push(
            this.returnDetailsService.discountAmount$.subscribe((data) => {
                this.discountAmount = data;
                const ins = new readMoney(data);
                this.textMoney = ins.doc(this.totalPrice - this.discountAmount - this.tradeDiscount);
            }),
        );
        this.subscription.push(
            this.returnDetailsService.tradeDiscount$.subscribe((data) => {
                this.tradeDiscount = data;
            }),
        );
    }
    calculateTotalPay() {
        const ins = new readMoney(0);
        this.textMoney = ins.doc(
            this.returnDetailsService.totalPrice$.getValue() -
                this.returnDetailsService.discountAmount$.getValue() -
                this.tradeDiscount,
        );
    }
    updateTradeDiscount() {
        this.returnDetailsService.tradeDiscount$.next(this.tradeDiscount);
    }
    ngOnDestroy(): void {
        this.subscription.forEach((service) => {
            service.unsubscribe();
        });
    }

    stopPropagation(e: any) {
        e.stopPropagation();
    }
}
