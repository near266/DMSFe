import { CurrencyPipe, PercentPipe } from '@angular/common';
import { Injectable } from '@angular/core';
import products from '../../product/mocks/product';
import { Config } from '../models/config';

@Injectable({
    providedIn: 'root',
})
export class FormatService {
    constructor(private currency: CurrencyPipe, private percent: PercentPipe) {}
    formatDataOrders(dataList: any) {
        let dataReturn: any = [];
        let listIds: string[] = [];
        dataReturn = dataList.map((data: any, index: number) => {
            listIds.push(data.purchaseOrderId);
            let productInfo = this.getProductInfo(data.listProducts);
            let productCodeArray = productInfo.productCodeArray;
            let productNameArray = productInfo.productNameArray;
            let warehouseCodeArray = productInfo.warehouseCodeArray;
            let warehouseNameArray = productInfo.warehouseNameArray;
            let descriptionArray = productInfo.descriptionArray;
            let majorArray = productInfo.majorArray;
            let brandArray = productInfo.brandArray;
            let quantityArray = productInfo.quantityArray;
            let promotionNameArray = productInfo.promotionNameArray;
            let promotionQuantityArray = productInfo.promotionQuantityArray;
            let unitArray = productInfo.unitArray;
            let unitPriceArray = productInfo.unitPriceArray;
            let totalPriceArray = productInfo.totalPriceArray;
            let vatArray = productInfo.vatArray;
            let discountRateArray = productInfo.discountRateArray;
            let discountArray = productInfo.discountArray;
            return [
                // Số thứ tự
                {
                    content: index,
                    hasChildren: false,
                },
                // Mã nhân viên
                {
                    content: data.orderEmployee?.employeeCode,
                    hasChildren: false,
                },
                // Tên nhân viên
                {
                    content: data.orderEmployee?.employeeName,
                    hasChildren: false,
                },
                // Phòng nhóm
                {
                    content: data.group?.name,
                    hasChildren: false,
                },
                // Nguồn
                {
                    content: data.source,
                    hasChildren: false,
                },
                // Mã đơn đặt
                {
                    content: data.orderCode,
                    hasChildren: false,
                },
                // Ngày đơn đặt hàng
                {
                    content: data.orderDate,
                    hasChildren: false,
                },
                // Mã khách hàng
                {
                    content: data.customer?.customerCode,
                    hasChildren: false,
                },
                // Tên khách hàng
                {
                    content: data.customer?.customerName,
                    hasChildren: false,
                },
                // Số lần bán
                {
                    content: 'Chưa biết trường nào',
                    hasChildren: false,
                },
                // Số lần trả
                {
                    content: 'Chưa biết trường nào',
                    hasChildren: false,
                },
                // Địa chỉ
                {
                    content: data.customer?.address,
                    hasChildren: false,
                },
                // Khu vực
                {
                    content: data.customer?.area?.areaName,
                    hasChildren: false,
                },
                // Kênh
                {
                    content: data.customer?.channel,
                    hasChildren: false,
                },
                // Nhóm khách
                {
                    content: 'Chưa thấy chi tiết',
                    hasChildren: false,
                },
                // Loại khách
                {
                    content: 'Chưa thấy chi tiết',
                    hasChildren: false,
                },
                // Mã sản phẩm
                {
                    content: productCodeArray,
                    hasChildren: true,
                },
                // Tên sản phẩm
                {
                    content: productNameArray,
                    hasChildren: true,
                },
                // Mã kho
                {
                    content: warehouseCodeArray,
                    hasChildren: true,
                },
                // Tên kho
                {
                    content: warehouseNameArray,
                    hasChildren: true,
                },
                // Mô tả
                {
                    content: descriptionArray,
                    hasChildren: true,
                },
                // ngành hàng
                {
                    content: majorArray,
                    hasChildren: true,
                },
                // nhãn hiệu
                {
                    content: brandArray,
                    hasChildren: true,
                },
                // Số lượng
                {
                    content: quantityArray,
                    hasChildren: true,
                },
                // Tên ctrinh km
                {
                    content: promotionNameArray,
                    hasChildren: true,
                },
                // Số lượng km
                {
                    content: promotionQuantityArray,
                    hasChildren: true,
                },
                // ĐVT
                {
                    content: unitArray,
                    hasChildren: true,
                },
                // Đơn giá
                {
                    content: unitPriceArray,
                    hasChildren: true,
                },
                // Thành tiền
                {
                    content: totalPriceArray,
                    hasChildren: true,
                },
                // VAT từng sp
                {
                    content: vatArray,
                    hasChildren: true,
                },
                // tỉ lệ ck từng sp
                {
                    content: discountRateArray,
                    hasChildren: true,
                },
                // ck từng sp
                {
                    content: discountArray,
                    hasChildren: true,
                },
                // thành tiền
                {
                    content: this.currency.transform(data.totalMoney, 'VND', 'symbol', '1.0-0'),
                    hasChildren: false,
                },
                // Chiết khấu tổng bill
                {
                    content: this.percent.transform(data.tradeDiscountRate / 100, '1.0-0'),
                    hasChildren: false,
                },
                // tiền chiết khấu
                {
                    content: this.currency.transform(data.tradeDiscount, 'VND', 'symbol', '1.0-0'),
                    hasChildren: false,
                },
                // thanh toán trước
                {
                    content: 'Chưa trả về',
                    hasChildren: false,
                },
                // Diễn giải
                {
                    content: data.description,
                    hasChildren: false,
                },
            ];
        });
        // để phân biệt ấn vào cột nào sẽ emit gì, biết ấn vào từ màn nào
        let returnInfo: Config = {
            from: 'ReportOrders',
            emitTdOrder: 5,
            dataReturn: dataReturn,
            listIds: listIds,
        };
        return returnInfo;
    }

