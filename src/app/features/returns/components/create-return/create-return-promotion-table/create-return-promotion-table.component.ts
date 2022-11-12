import { Component, OnInit } from '@angular/core';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { ProductDialogService } from 'src/app/features/product/services/product-dialog.service';
import { ReturnFormService } from '../../../services/return-form.service';

@Component({
    selector: 'app-create-return-promotion-table',
    templateUrl: './create-return-promotion-table.component.html',
    styleUrls: ['./create-return-promotion-table.component.scss'],
})
export class CreateReturnPromotionTableComponent implements OnInit {
    productQuantitySum: number;
    productsInput: any[];
    unitOptions: any[] = [];
    warehouseOptions: any[] = [];
    constructor(
        private returnFormService: ReturnFormService,
        private productDialogService: ProductDialogService,
        private snackbar: SnackbarService,
    ) {}
    checkValidListProducts(): boolean {
        if (!this.productsInput?.length) {
            return true;
        }
        let isValid = true;
        this.productsInput.forEach((item: any) => {
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
        this.productDialogService.getAllUnits().subscribe((data) => {
            this.unitOptions = data;
        });
        //same for warehouseOptions
        this.productDialogService.getAllWarehouses().subscribe((data) => {
            this.warehouseOptions = data;
        });
        this.returnFormService.submitPromotionForm$.subscribe((data) => {
            if (data && this.checkValidListProducts()) {
                const requiredFields = this.productsInput?.length
                    ? this.productsInput.map((item: any) => {
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
                // this.returnFormService.submitInfoForm$.next({
                //     listProduct: requiredFields,
                //     totalAmount: this.calculateTotalPrice(),
                //     totalDiscount: this.calculateDiscountAmount(),
                //     totalDiscountProduct: 0,
                //     totalOfVAT: 0,
                //     totalPayment: this.calculateTotalPrice() - this.calculateDiscountAmount(),
                // });
                // this.returnFormService.totalPrice$.next(0);
                // this.returnFormService.discountAmount$.next(0);
            } else {
                this.snackbar.openSnackbar('Sản phẩm khuyến mãi không hợp lệ', 2000, 'Đóng', 'center', 'top', false);
            }
        });

        this.returnFormService.promotionProducts$.subscribe((data) => {
            const res = data.map((item: any) => {
                return {
                    vat: item?.vat,
                    sku: item.sku,
                    productName: item.productName,
                    productId: item.id,
                    warehouseId: item.warehouse?.id || null,
                    unitId: item.retailUnit?.id || null,
                    quantity: 0,
                    discount: 0,
                    unitPrice: item.retailPrice,
                    totalPrice: 0,
                    discountRate: 0,
                    note: null,
                    type: 2, // Promotion
                    salesQuantity: 0,
                    exportQuantity: 0,
                    returnsQuantity: 0,
                };
            });
            this.productsInput = res;
        });
    }
}
