import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { Product } from '../../../product/models/product';
import { DataService } from 'src/app/core/services/data.service';
import { readMoney } from 'src/app/core/shared/utils/readMoney';
import { PurchaseOrderService } from 'src/app/core/services/purchaseOrder.service';
import { ProductListComponent } from 'src/app/features/orders-mgm/components/product-list/product-list.component';
import { ReturnFormService } from '../../services/return-form.service';
import { combineLatest, Observable, Subscription, tap } from 'rxjs';
import { NgSelectComponent } from '@ng-select/ng-select';
import { CreateReturnFacade } from './create-return.facade';

@Component({
    selector: 'app-create-return',
    templateUrl: './create-return.component.html',
    styleUrls: ['./create-return.component.scss'],
    providers: [CreateReturnFacade],
})
export class CreateReturnComponent implements OnInit {
    @ViewChild('Product') ngSelectProductComponent: NgSelectComponent;
    @ViewChild('Promotion') ngSelectPromotionComponent: NgSelectComponent;
    subscription: Subscription[] = [];
    statusList = [
        {
            value: 1,
            name: 'Chờ duyệt',
        },
        {
            value: 2,
            name: 'Đã duyệt',
        },
    ];
    products$: Observable<any[]>;
    totalPrice$: Observable<number>;
    totalDiscountProduct$: Observable<number>;
    tradeDiscount$: Observable<number>;
    tradeDiscount: number;
    textMoney: string;

    // TODO : add search product, add product to products$, both

    constructor(
        private dialog: MatDialog,
        private facade: CreateReturnFacade,
        private returnFormService: ReturnFormService,
    ) {
        this.totalPrice$ = this.facade.totalPrice$.pipe(
            tap((_) => {
                this.calculateTotalPay();
            }),
        );
        this.totalDiscountProduct$ = this.facade.totalDiscountProduct$.pipe(
            tap((_) => {
                this.calculateTotalPay();
            }),
        );
        this.tradeDiscount$ = this.facade.tradeDiscount$.pipe(
            tap((_) => {
                this.calculateTotalPay();
            }),
        );
    }

    ngOnInit(): void {
        this.products$ = this.returnFormService.getAllProducts();
    }
    ngOnDestroy() {
        this.subscription.forEach((sub) => sub.unsubscribe());
    }
    submitForms(): void {
        this.returnFormService.submitForms();
    }

    handleChangeSelect(event: Product): void {
        if (event) {
            this.facade.addProductsToTable([event]);
        }
        this.ngSelectProductComponent.handleClearClick();
    }
    handlePromotionChangeSelect(event: any): void {
        if (event) {
            this.facade.addPromotionProductsToTable([event]);
        }
        this.ngSelectPromotionComponent.handleClearClick();
    }
    stopPropagation(e: any) {
        e.stopPropagation();
    }
    openDialogProduct(type: string) {
        const dialogRef = this.dialog
            .open(ProductListComponent, {
                maxWidth: '100vw',
                maxHeight: '100vh',
                height: '100%',
                width: '100%',
                panelClass: 'full-screen-modal',
            })
            .afterClosed()
            .subscribe((data: Product[]) => {
                if (type === 'products') {
                    this.facade.addProductsToTable(data);
                } else {
                    this.facade.addPromotionProductsToTable(data);
                }
            });
    }
    calculateTotalPay() {
        const ins = new readMoney(0);
        this.textMoney = ins.doc(
            (this.facade.getTotalPrice || 0) -
                (this.facade.getTotalDiscountProduct || 0) -
                (this.facade.getTradeDiscount || 0),
        );
    }
    updateTradeDiscount() {
        this.facade.updateTradeDiscount(this.tradeDiscount);
    }
}
