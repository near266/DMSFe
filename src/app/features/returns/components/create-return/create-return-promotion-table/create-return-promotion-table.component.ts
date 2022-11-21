import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { ProductDialogService } from 'src/app/features/product/services/product-dialog.service';
import { ProductReturn } from '../../../models/product';
import { ReturnFormService } from '../../../services/return-form.service';
import { CreateReturnFacade } from '../create-return.facade';

@Component({
    selector: 'app-create-return-promotion-table',
    templateUrl: './create-return-promotion-table.component.html',
    styleUrls: ['./create-return-promotion-table.component.scss'],
})
export class CreateReturnPromotionTableComponent implements OnInit {
    productsInput$: Observable<ProductReturn[]>;
    unitOptions: any[] = [];
    warehouseOptions: any[] = [];
    subscription: Subscription[] = [];
    constructor(
        private returnFormService: ReturnFormService,
        private productDialogService: ProductDialogService,
        private snackbar: SnackbarService,
        private facade: CreateReturnFacade,
    ) {
        this.productsInput$ = this.facade.filteredPromotionProducts$;
    }
    checkValidListProducts(): boolean {
        if (!this.facade.getFilteredPromotionProducts?.length) {
            return true;
        }
        let isValid = true;
        this.facade.getFilteredPromotionProducts.forEach((item: any) => {
            if (
                item.exportQuantity <= 0 ||
                item.returnsQuantity <= 0 ||
                item.warehouseId === null ||
                item.unitId === null
            ) {
                isValid = false;
            }
        });
        return isValid;
    }
    ngOnInit(): void {
        this.subscription.push(
            this.productDialogService.getAllUnits().subscribe((data) => {
                this.unitOptions = data;
            }),
            //same for warehouseOptions
            this.productDialogService.getAllWarehouses().subscribe((data) => {
                this.warehouseOptions = data;
            }),
            this.returnFormService.submitPromotionForm$.subscribe((data) => {
                if (data && this.checkValidListProducts()) {
                    const requiredFields = this.facade.getFilteredPromotionProducts?.length
                        ? this.facade.getFilteredPromotionProducts.map((item: any) => {
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
                          })
                        : [];
                    this.returnFormService.submitInfoForm$.next({
                        listProduct: data,
                        listPromotionProduct: requiredFields?.length ? requiredFields : [],
                    });
                } else {
                    this.snackbar.openSnackbar(
                        'Sản phẩm khuyến mãi không hợp lệ',
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
    }
    removeProduct(index: number) {
        this.facade.removePromotionProductFromTable(index);
    }
}
