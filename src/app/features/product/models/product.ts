import { RetailUnit } from 'src/app/core/model/PurchaseOrder';
import { warehouses } from './../../../core/data/Warehousers';
export interface Product {
    id?: string;
    stt?: number;
    index?: string | number;
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
    retailUnit?: Unit;
    supplier?: Supplier;
    major?: Major;
    wholeSaleUnit?: Unit;
    warehouse?: Warehouse;
}
export interface Supplier {
    id?: string;
    supplierName?: string;
    supplierCode?: string;
    address?: string;
    taxCode?: string;
    phone?: string;
    status?: boolean;
    createdBy?: string;
    createdDate?: Date;
    lastModifiedDate?: Date
}
export interface Unit {
    id?: string;
    unitName?: string;
    unitCode?: string;
    status?: boolean;
    createdBy?: string;
    createdDate?: Date;
    lastModifiedDate?: Date
}

export interface Brand {
    id?: string;
    brandName?: string;
    brandCode?: string;
    status?: boolean;
    createdBy?: string;
    createdDate?: Date;
    lastModifiedDate?: Date
}

export interface Major {
    id?: string;
    commodityName?: string;
    commodityCode?: string;
    status?: boolean;
    createdBy?: string;
    lastModifiedDate?: Date;
}

export interface Warehouse {
    id?: string;
    warehouseName?: string;
    warehouseCode?: string;
}
