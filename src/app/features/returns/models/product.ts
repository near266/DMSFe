export interface ProductReturn {
    returnsId?: string;
    productId?: string;
    vat?: number;
    productName?: string;
    sku?: string;
    unitId?: string;
    warehouseId?: string;
    unitPrice?: number;
    quantity?: number;
    totalPrice?: number;
    discount?: number;
    discountRate?: number;
    note?: string | null;
    type: 1 | 2;
    salesQuantity?: number;
    exportQuantity?: number;
    returnsQuantity?: number;
}
