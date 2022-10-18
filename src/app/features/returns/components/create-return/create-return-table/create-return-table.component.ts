import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
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
                    ...item,
                    warehouseId: item.warehouse?.id || null,
                    retailUnitId: item.retailUnit?.id || null,
                    quantity: 0,
                    discount: 0,
                    unitPrice: item.retailPrice,
                    totalPrice: 0,
                    note: null,
                };
            });

            this.productsInput = res;
        });
        this.productDialogService.getAllUnits().subscribe((data) => {
            this.unitOptions = data;
        });
        this.productDialogService.getAllWarehouses().subscribe((data) => {
            this.warehouseOptions = data;
        });
    }
    ngDoCheck(): void {
        if (this.productsInput?.length) {
            this.productQuantitySum = this.productsInput.reduce((acc: number, curr: any) => acc + curr.quantity, 0);
            // update product totalPrice in productsInput
        }
    }
    updateItem(item: any) {
        item.totalPrice = item.quantity * item.unitPrice;
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
