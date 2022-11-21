export class SaleUpdateBody {
    id: string;
    orderDate: string;
    groupId: string;
    saleEmployeeId: string;
    warehouseId?: string;
    customerId: string;
    routeId: string;
    type: number;
    status: number;
    paymentMethod: number;
    description: string;
    phone: string;
    address: string;
    customerName: string;
    lastModifiedBy?: string;
    purchaseOrderId: string;
    deliveryDate: string;
    saleDate: string;
    paymentTerm: string;
    debtRecord: boolean;
    saleCode: string;
    archived: boolean;
    orderEmployeeId: string;
    totalAmount: number;
    totalOfVAT: number;
    totalDiscountProduct: number;
    tradeDiscount: number;
    totalPayment: number;
    lastModifiedDate: string;
    prePayment: number;
    approvedBy?: string;
    approvedDate?: string;
}

export interface SaleCreateBody {
    orderDate: string;
    groupId: string;
    saleEmployeeId: string;
    warehouseId?: string;
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
    createdBy?: string;
    createdDate: string;
    saleReceiptCode?: string;
    purchaseOrderId?: string;
    deliveryDate: string;
    saleDate: string;
    paymentTerm: string;
    prePayment: number;
    debtRecord: boolean;
    orderEmployeeId: string;
    listProduct: ListProductCreate[];
    listPromotionProduct: ListPromotionProductCreate[];
}

export interface ListProductCreate {
    saleRecieptId?: string;
    productId: string;
    unitId: string;
    warehouseId: string;
    unitPrice: number;
    quantity: number;
    totalPrice: number;
    discount: number;
    discountRate: number;
    note: string;
    type: number;
    index?: number;
}

export interface ListPromotionProductCreate {
    saleRecieptId?: string;
    productId: string;
    unitId: string;
    warehouseId: string;
    unitPrice: number;
    quantity: number;
    totalPrice: number;
    discount: number;
    discountRate: number;
    note: string;
    type: number;
    index?: number;
}
