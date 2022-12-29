export class HistoryOrder {
    data: Data[];
}

export interface Data {
    id: string;
    key: string;
    type: number;
    data: ProductOrderHistory[];
    createdDate: string;
    lastModifiedBy: string;
    lastModifiedDate: string;
    note: string;
}

export interface ProductOrderHistory {
    index: number;
    product?: Product;
    unit?: Unit;
    warehouse?: Warehouse;
    unitPrice: number;
    quantity: number;
    totalPrice: number;
    discount: number;
    discountRate: number;
    note: string;
    type: number;
    salesQuantity: number;
    exportQuantity: number;
    returnsQuantity: number;
}

export interface Product {
    sku: string;
    productName: string;
}

export interface Unit {
    unitName: string;
}

export interface Warehouse {
    warehouseName: string;
}
