import { Component, DoCheck, OnInit } from '@angular/core';
import { ProductDialogService } from 'src/app/features/product/services/product-dialog.service';
import { ReturnDetailsService } from 'src/app/features/returns/services/return-details.service';
import * as _ from 'lodash';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { SelectOption } from 'src/app/core/model/Select';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-detail-return-table-edit',
    templateUrl: './detail-return-table-edit.component.html',
    styleUrls: ['./detail-return-table-edit.component.scss'],
})
export class DetailReturnTableEditComponent implements OnInit, DoCheck {
    productsInput: any[] = [];
    productQuantitySum: number;
    warehouseOptions: SelectOption[];
    unitOptions: SelectOption[];
    subscriptions: Subscription[] = [];
    constructor(
        private returnDetailsService: ReturnDetailsService,
        private productDialogService: ProductDialogService,
        private snackbarService: SnackbarService,
    ) {
        this.checkAndUpdate = _.debounce(this.checkAndUpdate, 1);
    }
    checkAndUpdate() {
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
    ngOnInit(): void {
        this.subscriptions.push(
            this.returnDetailsService.updateReturnProducts$.subscribe((res) => {
                this.returnDetailsService.returnListProducts$.next(this.productsInput);
                if (res && this.returnDetailsService.checkValidListProducts()) {
                    this.returnDetailsService.compareReturnListProductsWithInitialListProductAndUpdate().subscribe({
                        next: (res) => {
                            this.returnDetailsService.updateReturnInfo$.next({
                                totalPayment: this.returnDetailsService.totalPrice$.getValue(),
                                discountAmount: this.returnDetailsService.discountAmount$.getValue(),
                                tradeDiscount: this.returnDetailsService.tradeDiscount$.getValue(),
                            });
                        },
                        error: (err) => {
                            this.snackbarService.openSnackbar('Có lỗi xảy ra', 2000, 'Đóng', 'center', 'top', false);
                        },
                    });
                } else {
                    this.snackbarService.openSnackbar('Sản phẩm không hợp lệ', 2000, 'Đóng', 'center', 'top', false);
                }
            }),
        );
        this.subscriptions.push(
            this.productDialogService.getAllUnits().subscribe((data) => {
                this.unitOptions = data;
            }),

            this.productDialogService.getAllWarehouses().subscribe((data) => {
                this.warehouseOptions = data;
            }),
        );
        this.subscriptions.push(
            this.returnDetailsService.returnListProducts$.subscribe((_) => {
                this.productsInput = _;
                this.returnDetailsService.totalPrice$.next(this.getSumOfTotalPrice());
                this.returnDetailsService.discountAmount$.next(this.getSumOfDiscount());
                this.productQuantitySum = this.productsInput.reduce((a, b) => +a + +b.returnsQuantity, 0);
            }),
        );
    }
    ngDoCheck(): void {
        this.checkAndUpdate();
    }
    calculateTotalPrice(): number {
        //calculate total price of all products in productsInput by the sum of totalPrice of each product
        let totalPrice = 0;
        this.productsInput.forEach((item: any) => {
            totalPrice += item.totalPrice;
        });
        this.returnDetailsService.totalPrice$.next(totalPrice);
        return totalPrice;
    }
    calculateDiscountAmount(): number {
        let discountAmount = 0;
        this.productsInput.forEach((item: any) => {
            discountAmount += item.discount;
        });
        this.returnDetailsService.discountAmount$.next(discountAmount);
        return discountAmount;
    }
    getSumOfTotalPrice() {
        return this.productsInput.reduce((a, b) => +a + +b.totalPrice, 0);
    }
    getSumOfDiscount() {
        return this.productsInput.reduce((a, b) => +a + +b.discount, 0);
    }
    updateItemTotalPrice(item: any) {
        item.totalPrice = item.returnsQuantity * item.unitPrice;
        this.updateDiscountRate(item);
    }
    updateDiscountRate(item: any) {
        if (item.discount && item.totalPrice) {
            item.discountRate = (item.discount / item.totalPrice) * 100;
        } else {
            item.discountRate = 0;
        }
    }
    removeProductFromReturn(id: string) {
        //find id in listProduct.product and remove
        this.productsInput = this.productsInput.filter((item) => item.index !== id);
        this.returnDetailsService.returnListProducts$.next(this.productsInput);
    }
    ngOnDestroy() {
        this.subscriptions.forEach((sub) => sub.unsubscribe());
    }
}
