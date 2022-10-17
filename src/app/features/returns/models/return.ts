import { Product, Warehouse } from '../../product/models/product';

export interface Return {
    id?: string;
    group?: string | null;
    customerName?: string | null;
    prePayment?: string;
    warehouse?: Warehouse | null;
    orderEmployee?: Employee;
    customer?: Customer;
    orderDate?: string;
    phone?: string;
    address?: string;
    employee?: Employee;
    lastModifiedBy?: string;
    lastModifiedDate?: string;
    type?: number;
    status?: Status;
    paymentMethod?: number;
    returnsDate?: string;
    deliveryDate?: string;
    description?: string | null;
    totalAmount?: number;
    totalPayment?: number;
    totalVAT?: number;
    totalDiscountProduct?: number;
    tradeDiscount?: number;
    orderCode?: string;
    listProduct?: Product[];
    listPromotionProduct?: Product[];
}

export type ReturnStatus = 'pending' | 'approved' | 'imported';
export enum Status {
    PENDING = 1,
    APPROVED = 2,
    IMPORTED = 6,
}

export interface Employee {
    id?: string;
    employeeCode?: string;
    employeeName?: string;
    employeeTitle?: string;
}

export interface Customer {
    id?: string;
    customerCode?: string;
    customerName?: string;
    customerGroupId?: string;
    customerTypeId?: string;
    channelId?: string;
    areaId?: string;
    debtLimit?: string;
    lastVisitBy?: string;
}
