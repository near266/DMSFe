import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, map, Observable, of, Subject, tap } from 'rxjs';
import { ReturnApiService } from '../apis/return-api.service';
import { ComponentMode } from '../models/componentMode';
import { Return } from '../models/return';

@Injectable({
    providedIn: 'root',
})
export class ReturnDetailsService {
    updateReturnProducts$: Subject<any> = new Subject<any>();
    updatePromotionProducst$: Subject<any> = new Subject<any>();
    updateReturnInfo$: Subject<any> = new Subject<any>();
    returnDetails$: BehaviorSubject<Return> = new BehaviorSubject<Return>({});
    returnListProducts$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
    initialListProduct: any[] = [];
    currentMode$: BehaviorSubject<ComponentMode> = new BehaviorSubject<ComponentMode>(ComponentMode.VIEW);
    totalPrice$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    discountAmount$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    promotionListProduct$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
    initialListPromotionProduct: any[] = [];

    constructor(private returnApiService: ReturnApiService) {}
    getReturnById(id: string | null) {
        return this.returnApiService.getReturnById(id).pipe(
            tap((data) => {
                console.log(data);
                data.groupId = data.group?.id;
                data.saleRecieptId = data.saleReciept?.id || null;
                data.orderEmployeeId = data.orderEmployee?.id;
                data.orderEmployeeName = data.orderEmployee?.employeeName || null;
                data.groupName = data.group?.name || null;
                data.customerId = data.customer?.id || null;
                data.orderEmployeePhone = data.orderEmployee?.phone;
                data.saleCode = data.saleReciept?.saleCode;
                data.customerCode = data.customer?.customerCode;
                this.returnDetails$.next(data);
                this.returnListProducts$.next(data.listProduct);
                this.promotionListProduct$.next(data.listPromotionProduct);
                this.initialListProduct = JSON.parse(JSON.stringify(data.listProduct));
                this.initialListPromotionProduct = JSON.parse(JSON.stringify(data.listPromotionProduct));
            }),
        );
    }
    compareReturnListProductsWithInitialListProductAndUpdate() {
        const currentListProduct = this.returnListProducts$.getValue();
        const promotionListProduct = this.promotionListProduct$.getValue();
        const updateListProduct: any[] = [];
        const addListProduct: any[] = [];
        const removeListProduct: any[] = [];
        currentListProduct.forEach((product) => {
            const duplicated = this.initialListProduct.find((item) => item.product.id === product.product.id);
            if (duplicated) {
                updateListProduct.push(product);
            } else {
                addListProduct.push(product);
            }
            return product;
        });
        promotionListProduct.forEach((product) => {
            const duplicated = this.initialListPromotionProduct.find((item) => item.product.id === product.product.id);
            if (duplicated) {
                updateListProduct.push(product);
            } else {
                addListProduct.push(product);
            }
            return product;
        });
        this.initialListProduct.forEach((product) => {
            const duplicated = currentListProduct.find((item) => item.product.id === product.product.id);
            if (!duplicated) {
                removeListProduct.push(product);
            }
            return product;
        });
        this.initialListPromotionProduct.forEach((product) => {
            const duplicated = promotionListProduct.find((item) => item.product.id === product.product.id);
            if (!duplicated) {
                removeListProduct.push(product);
            }
            return product;
        });
        const list = [];
        if (updateListProduct.length > 0) {
            console.log(this.formatProductList(updateListProduct));
            list.push(this.returnApiService.updateProductToReturn(this.formatProductList(updateListProduct)));
        }
        if (addListProduct.length > 0) {
            list.push(this.returnApiService.addProductToReturn(this.formatProductList(addListProduct)));
        }
        if (removeListProduct.length > 0) {
            list.push(...this.deleteProductFromReturn(this.formatDeleteProductList(removeListProduct)));
        }
        console.log(list);
        if (list.length) {
            return forkJoin(list).pipe(map((response: any) => response));
        } else {
            return of(true);
        }
    }

    deleteProductFromReturn(deleteList: any[]) {
        return deleteList.map((product) => {
            return this.returnApiService.deleteProductFromReturn(product);
        });
    }

    formatProductList(productList: any[]) {
        console.log(productList);
        return productList.map((product) => {
            return {
                returnsId: this.returnDetails$.getValue().id,
                productId: product.product.id,
                quantity: product.quantity,
                salesQuantity: product.salesQuantity,
                exportQuantity: product.exportQuantity,
                returnsQuantity: product.returnsQuantity,
                discount: product.discount,
                totalPrice: product.totalPrice,
                discountRate: product.discountRate,
                unitPrice: product.unitPrice,
                unitId: product.unit?.id || null,
                warehouseId: product.warehouse?.id || null,
                note: product.note || '',
                type: product.type,
            };
        });
    }
    formatDeleteProductList(productList: any[]) {
        console.log(productList);
        const res = productList.map((product) => {
            return {
                productId: product.product.id,
                type: product.type,
                unitId: product.unit?.id || null,
                warehouseId: product.warehouse?.id || null,
            };
        });
        return productList.map((product) => {
            return {
                listIdRemove: [...res],
                returnsId: this.returnDetails$.getValue().id,
            };
        });
    }
    checkValidListProducts() {
        const listProducts = this.returnListProducts$.getValue();
        const invalidListProducts = listProducts.filter((item) => {
            return item.quantity <= 0 || !item.warehouse?.id || !item.unit?.id;
        });
        return invalidListProducts.length === 0;
    }
}
