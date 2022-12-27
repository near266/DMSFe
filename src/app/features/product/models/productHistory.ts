export interface ProductHistory {
    id: string;
    productId: string;
    sku: string;
    productName: string;
    retailPrice: number;
    price: number;
    vat: number;
    conversionNumber: number;
    retailUnit: Unit;
    wholeSaleUnit: Unit;
    source: string;
    type: number;
    createdBy: string;
    createdDate: Date;
    lastModifiedBy: string;
    lastModifiedDate: Date;
}

export interface Unit {
    id: string;
    unitName: string;
}
