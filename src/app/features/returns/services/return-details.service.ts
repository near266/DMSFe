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
    tradeDiscount$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    promotionListProduct$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
    initialListPromotionProduct: any[] = [];

    constructor(private returnApiService: ReturnApiService) {}
    getReturnById(id: string | null) {
        return this.returnApiService.getReturnById(id).pipe(
            tap((data) => {
                data.groupId = data.group?.id;
                data.saleRecieptId = data.saleReciept?.id || null;
                data.orderEmployeeId = data.orderEmployee?.id;
                data.orderEmployeeName = data.orderEmployee?.employeeName || null;
                data.groupName = data.group?.name || null;
                data.customerId = data.customer?.id || null;
                data.address = data.customer?.address || data.address;
                data.orderEmployeePhone = data.orderEmployee?.phone;
                data.saleCode = data.saleReciept?.saleCode;
                data.phone = data.customer?.phone || data.phone;
                data.customerCode = data.customer?.customerCode;
                data.customerName = data.customer?.customerName || data?.customerName;
                this.returnDetails$.next(data);
                this.returnListProducts$.next(
                    data.listProduct.map((product: any) => {
                        if (product.unit) {
                            return product;
                        }
                        return {
                            ...product,
                            unit: { id: null, unitCode: null, unitName: '-' },
                        };
                    }),
                );
                this.tradeDiscount$.next(data.tradeDiscount);
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
            const duplicated = this.initialListProduct.find((item) => item.index === product.index);
            if (duplicated) {
                updateListProduct.push(product);
            } else {
                addListProduct.push(product);
            }
            return product;
        });
        promotionListProduct.forEach((product) => {
            const duplicated = this.initialListPromotionProduct.find((item) => item.index === product.index);
            if (duplicated) {
                updateListProduct.push(product);
            } else {
                addListProduct.push(product);
            }
            return product;
        });
        this.initialListProduct.forEach((product) => {
            const duplicated = currentListProduct.find((item) => item.index === product.index);
            if (!duplicated) {
                removeListProduct.push(product);
            }
            return product;
        });
        this.initialListPromotionProduct.forEach((product) => {
            const duplicated = promotionListProduct.find((item) => item.index === product.index);
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
                index: product.index || 0,
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
        const res = productList.map((product) => {
            return {
                index: product.index || 0,
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
            const res = item.returnsQuantity <= 0 || !item.warehouse?.id || !item.unit?.id;
            console.log(res);
            return res;
        });
        return invalidListProducts.length === 0;
    }
}
