import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { DateService } from '../../timekeeping/services/date.service';
import { FormatData, Employee, TimeKeeping } from '../component/table/table.component';
import { Data1, Group, TimeKeepingC, VisitReport, CheckInC, VisitReportResponse } from '../model/VisitReport';

@Injectable({
    providedIn: 'root',
})
export class FormatDataToTableService {
    constructor(private datePipe: DatePipe, private dateService: DateService) {}
    formatListData(data: VisitReportResponse) {
        let DataAfterFormat: FormatData[] = [];
        if (data.data) {
            data.data.forEach((group) => {
                let groupFormat: FormatData;
                let listEmployee: Employee[] = [];
                if (group.data1) {
                    group.data1?.forEach((employee: Data1) => {
                        let Employee: Employee;
                        Employee = {
                            employeeCode: employee.employee.employeeCode,
                            employeeName: employee.employee.employeeName,
                            id: employee.employee.id,
                            timkeepingList: [],
                        };
                        employee.timeKeepingCs?.forEach((timeKeeping: TimeKeepingC) => {
                            let detailTimekeeping: TimeKeeping;
                            let timeKeepingDate = new Date(timeKeeping.timeKeepingDate);
                            detailTimekeeping = {
                                date: timeKeeping.timeKeepingDate,
                                day: this.dateService.getDay(
                                    timeKeepingDate.getDate(),
                                    timeKeepingDate.getMonth(),
                                    timeKeepingDate.getFullYear(),
                                ),
                                hourWork: `${timeKeeping.entryTime?.toString().split(':')[0]}:${
                                    timeKeeping.entryTime?.toString().split(':')[1]
                                } (${timeKeeping.exitTime?.toString().split(':')[0]}:${
                                    timeKeeping.exitTime?.toString().split(':')[1]
                                })`,
                                visitTime:
                                    timeKeeping.sumOfTimeCheckIn?.toString().split(':')[0] +
                                    ':' +
                                    timeKeeping.sumOfTimeCheckIn?.toString().split(':')[1],
                                checkinList: [],
                            };
                            if (!timeKeeping.checkInC) {
                                detailTimekeeping.checkinList = new Array(new Array(15).fill({ text: '' }));
                            } else {
                                timeKeeping.checkInC?.forEach((checkinInfo: CheckInC) => {
                                    let detailCheckin: any = [];
                                    detailCheckin.push(
                                        {
                                            text: checkinInfo.customer.customerCode,
                                        },
                                        {
                                            text: checkinInfo.customer.customerName,
                                        },
                                        {
                                            text: checkinInfo.customer.address,
                                        },
                                        {
                                            text: checkinInfo.customer?.customerType?.customerTypeName,
                                        },
                                        {
                                            text: checkinInfo.customer?.customerGroup?.customerGroupName,
                                        },
                                        {
                                            text: checkinInfo.customer?.phone,
                                        },
                                        {
                                            text: checkinInfo.customer?.contactName,
                                        },
                                        {
                                            text: `${checkinInfo.checkInTime.split(':')[0]}:${
                                                checkinInfo.checkInTime.split(':')[1]
                                            }:${checkinInfo.checkInTime.split(':')[2].split('.')[0]}`,
                                        },
                                        {
                                            text: `${checkinInfo.checkOutTime.split(':')[0]}:${
                                                checkinInfo.checkOutTime.split(':')[1]
                                            }:${checkinInfo.checkOutTime.split(':')[2].split('.')[0]}`,
                                        },
                                        {
                                            text:
                                                checkinInfo.timeCheckIn?.toString().split(':')[0] +
                                                ':' +
                                                checkinInfo.timeCheckIn?.toString().split(':')[1] +
                                                ':' +
                                                checkinInfo.timeCheckIn?.toString().split(':')[2].split('.')[0],
                                        },
                                        {
                                            text: checkinInfo.checkInAddress,
                                        },
                                        {
                                            text: checkinInfo.image ? `${checkinInfo.image?.length} ảnh` : '',
                                            isImage: checkinInfo.image ? true : false,
                                            id: checkinInfo.id,
                                        },
                                        {
                                            text: checkinInfo.isRoute ? 'Đúng tuyến' : 'Không đúng',
                                        },
                                        {
                                            text: checkinInfo.isOrder ? 'Đúng đơn hàng' : 'Không đúng đơn hàng',
                                        },
                                        {
                                            text: checkinInfo.note,
                                        },
                                    );
                                    detailTimekeeping.checkinList.push(detailCheckin);
                                });
                            }
                            Employee.timkeepingList.push(detailTimekeeping);
                        });
                        listEmployee.push(Employee);
                    });
                    groupFormat = {
                        groupName: group.group.unitTreeGroup_Code + group.group.name,
                        listEmployee: listEmployee,
                    };
                    DataAfterFormat.push(groupFormat);
                }
            });
        }
        return DataAfterFormat;
    }

