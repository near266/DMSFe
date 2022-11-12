export interface RootPurchases {
    data: PurchaseOrder[];
    totalCount: number;
}

export interface PurchaseOrder {
    id: string;
    orderDate: string;
    orderEmployee: OrderEmployee;
    customer: Customer;
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
    orderCode: string;
    deliveryDate: string;
    approved: any;
    approvedDate: any;
    source: string;
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
