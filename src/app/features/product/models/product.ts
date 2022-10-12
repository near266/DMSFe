export interface Product {
    locked?: boolean;
    brandId?: string;
    SKU?: string;
    productName: string;
    unitId?: string;
    retailPrice?: number;
    VAT?: 5 | 10;
    discountAcc?: string;
    priceAcc?: number;
    barcode?: string;
    status?: string;
    majorId?: string;
    supplierId: string;
    conversionNumber?: number;
    inventoryWarning?: number;
    importPrice?: number;
    importRetailPrice?: number;
    price?: number;
    petailPrice?: number;
    image?: string;
    productDescription?: string;
    revenueAcc?: string;
    warehouseAcc?: string | number;
    warehouseID?: string;
}
