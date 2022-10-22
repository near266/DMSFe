import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class FormatService {
    constructor() {}
    // format để lôi warehouse.id thành wareHouseId, unit.id thành unitId
    formatUnitIdAndWareHouseId(list: any) {
        list.forEach((product: any) => {
            product.warehouseId = product.warehouse?.id;
            product.unitId = product.unit?.id;
        });
        return list;
    }

    formatProductToSendAPI(list: any, saleRecieptId: any) {
        list = list.map((product: any) => {
            return {
                saleRecieptId: saleRecieptId,
                productId: product?.product?.id,
                unitId: product.unitId,
                warehouseId: product.warehouseId,
                unitPrice: product.unitPrice,
                quantity: product.quantity,
                totalPrice: product.totalPrice,
                discount: product.discount,
                discountRate: product.discountRate,
                note: product.note,
                type: product.type,
            };
        });
        return list;
    }

    formatProductAddToSendAPI(list: any, saleRecieptId: any, type: any) {
        list = list.map((product: any) => {
            return {
                saleRecieptId: saleRecieptId,
                productId: product?.product?.id,
                unitId: product.unitId,
                warehouseId: product.warehouseId,
                unitPrice: product.unitPrice,
                quantity: product.quantity,
                totalPrice: product.totalPrice,
                discount: product.discount,
                discountRate: product.discountRate,
                note: product.note,
                type: type,
            };
        });
        return list;
    }

    formatProductFromCloseDialogAdd(listProdAdd: any, list: any) {
        listProdAdd = listProdAdd.map((product: any) => {
            return {
                product: {
                    id: product.id,
                    sku: product.sku,
                    productName: product.productName,
                    retailPrice: product.retailPrice,
                    price: product.price,
                    vat: product.vat,
                    warehouseId: product?.warehouse?.id,
                    retailUnit: product.retailUnit,
                    wholeSaleUnit: product.wholeSaleUnit,
                },
                unitId: product.retailUnit?.id, // mặc định chọn đvt lẻ
                warehouseId: product?.warehouse?.id,
                unitPrice: product.retailPrice, // mặc định đơn giá là giá lẻ
                quantity: 0,
                totalPrice: 0,
                discount: 0,
                discountRate: 0,
                note: null,
                type: product.type,
            };
        });
        // filter to remove product available
        let listAvailbleIds = list.map((product: any) => {
            return product?.product?.id;
        });
        listProdAdd = listProdAdd.filter((product: any) => {
            return !listAvailbleIds.includes(product.product?.id);
        });
        return listProdAdd;
    }
}
