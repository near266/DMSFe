export class VisitReportResponse {
    data: VisitReport[];
    totalCount!: number;
    totalOfCheckIn: number;
    totalOfCustomer: number;
    totalOfDay: number;
    totalOfTimeCheckIn: string;
    totalOfWork: string;
}

export class VisitReport {
    group: Group;
    data1: Data1[];
}

export class Group {
    id: string;
    unitTreeGroup_Code: string;
    name: string;
}

export class Data1 {
    employee: Employee;
    timeKeepingCs: TimeKeepingC[];
}

export class Employee {
    id: string;
    employeeCode: string;
    employeeName: string;
}

export class TimeKeepingC {
    id: string;
    timeKeepingDate: string;
    entryTime: EntryTime;
    exitTime: ExitTime;
    checkInC: CheckInC[];
    sumOfTimeCheckIn: SumOfTimeCheckIn;
    employeeId: string;
}

export class EntryTime {
    ticks: number;
    days: number;
    hours: number;
    milliseconds: number;
    minutes: number;
    seconds: number;
    totalDays: number;
    totalHours: number;
    totalMilliseconds: number;
    totalMinutes: number;
    totalSeconds: number;
}

export class ExitTime {
    ticks: number;
    days: number;
    hours: number;
    milliseconds: number;
    minutes: number;
    seconds: number;
    totalDays: number;
    totalHours: number;
    totalMilliseconds: number;
    totalMinutes: number;
    totalSeconds: number;
}

export class CheckInC {
    id: string;
    image: string[];
    checkInTime: string;
    checkOutTime: string;
    checkInAddress: string;
    note: string;
    isRoute: boolean;
    isOrder: boolean;
    customer: Customer;
    timeCheckIn: TimeCheckIn;
    employeeId: string;
    dateJoin: string;
}

export class Customer {
    id: string;
    customerCode: string;
    customerName: string;
    customerGroup: CustomerGroup;
    customerType: CustomerType;
    phone: string;
    email: string;
    contactName: string;
    address: string;
}

export class CustomerGroup {
    customerGroupName: string;
}

export class CustomerType {
    customerTypeName: string;
}

export class TimeCheckIn {
    ticks: number;
    days: number;
    hours: number;
    milliseconds: number;
    minutes: number;
    seconds: number;
    totalDays: number;
    totalHours: number;
    totalMilliseconds: number;
    totalMinutes: number;
    totalSeconds: number;
}

export class SumOfTimeCheckIn {
    ticks: number;
    days: number;
    hours: number;
    milliseconds: number;
    minutes: number;
    seconds: number;
    totalDays: number;
    totalHours: number;
    totalMilliseconds: number;
    totalMinutes: number;
    totalSeconds: number;
}

export class DataFormat {
    content: string[];
    list: DataFormat[];
}
