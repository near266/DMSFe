import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { combineLatest, Observable, startWith, Subscription } from 'rxjs';
import { SelectOption } from 'src/app/core/model/Select';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { ProductDialogService } from 'src/app/features/product/services/product-dialog.service';
import { ProductReturn } from '../../../models/product';
import { ReturnFormService } from '../../../services/return-form.service';
import { CreateReturnFacade } from '../create-return.facade';

@Component({
    selector: 'app-create-return-table',
    templateUrl: './create-return-table.component.html',
    styleUrls: ['./create-return-table.component.scss'],
})
export class CreateReturnTableComponent implements OnInit {
    subscription: Subscription[] = [];
    vm$: Observable<{
        filteredProducts: ProductReturn[];
        returnsQuantity: number;
        units: SelectOption[];
        warehouses: SelectOption[];
    }>;
    constructor(
        private returnFormService: ReturnFormService,
        private snackbarService: SnackbarService,
        private facade: CreateReturnFacade,
        private productDialogService: ProductDialogService,
    ) {
        this.vm$ = combineLatest(
            [
                facade.filteredProducts$,
                facade.returnsQuantity$,
                productDialogService.getAllUnits().pipe(startWith([])),
                productDialogService.getAllWarehouses().pipe(startWith([])),
            ],
            (filteredProducts, returnsQuantity, units, warehouses) => ({
                filteredProducts,
                returnsQuantity,
                units,
                warehouses,
            }),
        );
    }
    stopPropagation(e: any) {
        e.stopPropagation();
    }
    ngOnInit(): void {
        // calculate sum of product quantity
        this.subscription.push(
            this.returnFormService.submitProductForm$.subscribe((data) => {
                if (data && this.facade.getFilteredProducts.length && this.checkValidListProducts()) {
                    const requiredFields = this.facade.getFilteredProducts.map((item: ProductReturn) => {
                        return {
                            productId: item.productId,
                            unitId: item.unitId,
                            warehouseId: item.warehouseId,
                            unitPrice: item.unitPrice,
                            quantity: item.quantity,
                            totalPrice: item.totalPrice,
                            discount: item.discount,
                            discountRate: item.discountRate,
                            note: item.note,
                            type: item.type,
                            salesQuantity: item.salesQuantity,
                            exportQuantity: item.exportQuantity,
                            returnsQuantity: item.returnsQuantity,
                        };
                    });
                    this.returnFormService.submitPromotionForm$.next({
                        listProduct: requiredFields,
                        tradeDiscount: this.facade.getTradeDiscount,
                        totalAmount: this.facade.getTotalPrice,
                        totalDiscountProduct: this.facade.getTotalDiscountProduct,
                        totalOfVAT: 0,
                        totalPayment:
                            this.facade.getTotalPrice -
                            this.facade.getTotalDiscountProduct -
                            this.facade.getTradeDiscount,
                    });
                } else {
                    this.snackbarService.openSnackbar(
                        'Dữ liệu sản phẩm không hợp lệ',
                        2000,
                        'Đóng',
                        'center',
                        'top',
                        false,
                    );
                }
            }),
        );
    }
    ngOnDestroy() {
        this.subscription.forEach((sub) => sub.unsubscribe());
        this.returnFormService.products$.next([]);
        this.returnFormService.promotionProducts$.next([]);
    }
    calculateDiscountAmount(): number {
        let discountAmount = 0;
        this.facade.getFilteredProducts.forEach((item: any) => {
            discountAmount += item.discount;
        });
        this.returnFormService.discountAmount$.next(discountAmount);
        return discountAmount;
    }
    updateItemTotalPrice(item: ProductReturn) {
        item.totalPrice = (item?.returnsQuantity || 0) * (item?.unitPrice || 0);
        this.updateTableDetails();
        this.updateDiscountItemRate(item);
    }

    private updateTableDetails() {
        this.facade.updateTotalPrice();
        this.facade.updateTotalDiscountProduct();
        this.facade.updateReturnQuantityInTable();
    }

    updateDiscountItemRate(item: ProductReturn) {
        if (item.discount && item.totalPrice) {
            item.discountRate = item.discount / item.totalPrice;
        } else {
            item.discountRate = 0;
        }
    }
    checkValidListProducts(): boolean {
        let isValid = true;
        this.facade.getFilteredProducts.forEach((item: any) => {
            if (item.salesQuantity <= 0) {
                isValid = false;
            }
        });
        return isValid;
    }
    removeProduct(index: number) {
        this.facade.removeProductFromTable(index);
    }
}
