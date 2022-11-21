export class Route {
  routeCode?: string;
  routeName?: string;
  employeeId?: string;
  employee?: Employee;
  unitTreeGroupId?: string;
  unitTreeGroup?: UnitTreeGroup;
  routeDate?: string;
  totalCus?: any;
  startedDate?: string;
  status?: boolean;
  id?: string;
  createdBy?: string;
  createdDate?: string;
  lastModifiedBy?: string;
  lastModifiedDate?: string;
}

export class Employee {
  id?: string;
  employeeCode?: string;
  employeeName?: string;
  email?: string;
  employeeTitle?: string;
  status?: boolean;
  phone?: string;
  position?: string;
  department?: string;
  langKey?: string;
  entranceDate?: string;
  exitDate?: string;
  gender?: number;;
  avatar?: string;
  archived?: boolean;
  createdBy?: string;
  createdDate?: string;
  lastModifiedBy?: string;
  lastModifiedDate?: string;
}

export class UnitTreeGroup {
  unitTreeGroup_Code?: string;
  name?: string;
  workScheduleType?: number;
  type?: number;
  supervise?: boolean;
  isLeaf?: boolean;
  quantityChildrenOfNode?: number;
  heightOfNode?: number;
  levelOfNode?: number;
  id?: string;
  createdBy?: string;
  createdDate?: string;
  lastModifiedBy?: string;
  lastModifiedDate?: string;
}
