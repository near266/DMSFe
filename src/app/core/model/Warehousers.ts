export class Warehouse {
  warehouseId: string;
  warehouseCode: string;
  warehouseName: string;
  type: number;
  description: string;
  responsibleAccountant: Accountant[];
  group: Group;
  responsibleEmployee: Employee;
  status: boolean;
  lastModifiedBy: string;
}

export class Accountant {
  employeeId: string;
  employeeName: string
}

export class Employee {
  employeeId: string;
  employeeName: string
}

export class Group {
  groupId: string;
  groupName:string
}
