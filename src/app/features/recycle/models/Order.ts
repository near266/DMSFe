export class Order {
    id: string;
    orderDate: string;
    customer?: any;
    lastModifiedBy: string;
    lastModifiedDate: string;
    orderCode: string;
}

export class Customer {
    id: string;
    customerCode: string;
    customerName: string;
    address: string;
    phone: string;
}
