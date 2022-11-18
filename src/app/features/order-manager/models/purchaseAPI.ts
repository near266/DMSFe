export class PurchaseBodyUpdate {
    purchaseOrderId: string;
    orderDate: string;
    groupId: string;
    orderEmployeeId: string;
    warehouseId: string;
    customerId: string;
    routeId: string;
    type: number;
    status: number;
    paymentMethod: number;
    description: string;
    phone: string;
    address: string;
    customerName: string;
    totalAmount: number;
    totalOfVAT: number;
    totalDiscountProduct: number;
    tradeDiscount: number;
    totalPayment: number;
    archived: boolean;
    lastModifiedBy?: string;
    lastModifiedDate?: string;
    orderCode: string;
    deliveryDate: string;
    prePayment: number;
    approvedBy?: string;
    approvedDate?: string;
}

export interface PurchaseBodyCreate {
    orderDate: string;
    groupId: string;
    orderEmployeeId: string;
    warehouseId: string;
    customerId: string;
    routeId: string;
    type: number;
    status: number;
    paymentMethod: number;
    description: string;
    phone: string;
    address: string;
    customerName: string;
    totalAmount: number;
    totalOfVAT: number;
    totalDiscountProduct: number;
    tradeDiscount: number;
    totalPayment: number;
    archived: boolean;
    createdBy: string;
    createdDate: string;
    orderCode: string;
    deliveryDate: string;
    prePayment: number;
    listProduct: ListProduct[];
    listPromotionProduct: ListPromotionProduct[];
    source: string;
}

export class ListProduct {
    purchaseOrderId: string;
    productId: string;
    productName: string;
    unitId: string;
    warehouseId: string;
    unitPrice: number;
    quantity: number;
    totalPrice: number;
    discount: number;
    discountRate: number;
    note: string;
    type: number;
}

export class ListPromotionProduct {
    purchaseOrderId: string;
    productId: string;
    productName: string;
    unitId: string;
    warehouseId: string;
    unitPrice: number;
    quantity: number;
    totalPrice: number;
    discount: number;
    discountRate: number;
    note: string;
    type: number;
}
