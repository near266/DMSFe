import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { DateService } from '../../timekeeping/services/date.service';
import { FormatData, Employee, TimeKeeping } from '../component/table/table.component';
import { Data1, Group, TimeKeepingC, VisitReport, CheckInC } from '../model/VisitReport';

@Injectable({
    providedIn: 'root',
})
export class FormatDataToTableService {
    constructor(private datePipe: DatePipe, private dateService: DateService) {}
    formatListData(data: { data: VisitReport[] }) {
        let DataAfterFormat: FormatData[] = [];
        if (data) {
            data.data.forEach((group) => {
                let groupFormat: FormatData;
                let listEmployee: Employee[] = [];
                if (group.data1) {
                    group.data1?.forEach((employee: Data1) => {
                        let Employee: Employee;
                        Employee = {
                            employeeCode: employee.employee.employeeCode,
                            employeeName: employee.employee.employeeName,
                            timkeepingList: [],
                        };
                        employee.timeKeepingCs?.forEach((timeKeeping: TimeKeepingC) => {
                            let detailTimekeeping: TimeKeeping;
                            let timeKeepingDate = new Date(timeKeeping.timeKeepingDate);
                            console.log(new Date(timeKeeping.timeKeepingDate).getDate().toString());
                            detailTimekeeping = {
                                date: timeKeeping.timeKeepingDate,
                                day: this.dateService.getDay(
                                    timeKeepingDate.getDate(),
                                    timeKeepingDate.getMonth(),
                                    timeKeepingDate.getFullYear(),
                                ),
                                hourWork: 12,
                                checkinList: new Array(new Array(22)),
                            };
                            timeKeeping.checkInC?.forEach((checkinInfo: CheckInC) => {
                                let detailCheckin: any = [];
                                detailCheckin.push(
                                    checkinInfo.customer.customerName,
                                    checkinInfo.customer.address,
                                    checkinInfo.customer?.customerType?.customerTypeName,
                                    checkinInfo.customer?.customerGroup?.customerGroupName,
                                    checkinInfo.customer?.phone,
                                    checkinInfo.customer?.contactName,
                                    this.datePipe.transform(checkinInfo.checkInTime),
                                    this.datePipe.transform(checkinInfo.checkOutTime),
                                    'Chưa biết lấy số giờ trường nào',
                                    checkinInfo.checkInAddress,
                                    'Chưa biết lấy cách KH trường nào',
                                    'Chưa biết lấy cách checkin trường nào',
                                    'Chưa biết lấy thiết bị trường nào',
                                    'Chưa biết lấy chụp ảnh trường nào',
                                    checkinInfo.isRoute,
                                    checkinInfo.isOrder,
                                    'Chưa biết ghi tồn lấy trường nào',
                                    'Chưa biết lấy số km di chuyển trường nào',
                                    checkinInfo.note,
                                    checkinInfo.note,
                                    checkinInfo.note,
                                    checkinInfo.note,
                                );
                                detailTimekeeping.checkinList.push(detailCheckin);
                            });
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
        console.log(DataAfterFormat);
        return DataAfterFormat;
    }
}
