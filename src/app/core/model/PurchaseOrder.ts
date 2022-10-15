export class PurchaseOrder {
    purchaseOrderId?: string;
    purchaseOrderCode?: string;
    status?: number;
    orderDate?: Date;
    deliveryDate: Date;
    orderEmployee?: OrderEmployee;
    customerCode?: string;
    customerName?: string;
    phone?: string;
    address?: string;
    description?: string;
    totalPayment?: number;
    approveDate?: Date;
    approveBy?: string;
    createdDate?: Date;
    createdBy?: string;
    lastModifiedDate?: Date;
    lastModifiedBy?: string;
    source?: string;
}

export class PurchaseOrderDetail {
    purchaseOrderId: string;
    purchaseOrderCode: string;
    status: string;
    orderDate: string;
    deliveryDate: string;
    groupId: string;
    orderEmployeeId: string;
    routeId: string;
    customerCode: string;
    customerName: string;
    phone: string;
    address: string;
    description: string;
    warehouseId: string;
    file: string;
    listProduct: ListProduct[];
    listPromotionProduct: ListPromotionProduct[];
    totalAmount: string;
    totalOfVAT: string;
    totalDiscountProduct: string;
    tradeDiscount: string;
    totalPayment: string;
    prePayment: string;
}

export interface Product {
    productId: string;
    productCode: string;
    status: string;
    productName: string;
    wholeSaleUnit: WholeSaleUnit;
    retailUnit: RetailUnit;
    price: string;
    retailPrice: string;
    vAT: string;
}

export interface WholeSaleUnit {
    unitId: string;
    unitName: string;
}

export interface RetailUnit {
    unitId: string;
    unitName: string;
}

export class Group {
    groupId?: string;
    groupName?: string;
}

export class OrderEmployee {
    employeeId?: string;
    employeeName?: string;
}

export class Route {
    routeId?: string;
    routeName?: string;
}

export class ListProduct {
    productId: string;
    productCode: string;
    productName: string;
    unitName: string;
    warehouseName: string;
    quantity: string;
    unitPrice: string;
    totalPrice: string;
    discount: string;
    discountRate: string;
    note: string;
}

export class ListPromotionProduct {
    productId: string;
    productCode: string;
    productName: string;
    unitName: string;
    warehouseName: string;
    quantity: string;
    note: string;
}
