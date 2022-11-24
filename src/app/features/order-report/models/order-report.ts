import { Warehouse } from './saleReports';

export class RootOrderReport {
    data?: Datum[];
    sumOfOrderProduct?: number;
    sumOfPromotionProduct?: number;
    sumOfTotalPrice?: number;
    sumOfDiscount?: number;
    sumOfTotalPayment?: number;
    sumOfVAT?: number;
    total!: number;
    page?: number;
    pageSize?: number;
    sumOfTradeDiscount: number;
}

export class Datum {
    purchaseOrderId?: string;
    createdDate?: string;
    orderEmployee?: OrderEmployee;
    group?: Group;
    source?: string;
    orderCode?: string;
    orderDate?: string;
    deliveryDate?: string;
    customer?: Customer;
    listProducts?: ListProduct[];
    tradeDiscountRate?: number;
    tradeDiscount?: number;
    totalMoney?: number;
    totalOfVAT?: number;
    totalAmount?: number;
    description?: string;
    preMoney?: number;
}

export class ListProduct {
    id?: string;
    productCode?: string;
    productName?: string;
    note?: string;
    major?: Major;
    brand?: any;
    quantity?: number;
    promotionName?: any;
    promotionQuantity?: number;
    unit?: Unit;
    unitPrice?: number;
    totalPrice?: number;
    discountRate?: number;
    warehouse: Warehouse;
    discount?: number;
    vaTofPro?: number;
    quantityReturn?: number;
    moneyReturn?: number;
}

export class Customer {
    id?: string;
    customerCode?: string;
    customerName?: string;
    customerGroup?: CustomerGroup;
    customerType?: CustomerType;
    area?: Area;
    channel?: Channel;
}

export class Channel {
    id?: string;
    channelName?: string;
}

export class Area {
    id?: string;
    areaName?: string;
}

export class CustomerType {
    id?: string;
    customerTypeName?: string;
}

export class CustomerGroup {
    id?: string;
    customerGroupName?: string;
}

export class Group {
    id?: string;
    name?: string;
    unitTreeGroup_Code?: string;
}

export class OrderEmployee {
    id?: string;
    employeeCode?: string;
    employeeName?: string;
    employeeTitle?: string;
}

export class Unit {
    id: string;
    unitName: string;
}

export class Major {
    id: string;
    commodityName: string;
}
