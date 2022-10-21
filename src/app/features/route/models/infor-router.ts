export class RootInfoRoute {
  routeCode: string;
  routeName: string;
  employeeId: string;
  employee: Employee;
  unitTreeGroupId: string;
  unitTreeGroup: UnitTreeGroup;
  routeDate: string;
  startedDate: string;
  status: boolean;
  routeCustomer: RouteCustomer[];
  id: string;
  createdBy: string;
  createdDate: string;
  lastModifiedBy: string;
  lastModifiedDate: string;
}

export class RouteCustomer {
  routeId: string;
  customerId: string;
  customer: Customer;
  lastModifiedDate: string;
}

export class Customer {
  id: string;
  customerCode: string;
  customerName: string;
  customerGroupId: string;
  customerGroup: CustomerGroup;
  customerTypeId: string;
  customerType: CustomerType;
  routeCustomer: any[];
}

export class CustomerType {
  serial: number;
  customerTypeCode: string;
  customerTypeName: string;
  status: boolean;
  id: string;
  createdBy: string;
  createdDate: string;
  lastModifiedBy: string;
  lastModifiedDate: string;
}

export class CustomerGroup {
  serial: number;
  customerGroupCode: string;
  customerGroupName: string;
  status: boolean;
  id: string;
  createdBy: string;
  createdDate: string;
  lastModifiedBy: string;
  lastModifiedDate: string;
}

export class UnitTreeGroup {
  unitTreeGroup_Code: string;
  name: string;
  workScheduleType: number;
  type: number;
  supervise: boolean;
  parentNodeId: string;
  isLeaf: boolean;
  quantityChildrenOfNode: number;
  heightOfNode: number;
  levelOfNode: number;
  id: string;
  createdBy: string;
  createdDate: string;
  lastModifiedBy: string;
  lastModifiedDate: string;
}

export class Employee {
  id: string;
  employeeCode: string;
  employeeName: string;
  email: string;
  employeeTitle: string;
  status: boolean;
  lastSeenDate: string;
  lastSyncDate: string;
  versionMobile: number;
  phone: string;
  position: string;
  department: string;
  langKey: string;
  entranceDate: string;
  exitDate: string;
  address: string;
  gender: number;
  avatar: string;
  archived: boolean;
  createdBy: string;
  createdDate: string;
  lastModifiedBy: string;
  lastModifiedDate: string;
}