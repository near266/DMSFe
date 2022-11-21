export class PurchaseDetail {
    id: string;
    orderDate: string;
    group: Group;
    orderEmployee: OrderEmployee;
    warehouse: any;
    customer: Customer;
    route: Route;
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
    orderCode: string;
    deliveryDate: string;
    prePayment: number;
    listProduct: ListProduct[];
    listPromotionProduct: ListPromotionProduct[];
}

export interface Group {
    id: string;
    unitTreeGroup_Code: string;
    name: string;
}

export interface OrderEmployee {
    id: string;
    employeeCode: string;
    employeeName: string;
    employeeTitle: string;
}

export interface Customer {
    id: string;
    customerCode: string;
    customerName: string;
    address: string;
    phone: string;
}

export interface Route {
    id: string;
    routeCode: string;
    routeName: string;
}

export interface ListProduct {
    product: Product;
    unit: Unit;
    warehouse: Warehouse;
    unitPrice: number;
    quantity: number;
    totalPrice: number;
    discount: number;
    discountRate: number;
    note: string;
    type: number;
    index: number;
}

export interface Product {
    id: string;
    sku: string;
    productName: string;
    retailPrice: number;
    price: number;
    vat: number;
    warehouseId: string;
    retailUnit: Unit;
    wholeSaleUnit: Unit | null;
}

export interface Unit {
    id: string;
    unitCode: string;
    unitName: string;
}

export interface Warehouse {
    id: string;
    serial: string;
    warehouseCode: string;
    warehouseName: string;
}

export interface ListPromotionProduct {
    product: ProductPromotion;
    unit: Unit;
    warehouse: Warehouse;
    unitPrice: number;
    quantity: number;
    totalPrice: number;
    discount: number;
    discountRate: number;
    note: string;
    type: number;
    index: number;
}

export interface ProductPromotion {
    id: string;
    sku: string;
    productName: string;
    retailPrice: number;
    price: number;
    vat: number;
    warehouseId: string;
    retailUnit: Unit;
    wholeSaleUnit: Unit | null;
}
