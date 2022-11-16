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