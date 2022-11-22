export class WareHouse {
    id: string;
    warehouseName: string;
    warehouseCode: string;
    warehouseType: string;
    status: boolean;
    description: string;
    responsibleAccountant: string;
    employee: Employee;
    unitTreeGroup: UnitTreeGroup;
    createdBy: string;
    createdDate: string;
    lastModifiedBy: any;
    lastModifiedDate: any;
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
    unitTreeGroup_Code: any;
    name: any;
    orgName: any;
    fullOrgName: any;
}
