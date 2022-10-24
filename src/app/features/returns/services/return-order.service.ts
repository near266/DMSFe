import { OrderEmployee } from './../../../core/model/PurchaseOrder';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ReturnOrderService {
    returnInfo$: BehaviorSubject<any> = new BehaviorSubject<any>({});
    returnProductList$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
    returnPromotionList$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
    totalPrice$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    discountAmount$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

    submitFormInfo$: Subject<boolean> = new Subject<boolean>();
    submitFormProductList$: Subject<any[]> = new Subject<any[]>();
    submitFormPromotionList$: Subject<any> = new Subject<any>();

    constructor() {}
    formatSubmitListProduct(list: any[]) {
        return list.map((item) => {
            return {
                productId: item?.productId || null,
                unitId: item?.unitId || null,
                warehouseId: item?.warehouseId || null,
                unitPrice: item?.unitPrice || 0,
                quantity: item?.quantity || 0,
                totalPrice: item?.totalPrice || 0,
                discount: item?.discount || 0,
                discountRate: item?.discountRate || 0,
                returnsQuantity: item?.returnsQuantity || 0,
                salesQuantity: item?.salesQuantity || 0,
                exportQuantity: 0,
                type: item?.type || 1,
                note: item?.note || null,
            };
        });
    }
    formatListProduct(listProduct: any[]) {
        console.log(listProduct);
        return listProduct.map((item) => {
            return {
                product: item.product,
                unit: item.unit,
                warehouse: item.warehouse,
                productId: item.product.id,
                unitId: item?.unit?.id || null,
                warehouseId: item?.warehouse?.id || null,
                unitPrice: item?.unitPrice || 0,
                quantity: item?.quantity || 0,
                totalPrice: item?.totalPrice || 0,
                discount: item?.discount || 0,
                discountRate: item?.discountRate / 100 || 0,
                returnsQuantity: item?.quantity || 0,
                salesQuantity: item?.quantity || 0,
                exportQuantity: 0,
                vat: item?.product?.vat || 0,
                type: item?.type || 1,
                note: item?.note || null,
            };
        });
    }
    formatInfo(info: any) {
        console.log(info);
        return {
            saleCode: info?.saleCode || null,
            saleRecieptId: info?.id || null,
            customerId: info.customer?.id || null,
            customerName: info.customer?.customerName || null,
            groupId: info.group?.id,
            orderEmployeeId: info.orderEmployee?.id || null,
            orderDate: info?.orderDate || null,
            phone: info?.phone || null,
            address: info?.address || null,
            description: 'Trả hàng theo phiếu đặt hàng số [' + info?.saleCode + ']',
            customerCode: info.customer?.customerCode || null,
            orderEmployeeName: info.orderEmployee?.employeeName || null,
            groupName: info.group?.name,
        };
    }
}
