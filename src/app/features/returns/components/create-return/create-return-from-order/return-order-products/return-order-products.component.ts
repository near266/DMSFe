import { ChangeDetectionStrategy, Component, DoCheck, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { ProductDialogService } from 'src/app/features/product/services/product-dialog.service';
import { ReturnOrderService } from 'src/app/features/returns/services/return-order.service';

@Component({
    selector: 'app-return-order-products',
    templateUrl: './return-order-products.component.html',
    styleUrls: ['./return-order-products.component.scss'],
})
export class ReturnOrderProductsComponent implements OnInit, DoCheck {
    productsInput: any[] = [];
    productQuantitySum: number;
    unitOptions: any[];
    warehouseOptions: any[];
    constructor(
        private returnDetailsService: ReturnOrderService,
        private productDialogService: ProductDialogService,
        private snackbarService: SnackbarService,
    ) {}

    ngOnInit(): void {
        this.productDialogService.getAllWarehouses().subscribe((data) => {
            this.warehouseOptions = data;
        });
        this.productDialogService.getAllUnits().subscribe((data) => {
            this.unitOptions = data;
        });
        this.returnDetailsService.submitFormInfo$.pipe().subscribe((_) => {
            if (this.checkAndSubmit()) {
                this.returnDetailsService.submitFormProductList$.next(
                    this.returnDetailsService.formatSubmitListProduct(this.productsInput),
                );
            }
        });
        this.returnDetailsService.returnProductList$.subscribe((_) => {
            this.productsInput = _;
            this.returnDetailsService.totalPrice$.next(this.getSumOfTotalPrice());
            this.returnDetailsService.discountAmount$.next(this.getSumOfDiscount());
            this.productQuantitySum = this.productsInput.reduce((a, b) => +a + +b.returnsQuantity, 0);
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
    checkAndSubmit(): boolean {
        let check = true;
        if (!this.productsInput?.length) {
            this.snackbarService.openSnackbar('Dữ liệu trống', 2000, 'Đóng', 'center', 'bottom', false);
            return false;
        }
        this.productsInput.forEach((item: any) => {
            if (!item.warehouseId || !this.productsInput?.length) {
                this.snackbarService.openSnackbar('Dữ liệu không hợp lệ', 2000, 'Đóng', 'center', 'bottom', false);
                check = false;
            }
        });
        return check;
    }
    updateItemTotalPrice(item: any) {
        if (item.returnsQuantity > item.salesQuantity) {
            this.snackbarService.openSnackbar(
                'Số lượng trả về không được lớn hơn số lượng bán',
                2000,
                'Đóng',
                'center',
                'bottom',
                false,
            );
            item.returnsQuantity = 0;
        }
        item.totalPrice = item.returnsQuantity * item.unitPrice;
        this.updateDiscountRate(item);
    }
    updateDiscountRate(item: any) {
        if (item.discount > item.totalPrice) {
            this.snackbarService.openSnackbar(
                'Giảm giá không được lớn hơn tổng tiền',
                2000,
                'Đóng',
                'center',
                'bottom',
                false,
            );
            item.discount = 0;
        }
        if (item.discountRate && item.totalPrice) {
            item.discount = item.discountRate * item.totalPrice;
        } else {
            item.discount = 0;
        }
    }
    getSumOfTotalPrice() {
        return this.productsInput.reduce((a, b) => +a + +b.totalPrice, 0);
    }
    getSumOfDiscount() {
        return this.productsInput.reduce((a, b) => +a + +b.discount, 0);
    }
    removeProductFromReturn(id: string) {
        //find id in listProduct.product and remove
        this.productsInput = this.productsInput.filter((item) => item.product.id !== id);
        this.returnDetailsService.returnProductList$.next(this.productsInput);
    }
}
