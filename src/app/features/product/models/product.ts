import { warehouses } from './../../../core/data/Warehousers';
export interface Product {
    id?: string;
    status?: boolean;
    brandId?: string;
    sku?: string;
    unitId?: string;
    productName: string;
    retailUnitId?: string;
    wholeSaleUnitId?: string;
    retailPrice?: number;
    vat?: 5 | 10 | null;
    discountAcc?: string;
    priceAcc?: number;
    barcode?: string;
    majorId?: string;
    supplierId: string;
    conversionNumber?: number;
    inventoryWarning?: number;
    importPrice?: number;
    importRetailPrice?: number;
    price?: number;
    image?: string;
    productDescription?: string;
    revenueAcc?: string;
    warehouseAcc?: string | number;
    warehouseID?: string;

    // table fields
    brand?: Brand;
    supplier?: Supplier;
    major?: Major;
    unit?: Unit;
    wholeSaleUnit?: Unit;
    warehouse?: Warehouse;
}
export interface Supplier {
    id?: string;
    supplierName?: string;
    supplierCode?: string;
}
export interface Unit {
    id?: string;
    unitName?: string;
    unitCode?: string;
}

export interface Brand {
    id?: string;
    brandName?: string;
    brandCode?: string;
}

export interface Major {
    id?: string;
    commodityName?: string;
    commodityCode?: string;
}

export interface Warehouse {
    id?: string;
    warehouseName?: string;
    warehouseCode?: string;
}
