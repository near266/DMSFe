export interface Return {
    id?: string;
    locked?: boolean;
    customerID?: string;
    productID?: string;
    salesCode?: string;
    customerCode?: string;
    customerName?: string;
    orderer?: string;
    orderDate?: string;
    phoneNo?: string;
    address?: string;
    returnsCode?: string;
    returnsDate?: string;
    status?: ReturnStatus;
    description?: string;
    totalAmount?: string;
    totalVAT?: 5 | 10;
    productDiscount?: string;
    orderDiscount?: string;
    mandatoryPayment?: string;
    debit?: string;
}

export type ReturnStatus = 'pending' | 'approved' | 'imported';