    getProductInfo(productList: any) {
        let productCodeArray: any = [];
        let productNameArray: any = [];
        let warehouseCodeArray: any = [];
        let warehouseNameArray: any = [];
        let descriptionArray: any = [];
        let brandArray: any = [];
        let quantityArray: any = [];
        let majorArray: any = [];
        let promotionNameArray: any = [];
        let promotionQuantityArray: any = [];
        let unitArray: any = [];
        let unitPriceArray: any = [];
        let totalPriceArray: any = [];
        let vatArray: any = [];
        let discountRateArray: any = [];
        let discountArray: any = [];

        productList?.map((product: any) => {
            productCodeArray.push(product.productCode);
            productNameArray.push(product.productName);
            warehouseCodeArray.push(product.warehouse?.warehouseCode || 'Chưa có');
            warehouseNameArray.push(product.warehouse?.warehouseName || 'Chưa có');
            descriptionArray.push(product.note);
            majorArray.push(product.major?.majorName);
            brandArray.push(product.brand?.brandName);
            quantityArray.push(product.quantity);
            promotionNameArray.push(product.promotionName);
            promotionQuantityArray.push(product.promotionQuantity);
            unitArray.push(product.unit?.unitName);
            unitPriceArray.push(this.currency.transform(product.unitPrice, 'VND', 'symbol', '1.0-0'));
            totalPriceArray.push(this.currency.transform(product.totalPrice, 'VND', 'symbol', '1.0-0'));
            vatArray.push(product.vat || 0);
            discountRateArray.push(this.percent.transform((product.discountRate / 100) | 0, '1.0-0'));
            discountArray.push(this.currency.transform(product.discount, 'VND', 'symbol', '1.0-0'));
        });
        return {
            productCodeArray: productCodeArray,
            productNameArray: productNameArray,
            warehouseCodeArray: warehouseCodeArray,
            warehouseNameArray: warehouseNameArray,
            descriptionArray: descriptionArray,
            majorArray: majorArray,
            brandArray: brandArray,
            quantityArray: quantityArray,
            promotionNameArray: promotionNameArray,
            promotionQuantityArray: promotionQuantityArray,
            unitArray: unitArray,
            unitPriceArray: unitPriceArray,
            totalPriceArray: totalPriceArray,
            vatArray: vatArray,
            discountRateArray: discountRateArray,
            discountArray: discountArray,
        };
    }
}
