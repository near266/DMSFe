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
    purchaseOrderId?: string;
    purchaseOrderCode?: string;
    status?: number;
    type?: number;
    orderDate?: string;
    deliveryDate?: string;
    group?: Group;
    orderEmployee?: OrderEmployee;
    route?: Route;
    customerCode?: string;
    customerName?: string;
    phone?: string;
    address?: string;
    description?: string;
    warehouseName?: string;
    listProduct?: ListProduct[];
    listPromotionProduct?: ListPromotionProduct[];
    debtLimit?: number;
    debtCurrent?: number;
    paymentMethod?: string;
    totalAmount?: number;
    totalOfVAT?: number;
    totalDiscountProduct?: number;
    tradeDiscount?: number;
    totalPayment?: number;
    prePayment?: number;
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
    productCode?: string;
    productName?: string;
    unitName?: string;
    warehouseName?: string;
    quantity?: number;
    unitPrice?: string;
    totalPrice?: number;
    discount?: number;
    discountRate?: number;
    note?: string;
}

export class ListPromotionProduct {
    productCode?: string;
    productName?: string;
    unitName?: string;
    warehouseName?: string;
    quantity?: number;
    note?: string;
}
