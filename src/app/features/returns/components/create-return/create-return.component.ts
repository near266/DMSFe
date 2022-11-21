import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgSelectComponent } from '@ng-select/ng-select';
import { Observable, Subscription, tap } from 'rxjs';
import { readMoney } from 'src/app/core/shared/utils/readMoney';
import { ProductListComponent } from 'src/app/features/orders-mgm/components/product-list/product-list.component';
import { Product } from '../../../product/models/product';
import { ReturnFormService } from '../../services/return-form.service';
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
