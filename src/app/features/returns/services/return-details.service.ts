import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, map, Observable, Subject, tap } from 'rxjs';
import { ReturnApiService } from '../apis/return-api.service';
import { ComponentMode } from '../models/componentMode';
import { Return } from '../models/return';

@Injectable({
    providedIn: 'root',
})
export class ReturnDetailsService {
    updateReturnProducts$: Subject<boolean> = new Subject<boolean>();
    updateReturnInfo$: Subject<boolean> = new Subject<boolean>();
    returnDetails$: BehaviorSubject<Return> = new BehaviorSubject<Return>({});
    returnListProducts$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
    initialListProduct: any[] = [];
    currentMode$: BehaviorSubject<ComponentMode> = new BehaviorSubject<ComponentMode>(ComponentMode.VIEW);
    totalPrice$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    discountAmount$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

    constructor(private returnApiService: ReturnApiService) {}
    getReturnById(id: string | null) {
        return this.returnApiService.getReturnById(id).pipe(
            tap((data) => {
                data.groupId = data.group?.id;
                data.orderEmployeeId = data.orderEmployee?.id;
                data.customerCode = {
                    value: data.customer?.id || null,
                };
                this.returnDetails$.next(data);
                this.returnListProducts$.next(data.listProduct);
                this.initialListProduct = JSON.parse(JSON.stringify(data.listProduct));
            }),
        );
    }
    compareReturnListProductsWithInitialListProductAndUpdate() {
        const currentListProduct = this.returnListProducts$.getValue();
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
        console.log(this.initialListProduct);
        this.initialListProduct.forEach((product) => {
            const duplicated = currentListProduct.find((item) => item.product.id === product.product.id);
            console.log(duplicated);
            if (!duplicated) {
                removeListProduct.push(product);
            }
            return product;
        });
        const list = [];
        if (updateListProduct.length > 0) {
            list.push(this.returnApiService.updateProductToReturn(this.formatProductList(updateListProduct)));
        }
        if (addListProduct.length > 0) {
            list.push(this.returnApiService.addProductToReturn(this.formatProductList(addListProduct)));
        }
        if (removeListProduct.length > 0) {
            list.push(...this.deleteProductFromReturn(this.formatDeleteProductList(removeListProduct)));
        }
        console.log(list);
        return forkJoin(list).pipe(map((response: any) => response));
    }

    deleteProductFromReturn(deleteList: any[]) {
        return deleteList.map((product) => {
            return this.returnApiService.deleteProductFromReturn(product);
        });
    }

    formatProductList(productList: any[]) {
        return productList.map((product) => {
            return {
                returnsId: this.returnDetails$.getValue().id,
                productId: product.product.id,
                quantity: product.quantity,
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
        return productList.map((product) => {
            return {
                productId: product.product.id,
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
