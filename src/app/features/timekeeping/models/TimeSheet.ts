export class TimeSheet {
    employee: Employee;
    unitTreeGroup: UnitTreeGroup;
    row?: number;
    col?: number;
}

export class Employee {
    id: string;
    employeeCode: string;
    employeeName: string;
    email: string;
    employeeTitle: string;
    status: boolean;
    phone?: string;
    position?: string;
    department?: string;
    langKey?: string;
    gender?: number;
    avatar: string;
    archived: boolean;
    createdBy: string;
    createdDate: string;
    lastModifiedBy?: string;
    lastModifiedDate: string;
    address?: string;
}

export class UnitTreeGroup {
    id: string;
    unitTreeGroup_Code: string;
    name: string;
    workScheduleType: number;
    type: number;
    supervise: boolean;
    parentNodeId?: string;
    isLeaf: boolean;
    quantityChildrenOfNode: number;
    heightOfNode: number;
    levelOfNode: number;
}
