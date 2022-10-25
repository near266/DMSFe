export class RootSearchAllCusInRoute {
  data: Datum[];
  totalCount: number;
}

export class Datum {
  routeId: string;
  route?: any;
  customerId: string;
  customer: Customer;
  lastModifiedDate?: any;
}

export class Customer {
  id: string;
  customerCode: string;
  customerName: string;
  customerGroup?: any;
  customerType?: any;
  channel?: any;
  area?: any;
  status: boolean;
  isUpdateAddress?: any;
  address: string;
  deliveryAddress: string;
  province: string;
  district: string;
  ward?: any;
  dob: string;
  contactName: string;
  position: string;
  phone: string;
  email?: any;
  avatar?: any;
  debtLimit?: any;
  cashAcc: string;
  createdBy?: any;
  createdDate: string;
  lastModifiedBy?: any;
  lastVisitBy?: any;
  lastOrderBy?: any;
  lastModifiedDate: string;
}