    formatListDataDetailEmployee(data: VisitReportResponse) {
        let DataAfterFormat: FormatData[] = [];
        if (data.data) {
            data.data.forEach((group) => {
                let groupFormat: FormatData;
                let listEmployee: Employee[] = [];
                if (group.data1) {
                    group.data1?.forEach((employee: Data1) => {
                        let Employee: Employee;
                        Employee = {
                            employeeCode: employee.employee.employeeCode,
                            employeeName: employee.employee.employeeName,
                            id: employee.employee.id,
                            timkeepingList: [],
                        };
                        employee.timeKeepingCs?.forEach((timeKeeping: TimeKeepingC) => {
                            let detailTimekeeping: TimeKeeping;
                            let timeKeepingDate = new Date(timeKeeping.timeKeepingDate);
                            detailTimekeeping = {
                                date: timeKeeping.timeKeepingDate,
                                day: this.dateService.getDay(
                                    timeKeepingDate.getDate(),
                                    timeKeepingDate.getMonth(),
                                    timeKeepingDate.getFullYear(),
                                ),
                                hourWork: `${timeKeeping.entryTime?.toString().split(':')[0]}:${
                                    timeKeeping.entryTime?.toString().split(':')[1]
                                } (${timeKeeping.exitTime?.toString().split(':')[0]}:${
                                    timeKeeping.exitTime?.toString().split(':')[1]
                                })`,
                                visitTime:
                                    timeKeeping.sumOfTimeCheckIn?.toString().split(':')[0] +
                                    ':' +
                                    timeKeeping.sumOfTimeCheckIn?.toString().split(':')[1],
                                checkinList: [],
                            };
                            if (!timeKeeping.checkInC) {
                                detailTimekeeping.checkinList = new Array(new Array(12).fill({ text: '' }));
                            } else {
                                timeKeeping.checkInC?.forEach((checkinInfo: CheckInC) => {
                                    let detailCheckin: any = [];
                                    detailCheckin.push(
                                        {
                                            text: checkinInfo.customer.customerCode,
                                        },
                                        {
                                            text: checkinInfo.customer.customerName,
                                        },
                                        {
                                            text: checkinInfo.customer.address,
                                        },
                                        {
                                            text: checkinInfo.customer?.customerType?.customerTypeName,
                                        },
                                        {
                                            text: checkinInfo.customer?.customerGroup?.customerGroupName,
                                        },
                                        {
                                            text: checkinInfo.customer?.phone,
                                        },
                                        {
                                            text: checkinInfo.customer?.contactName,
                                        },
                                        {
                                            text: `${checkinInfo.checkInTime.split(':')[0]}:${
                                                checkinInfo.checkInTime.split(':')[1]
                                            }:${checkinInfo.checkInTime.split(':')[2].split('.')[0]}`,
                                        },
                                        {
                                            text: `${checkinInfo.checkOutTime.split(':')[0]}:${
                                                checkinInfo.checkOutTime.split(':')[1]
                                            }:${checkinInfo.checkOutTime.split(':')[2].split('.')[0]}`,
                                        },
                                        {
                                            text:
                                                checkinInfo.timeCheckIn?.toString().split(':')[0] +
                                                ':' +
                                                checkinInfo.timeCheckIn?.toString().split(':')[1] +
                                                ':' +
                                                checkinInfo.timeCheckIn?.toString().split(':')[2].split('.')[0],
                                        },
                                        {
                                            text: checkinInfo.checkInAddress,
                                        },
                                        {
                                            text: checkinInfo.image ? `${checkinInfo.image?.length} ảnh` : '',
                                            isImage: checkinInfo.image ? true : false,
                                            id: checkinInfo.id,
                                        },
                                        // {
                                        //     text: checkinInfo.isRoute ? 'Đúng tuyến' : 'Không đúng',
                                        // },
                                        // {
                                        //     text: checkinInfo.isOrder ? 'Đúng đơn hàng' : 'Không đúng đơn hàng',
                                        // },
                                        // {
                                        //     text: checkinInfo.note,
                                        // },
                                    );
                                    detailTimekeeping.checkinList.push(detailCheckin);
                                });
                            }
                            Employee.timkeepingList.push(detailTimekeeping);
                        });
                        listEmployee.push(Employee);
                    });
                    groupFormat = {
                        groupName: group.group.unitTreeGroup_Code + group.group.name,
                        listEmployee: listEmployee,
                    };
                    DataAfterFormat.push(groupFormat);
                }
            });
        }
        return DataAfterFormat;
    }
}
