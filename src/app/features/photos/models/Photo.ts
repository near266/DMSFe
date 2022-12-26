export class Photo {
    checkIn: CheckIn;
    album: Album;
    image: string[];
}

export class CheckIn {
    id: string;
    customer: Customer;
    employee: Employee;
    status: string;
    checkInTime: string;
    checkOutTime: string;
    checkInAddress: string;
    createdBy: string;
    createdDate: string;
}

export class Customer {
    id: string;
    customerName: string;
    customerCode: string;
    address: string;
}

export class Employee {
    id: string;
    employeeCode: string;
    employeeName: string;
    email: string;
    employeeTitle: string;
}

export class Album {
    id: string;
    albumName: string;
}
