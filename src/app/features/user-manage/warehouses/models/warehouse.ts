export interface Warehouse {
  id: string;
  warehouseName: string;
  warehouseCode: string;
  warehouseType: string;
  status: boolean;
  description: string;
  responsibleAccountant: string;
  employee?: Employee;
  unitTreeGroup?: UnitTreeGroup;
  createdBy: string;
  createdDate: string;
  lastModifiedBy: string;
  lastModifiedDate: string;
  warehouseEmployee?: IAccountant[];
}

export interface Employee {
  id: any;
  employeeCode: any;
  employeeName: any;
  email: any;
  employeeTitle: any;
}

export interface UnitTreeGroup {
  id: string;
  unitTreeGroup_Code: string;
  name: string;
  orgName: any;
  fullOrgName: any;
}

export class IAccountant {
    accountant: Accountant;
}

export class Accountant {
    id: string;
    employeeCode: string;
    employeeName: string;
    email: string;
    employeeTitle: string;
    avatar?: string;
}