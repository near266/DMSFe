export class Response {
    list: List[];
    totalCount: number;
}

export class List {
    group: Group;
    listData: ListData[];
}

export class Group {
    id: string;
    unitTreeGroup_Code?: string;
    name?: string;
}

export class ListData {
    employee: Employee;
    listTime: ListTime[];
    totalDay: any;
    totalEarly: any;
    totalLate: any;
    totalWorkDay: any;
}

export class Employee {
    id: string;
    employeeCode: string;
    employeeName: string;
}

export class ListTime {
    maxList?: MaxList[];
    minList?: MinList[];
}

export interface MaxList {
    id: string;
    time: string;
    timeKeepingDate: string;
    entryTime: string;
    exitTime: string;
    employee: Employee;
    location: string;
    early: string;
    late: any;
    note: string;
    workDay: any;
    totalWork: any;
}

export interface MinList {
    id: string;
    time: string;
    timeKeepingDate: string;
    entryTime: string;
    exitTime: string;
    employee: Employee;
    location: string;
    early: any;
    late: string;
    note: string;
    workDay: any;
    totalWork: any;
}
