export interface RootSaleReport {
    data: Daum[];
    sumOfOrderProduct: number;
    sumOfPromotionProduct: number;
    sumOfTotalPrice: number;
    sumOfDiscount: number;
    sumOfTotalPayment: number;
    sumOfVAT: number;
    total: number;
    page: number;
    pageSize: number;
}

export interface Daum {
    id: string;
    createdDate: string;
    saleEmployee: SaleEmployee;
    orderEmployee: OrderEmployee;
    saleCode: string;
    saleDate: string;
    deliveryDate: string;
    group: Group;
    customer: Customer;
    purchaseOrderId: string;
    orderCode: string;
    orderDate: string;
    tradeDiscountRate: number;
    tradeDiscount: number;
    totalMoney: number;
    totalOfVAT: number;
    description: string;
    listProducts: ListProduct[];
    preMoney: number;
}

export interface SaleEmployee {
    id: string;
    employeeCode: string;
    employeeName: string;
    employeeTitle: string;
}

export interface OrderEmployee {
    id: string;
    employeeCode: string;
    employeeName: string;
    employeeTitle: string;
}

export interface Group {
    id: string;
    name: string;
    unitTreeGroup_Code: string;
}

export interface Customer {
    id: string;
    customerCode: string;
    customerName: string;
    customerGroup: CustomerGroup;
    customerType: CustomerType;
    area: Area;
    channel: Channel;
    address: string;
    phone: string;
    province: string;
    district: string;
}

export interface CustomerGroup {
    id: string;
    customerGroupName: string;
}

export interface CustomerType {
    id: string;
    customerTypeName: string;
}

export interface Area {
    id: string;
    areaName: string;
}

export interface Channel {
    id: string;
    channelName: string;
}

export interface ListProduct {
    id: string;
    productCode: string;
    productName: string;
    note: string;
    major: Major;
    brand: Brand;
    quantity: number;
    promotionName: string;
    promotionQuantity: number;
    unit: Unit;
    unitPrice: number;
    totalPrice: number;
    discountRate: number;
    discount: number;
    warehouse: Warehouse;
    vaTofPro: number;
    quantityReturn: number;
    moneyReturn: number;
    quatitySale: number;
}

export interface Major {
    id: string;
    commodityName: string;
}

export interface Brand {
    id: string;
    brandName: string;
}

export interface Unit {
    id: string;
    unitName: string;
}

export interface Warehouse {
    id: string;
    warehouseCode: string;
    warehouseName: string;
}
