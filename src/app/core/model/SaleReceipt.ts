export interface SaleReceipt {
    saleReceiptId: string;
    saleReceiptCode: string;
    type: number;
    status: number;
    relatedOrder: RelatedOrder;
    orderDate: string;
    saleDate: string;
    orderEmployee: OrderEmployee;
    saleEmployee: SaleEmployee;
    customerCode: string;
    customerName: string;
    phone: string;
    address: string;
    description: string;
    totalPayment: number;
    createdDate: string;
    createdBy: string;
    lastModifiedBy: string;
    lastModifiedDate: string;
}

export interface SaleReceiptDetail {
    saleReceiptId: string;
    saleReceiptCode: string;
    type: string;
    status: string;
    relatedOrder: RelatedOrder;
    orderDate: string;
    saleDate: string;
    deliveryDate: string;
    group: Group;
    orderEmployee: OrderEmployee;
    route: Route;
    saleEmployee: SaleEmployee;
    customerCode: string;
    customerName: string;
    phone: string;
    address: string;
    description: string;
    warehouse: Warehouse;
    listProduct: ListProduct[];
    listPromotionProduct: ListPromotionProduct[];
    debtLimit: string;
    debtCurrent: string;
    paymentMethod: string;
    paymenTerm: string;
    totalAmount: string;
    totalOfVAT: string;
    totalDiscountProduct: string;
    tradeDiscount: string;
    totalPayment: string;
    prePayment: string;
    debtRecord: string;
}

export interface OrderEmployee {
    employeeId: string;
    employeeName: string;
}

export interface SaleEmployee {
    employeeId: string;
    employeeName: string;
}

export interface RelatedOrder {
    purchaseOrderId: string;
    purchaseOrderCode: string;
}

export interface Group {
    groupId: string;
    groupName: string;
}

export interface Route {
    routeId: string;
    routeName: string;
}

export interface Warehouse {
    warehouseId: string;
    warehouseName: string;
}

export interface ListProduct {
    productId: string;
    productCode: string;
    productName: string;
    unitName: string;
    warehouseName: string;
    quantity: string;
    unitPrice: string;
    totalPrice: string;
    discountRate: string;
    note: string;
}

export interface ListPromotionProduct {
    productId: string;
    productCode: string;
    productName: string;
    unitName: string;
    warehouseName: string;
    quantity: string;
    note: string;
}
