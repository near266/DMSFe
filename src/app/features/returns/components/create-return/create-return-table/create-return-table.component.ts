import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { Unit } from 'src/app/features/product/models/product';
import { ProductDialogService } from 'src/app/features/product/services/product-dialog.service';
import { ReturnFormService } from '../../../services/return-form.service';
import { ReturnsService } from '../../../services/returns.service';

@Component({
    selector: 'app-create-return-table',
    templateUrl: './create-return-table.component.html',
    styleUrls: ['./create-return-table.component.scss'],
})
export class CreateReturnTableComponent implements OnInit {
    productsInput: any;
    unitOptions: { value: string | undefined; label: string | undefined }[];
    warehouseOptions: { value: string | undefined; label: string | undefined }[];
    selectedWarehouse: any;
    quantity: number;
    products: any[];
    form: FormGroup;
    selectedUnit: any;
    percentDiscount: string;
    productQuantitySum: number;
    constructor(
        private returnFormService: ReturnFormService,
        private formBuilder: FormBuilder,
        private snackbarService: SnackbarService,
        private productDialogService: ProductDialogService,
    ) {}
    stopPropagation(e: any) {
        e.stopPropagation();
    }

    ngOnInit(): void {
        // calculate sum of product quantity
        this.returnFormService.products$.subscribe((data) => {
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
                    type: 1,
                    salesQuantity: 0,
                    exportQuantity: 0,
                    returnsQuantity: 0,
                };
            });

            this.productsInput = res;
            console.log(res);
        });
        this.productDialogService.getAllUnits().subscribe((data) => {
            this.unitOptions = data;
        });
        this.productDialogService.getAllWarehouses().subscribe((data) => {
            this.warehouseOptions = data;
        });
        this.returnFormService.submitProductForm$.subscribe((data) => {
            if (data && this.productsInput?.length && this.checkValidListProducts()) {
                const requiredFields = this.productsInput.map((item: any) => {
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
                    totalAmount: this.calculateTotalPrice(),
                    totalDiscount: this.calculateDiscountAmount(),
                    totalDiscountProduct: 0,
                    totalOfVAT: 0,
                    totalPayment: this.calculateTotalPrice() - this.calculateDiscountAmount(),
                });
                this.returnFormService.totalPrice$.next(0);
                this.returnFormService.discountAmount$.next(0);
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
        });
    }
    ngDoCheck(): void {
        if (this.productsInput?.length) {
            this.productQuantitySum = this.productsInput.reduce(
                (acc: number, curr: any) => acc + curr.returnsQuantity,
                0,
            );
            this.calculateTotalPrice();
            this.calculateDiscountAmount();
            // update product totalPrice in productsInput
        }
    }
    calculateTotalPrice(): number {
        //calculate total price of all products in productsInput by the sum of totalPrice of each product
        let totalPrice = 0;
        this.productsInput.forEach((item: any) => {
            totalPrice += item.totalPrice;
        });
        this.returnFormService.totalPrice$.next(totalPrice);
        return totalPrice;
    }
    calculateDiscountAmount(): number {
        let discountAmount = 0;
        this.productsInput.forEach((item: any) => {
            discountAmount += item.discount;
        });
        this.returnFormService.discountAmount$.next(discountAmount);
        return discountAmount;
    }
    updateItemTotalPrice(item: any) {
        item.totalPrice = item.returnsQuantity * item.unitPrice;
        item.salesQuantity = item.returnsQuantity;
        item.quantity = item.returnsQuantity;
        this.updateDiscountRate(item);
    }
    updateDiscountRate(item: any) {
        if (item.discount && item.totalPrice) {
            item.discountRate = item.discount / item.totalPrice;
        } else {
            item.discountRate = 0;
        }
    }
    checkValidListProducts(): boolean {
        let isValid = true;
        this.productsInput.forEach((item: any) => {
            if (item.salesQuantity <= 0 || item.warehouseId === null || item.unitId === null) {
                isValid = false;
            }
        });
        return isValid;
    }

    // addProduct(formValue: any) {
    //     const product = this.formBuilder.group({

    //         productId: [formValue.product.sku],
    //         productName: [formValue.product.productName],
    //         unitId: [formValue.unit.unitName],
    //         warehouseId: [item.warehouse?.warehouseName],
    //         unitPrice: [''],
    //         quantity: [0],
    //         totalPrice: [0],
    //         discount: [0],
    //         discountRate: [0],
    //         note: [''],
    //         type: [0],
    //     });
    // }
}
