import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { ReturnOrderService } from 'src/app/features/returns/services/return-order.service';

@Component({
    selector: 'app-return-order-promotion',
    templateUrl: './return-order-promotion.component.html',
    styleUrls: ['./return-order-promotion.component.scss'],
})
export class ReturnOrderPromotionComponent implements OnInit {
    productsInput: any[] = [];
    warehouseOptions: { label?: string; value?: string }[] = [];
    unitOptions: { label?: string; value?: string }[] = [];
    constructor(private returnDetailsService: ReturnOrderService, private snackBarService: SnackbarService) {}

    ngOnInit(): void {
        this.returnDetailsService.returnPromotionList$.subscribe((_) => {
            this.productsInput = _;
        });
        this.returnDetailsService.submitFormProductList$.subscribe((_) => {
            if (this.checkAndSubmit()) {
                this.returnDetailsService.submitFormPromotionList$.next({
                    listProduct: _,
                    listPromotionProduct: this.returnDetailsService.formatSubmitListProduct(this.productsInput),
                });
            }
        });
    }
    removeProductFromReturn(id: string) {
        //find id in listProduct.product and remove
        this.productsInput = this.productsInput.filter((item) => item.product.id !== id);
        this.returnDetailsService.returnPromotionList$.next(this.productsInput);
    }
    checkReturnsQuantity(item: any) {
        if (item.returnsQuantity > item.quantity) {
            this.snackBarService.openSnackbar(
                'Số lượng trả về không được lớn hơn số lượng bán ra',
                2000,
                'Đóng',
                'center',
                'bottom',
                false,
            );
            item.returnsQuantity = 0;
        }
    }
    checkAndSubmit(): boolean {
        let check = true;
        if (!this.productsInput?.length) {
            this.snackBarService.openSnackbar('Dữ liệu trống', 2000, 'Đóng', 'center', 'bottom', false);
            return false;
        }
        console.log(this.productsInput.length);
        this.productsInput.forEach((item: any) => {
            if (!item.warehouseId || !this.productsInput?.length) {
                this.snackBarService.openSnackbar('Dữ liệu không hợp lệ', 2000, 'Đóng', 'center', 'bottom', false);
                check = false;
            }
        });
        return check;
    }
}
