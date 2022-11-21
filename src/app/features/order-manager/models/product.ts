export interface Media {
    id: string;
    value: string;
}

export interface Major {
    id: string;
    commodityName: string;
    commodityCode: string;
}

export interface Warehouse {
    id: string;
    warehouseName: string;
    warehouseCode: string;
    warehouseType: string;
    status: boolean;
}

export interface Brand {
    id: string;
    serial: string;
    brandCode: string;
    brandName: string;
    status: boolean;
    debtLimit: boolean;
    createdBy: string;
    createdDate: Date;
    lastModifiedBy: string;
    lastModifiedDate: Date;
}

export interface Supplier {
    id: string;
    supplierName: string;
    supplierCode: string;
}

export interface RetailUnit {
    id: string;
    unitName: string;
    unitCode: string;
    serial: string;
    status: boolean;
    createdBy: string;
    createdDate: Date;
    lastModifiedBy: string;
    lastModifiedDate: Date;
}

export interface WholeSaleUnit {
    id: string;
    unitName: string;
    unitCode: string;
    serial: string;
    status: boolean;
    createdBy: string;
    createdDate: Date;
    lastModifiedBy: string;
    lastModifiedDate: Date;
}

export interface Product {
    id: string;
    sku: string;
    productName: string;
    barcode: string;
    retailPrice: number;
    price: number;
    importRetailPrice: number;
    importPrice: number;
    vat: number;
    discountAcc: string;
    priceAcc: string;
    status: boolean;
    inventoryWarning: number;
    conversionNumber: number;
    productDescription: string;
    medias: Media[];
    major: Major;
    warehouse: Warehouse;
    brand: Brand;
    supplier: Supplier;
    retailUnit: RetailUnit;
    wholeSaleUnit: WholeSaleUnit;
    warehouseAcc: string;
    createdBy: string;
    createdDate: Date;
    lastModifiedBy: string;
    lastModifiedDate: Date;
    revenueAcc: string;
    stt: number;
}

export interface ProductSearch {
    data: Product[];
    totalCount: number;
}
