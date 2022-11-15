export class SaleDetail {
    id: string;
    orderDate: string;
    group: Group;
    orderEmployee: Employee;
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
    archived: boolean;
    createdBy: string;
    createdDate: string;
    lastModifiedBy: any;
    lastModifiedDate: any;
    saleCode: string;
    purchaseOrder: any;
    deliveryDate: string;
    saleDate: string;
    paymentTerm: string;
    prePayment: number;
    saleEmployee: Employee;
    debtRecord: boolean;
    listProduct: ListProduct[];
    listPromotionProduct: ListPromotionProduct[];
}

export interface Group {
    id: string;
    unitTreeGroup_Code: string;
    name: string;
}

export interface Employee {
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
    saleReciept: SaleReciept;
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

export interface SaleReciept {
    id: string;
    saleCode: string;
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
    saleReciept: SaleReciept;
    product: Product2;
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

export interface Product2 {
    id: string;
    sku: string;
    productName: string;
    retailPrice: number;
    price: number;
    vat: number;
    warehouseId: any;
    retailUnit: Unit;
    wholeSaleUnit: Unit | null;
}
