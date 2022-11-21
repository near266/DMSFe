import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from 'src/app/features/product/models/product';
import { ProductReturn } from '../../models/product';

@Injectable()
export class CreateReturnFacade {
    private filteredProducts: BehaviorSubject<ProductReturn[]> = new BehaviorSubject<ProductReturn[]>([]);
    filteredProducts$: Observable<ProductReturn[]> = this.filteredProducts.asObservable();
    private filteredPromotionProducts: BehaviorSubject<ProductReturn[]> = new BehaviorSubject<ProductReturn[]>([]);
    private tradeDiscount: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    private returnsQuantity: BehaviorSubject<number> = new BehaviorSubject(0);
    private totalPrice: BehaviorSubject<number> = new BehaviorSubject(0);
    private totalDiscountProduct: BehaviorSubject<number> = new BehaviorSubject(0);
    filteredPromotionProducts$: Observable<ProductReturn[]> = this.filteredPromotionProducts.asObservable();
    returnsQuantity$ = this.returnsQuantity.asObservable();
    tradeDiscount$ = this.tradeDiscount.asObservable();
    totalPrice$: Observable<number> = this.totalPrice.asObservable();
    totalDiscountProduct$ = this.totalDiscountProduct.asObservable();
    constructor() {}

    get getFilteredProducts() {
        return this.filteredProducts.getValue();
    }
    get getFilteredPromotionProducts() {
        return this.filteredPromotionProducts.getValue();
    }
    get getReturnsQuantity() {
        return this.returnsQuantity.getValue();
    }
    get getTotalPrice() {
        return this.totalPrice.getValue();
    }
    get getTotalDiscountProduct() {
        return this.totalDiscountProduct.getValue();
    }
    get getTradeDiscount() {
        return this.tradeDiscount.getValue();
    }

    // Products
    addProductsToTable(products: Product[]) {
        this.filteredProducts.next(this.filteredProducts.getValue().concat(this.filterProduct(products)));
    }
    removeProductFromTable(index: number) {
        const products = this.filteredProducts.getValue();
        products.splice(index, 1);
        this.filteredProducts.next(products);
        this.updateTotalPrice();
        this.updateReturnQuantityInTable();
        this.updateTotalDiscountProduct();
    }

    updateReturnQuantityInTable() {
        if (this.getFilteredProducts.length) {
            this.returnsQuantity.next(
                this.getFilteredProducts.reduce((acc, cur) => acc + (cur.returnsQuantity || 0), 0),
            );
        } else {
            this.returnsQuantity.next(0);
        }
    }
    updateTotalPrice() {
        if (this.getFilteredProducts.length) {
            this.totalPrice.next(this.getFilteredProducts.reduce((acc, cur) => acc + (cur.totalPrice || 0), 0));
        } else {
            this.totalPrice.next(0);
        }
    }
    updateTradeDiscount(tradeDiscount: number) {
        this.tradeDiscount.next(tradeDiscount);
    }

    updateTotalDiscountProduct() {
        if (this.getFilteredProducts.length) {
            this.totalDiscountProduct.next(this.getFilteredProducts.reduce((acc, cur) => acc + (cur.discount || 0), 0));
        } else {
            this.totalDiscountProduct.next(0);
        }
    }

    //Promotion Products
    addPromotionProductsToTable(products: Product[]) {
        this.filteredPromotionProducts.next(
            this.filteredPromotionProducts.getValue().concat(this.filterPromotionProduct(products)),
        );
    }
    removePromotionProductFromTable(index: number) {
        const products = this.filteredPromotionProducts.getValue();
        products.splice(index, 1);
        this.filteredPromotionProducts.next(products);
    }

    //format product to productReturn
    private filterProduct(products: Product[]): ProductReturn[] {
        return products.map((item: Product) => {
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
            } as ProductReturn;
        });
    }
    private filterPromotionProduct(products: Product[]): ProductReturn[] {
        return products.map((item: Product) => {
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
                type: 2,
                salesQuantity: 0,
                exportQuantity: 0,
                returnsQuantity: 0,
            } as ProductReturn;
        });
    }
}
