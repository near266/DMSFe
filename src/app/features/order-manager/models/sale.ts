export interface RootSaleReceipt {
    data: SaleOrder[];
    totalCount: number;
}

export interface SaleOrder {
    id: string;
    orderDate: string;
    group: any;
    orderEmployee: OrderEmployee;
    warehouse: any;
    customer: Customer;
    route: any;
    type: number;
    status: number;
    description: string;
    phone: string;
    address: string;
    customerName: string;
    totalPayment: number;
    createdBy: string;
    createdDate: string;
    lastModifiedBy: any;
    lastModifiedDate: any;
    saleCode: string;
    purchaseOrder: any;
    deliveryDate: string;
    saleDate: string;
    paymentTerm: string;
    saleEmployee: SaleEmployee;
    approved: any;
    approvedDate: any;
    printStatus: any;
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

export interface SaleEmployee {
    id: string;
    employeeCode: string;
    employeeName: string;
    employeeTitle: string;
}
