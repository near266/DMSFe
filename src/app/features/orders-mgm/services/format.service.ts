import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class FormatService {
    constructor() {}
    // Màn tạo
    formatProductPromotionFromCloseDialogAdd(listProdAdd: any, list: any) {
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
                warehouseId: product?.warehouse?.id || '04cb0fee-4f5d-11ed-bdc3-0242ac120002', // auto là khuyến mại nếu chưa có kho mặc địch của sp
                unitPrice: product.retailPrice, // mặc định đơn giá là giá lẻ
                quantity: 0,
                totalPrice: 0,
                discount: 0,
                discountRate: 0,
                note: null,
                type: 2, // vì thêm sản phẩm khuyến mại
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
                warehouseId: product?.warehouse?.id || 'fcb4a590-4f5c-11ed-bdc3-0242ac120002', // auto là kho chính nếu chưa có kho mặc địch của sp
                unitPrice: product.retailPrice, // mặc định đơn giá là giá lẻ
                quantity: 0,
                totalPrice: 0,
                discount: 0,
                discountRate: 0,
                note: null,
                type: 1, // vì thêm sản phẩm đặt hàng
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

    formatUnitIdAndWareHouseId(list: any) {
        list.forEach((product: any) => {
            product.warehouseId = product.warehouse?.id;
            product.unitId = product.unit?.id;
        });
        return list;
    }

    // màn tạo (dùng cho cả product và promotion)
    formatProductToSentAPI(listProd: any) {
        let listProductToSentAPI = listProd.map((product: any) => {
            return {
                productId: product.product?.id,
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
        return listProductToSentAPI;
    }

    // after formatProductPromotionFromCloseDialogAdd
    formatProductPromotionAddToSentApi(listAdd: any) {
        listAdd = listAdd.map((product: any) => {
            return {
                productId: product?.product?.id,
                productName: product?.product?.productName,
                unitId: product.unitId, // chưa xét trường hợp k có đvt lẻ
                warehouseId: product.warehouseId, // chưa xét trường hợp k có kho mặc định
                unitPrice: product.unitPrice,
                quantity: product.quantity,
                totalPrice: 0,
                discount: 0,
                discountRate: 0,
                note: product.note,
                type: 2, // hoặc product.type vì đã formatProductPromotionFromCloseDialogAdd trước
            };
        });
        return listAdd;
    }

    formatProductAddToSentApi(listAdd: any) {
        listAdd = listAdd.map((product: any) => {
            return {
                productId: product?.product?.id,
                productName: product?.product?.productName,
                unitId: product.unitId, // chưa xét trường hợp k có đvt lẻ
                warehouseId: product.warehouseId, // chưa xét trường hợp k có kho mặc định
                unitPrice: product.unitPrice,
                quantity: product.quantity,
                totalPrice: product.totalPrice,
                discount: product.discount,
                discountRate: product.discountRate,
                note: product.note,
                type: 1, // hoặc product.type vì đã formatProductFromCloseDialogAdd trước
            };
        });
        return listAdd;
    }
}
