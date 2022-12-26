import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { Data1, Employee, Group, TimeKeepingC, VisitReport, CheckInC } from '../model/VisitReport';

@Injectable({
    providedIn: 'root',
})
export class FormatDataToTableService {
    constructor(private datePipe: DatePipe) {}
    formatListData(data: { data: VisitReport[] }, totalColSpan: number) {
        let dataAfterFormat: any = data.data.map((visiReport: VisitReport) => {
            // employee Info
            let employeeList = visiReport.data1.map((data1: Data1) => {
                let listLv1Col: any[] = [];
                let lv11Row: any[] = [];
                let lv12Row: any[] = [];
                let lv13Row: any[] = [];
                let lv14Row: any[] = [];
                // timeKeepingList
                let timeKeepingList = data1.timeKeepingCs.map((timeKeeping: TimeKeepingC) => {
                    // Ngày
                    lv11Row.push(this.datePipe.transform(timeKeeping.timeKeepingDate, 'dd/MM/yyyy'));
                    // Thứ
                    lv12Row.push(this.datePipe.transform(timeKeeping.timeKeepingDate, 'dd/MM/yyyy'));
                    // Giờ làm
                    lv13Row.push('Giờ làm chưa biết lấy trường nào');
                    // Giờ VT
                    lv14Row.push('Giờ VT chưa biết lấy trường nào');
                    // chechkin List
                    let checkinList = timeKeeping.checkInC.map((checkinInfo: CheckInC) => {
                        // Giờ đồng bộ
                        return {
                            content: [
                                // Giờ đồng bộ
                                'Không biết lấy giờ đồng bộ trường nào',
                                // Mã
                                checkinInfo.customer.customerCode,
                                // Tên
                                checkinInfo.customer.customerName,
                                // Địa chỉ
                                checkinInfo.customer.address,
                                // Loại KH
                                checkinInfo.customer.customerType.customerTypeName,
                                // Nhóm KH
                                checkinInfo.customer.customerGroup.customerGroupName,
                                // SĐT
                                checkinInfo.customer.phone,
                                // Liên hệ
                                checkinInfo.customer.contactName,
                                // Check in
                                this.datePipe.transform(checkinInfo.checkInTime),
                                // Check out
                                this.datePipe.transform(checkinInfo.checkOutTime),
                                // Số giờ
                                'Chưa biết lấy số giờ trường nào',
                                // Địa chỉ checkin
                                checkinInfo.checkInAddress,
                                // Cách KH
                                'Chưa biết lấy cách KH trường nào',
                                // Cách checkin
                                'Chưa biết lấy cách checkin trường nào',
                                // Thiết bị
                                'Chưa biết lấy thiết bị trường nào',
                                // Chụp ảnh
                                'Chưa biết lấy chụp ảnh trường nào',
                                // Đúng tuyến
                                checkinInfo.isRoute,
                                // Đơn hàng
                                checkinInfo.isOrder,
                                // Ghi tồn
                                'Chưa biết ghi tồn lấy trường nào',
                                // Số km di chuyển
                                'Chưa biết lấy số km di chuyển trường nào',
                                // Ghi chú
                                checkinInfo.note,
                            ],
                        };
                    });
                    return {
                        content: [
                            // Ngày
                            this.datePipe.transform(timeKeeping.timeKeepingDate, 'dd/MM/yyyy'),
                            // Thứ
                            this.datePipe.transform(timeKeeping.timeKeepingDate, 'dd/MM/yyyy'),
                            // Giờ làm
                            'Chưa biết lấy trường nào',
                            // Giờ VT
                            'Chưa biết lấy trường nào',
                        ],
                        list: checkinList,
                    };
                });
                listLv1Col.push(lv11Row, lv12Row, lv13Row, lv14Row);
                return {
                    content: [data1.employee.employeeCode, data1.employee.employeeName],
                    list: timeKeepingList,
                    listLv1Col: listLv1Col,
                    listLv2Col: this.getListCheckin(data1.timeKeepingCs),
                };
            });
            return {
                content: [visiReport.group.name],
                list: employeeList,
            };
        });
        return dataAfterFormat;
    }

    getListCheckin(listTimeKeeping: TimeKeepingC[]) {
        let listCheckin: any[] = [];
        listTimeKeeping.forEach((timeKeeping: TimeKeepingC) => {
            // push vào mỗi dòng checkin một
            listCheckin.push(this.getColDetailLv2(timeKeeping.checkInC));
        });
        return listCheckin;
    }

    // lấy ra cột của mỗi timekeeping
    getColDetailLv2(listCheckin: CheckInC[]) {
        let rowCheckinDetail: any[] = [];
        // Giờ đồng bộ
        let col1CheckinDetail: any[] = [];
        // Mã
        let col2CheckinDetail: any[] = [];
        // Tên
        let col3CheckinDetail: any[] = [];
        // Địa chỉ
        let col4CheckinDetail: any[] = [];
        // Loại KH
        let col5CheckinDetail: any[] = [];
        // Nhóm KH
        let col6CheckinDetail: any[] = [];
        // SĐT
        let col7CheckinDetail: any[] = [];
        // Liên hệ
        let col8CheckinDetail: any[] = [];
        // Checkin
        let col9CheckinDetail: any[] = [];
        // Checkout
        let col10CheckinDetail: any[] = [];
        // Số giờ
        let col11CheckinDetail: any[] = [];
        // Địa chỉ checkin
        let col12CheckinDetail: any[] = [];
        // Cách KH
        let col13CheckinDetail: any[] = [];
        // Cách Checkin
        let col14CheckinDetail: any[] = [];
        // Thiết bị
        let col15CheckinDetail: any[] = [];
        // Chụp ảnh
        let col16CheckinDetail: any[] = [];
        // Đúng tuyến
        let col17CheckinDetail: any[] = [];
        // Đơn hàng
        let col18CheckinDetail: any[] = [];
        // Ghi tồn
        let col19CheckinDetail: any[] = [];
        // Số KM di chuyển
        let col20CheckinDetail: any[] = [];
        // Ghi chú
        let col21CheckinDetail: any[] = [];
        listCheckin.forEach((checkinInfo: CheckInC) => {
            col1CheckinDetail.push('Không biết lấy giờ đồng bộ trường nào');
            col2CheckinDetail.push(checkinInfo.customer.customerCode),
                col3CheckinDetail.push(checkinInfo.customer.customerName),
                col4CheckinDetail.push(checkinInfo.customer.address),
                col5CheckinDetail.push(checkinInfo.customer.customerType.customerTypeName),
                col6CheckinDetail.push(checkinInfo.customer.customerGroup.customerGroupName),
                col7CheckinDetail.push(checkinInfo.customer.phone),
                col8CheckinDetail.push(checkinInfo.customer.contactName),
                col9CheckinDetail.push(this.datePipe.transform(checkinInfo.checkInTime)),
                col10CheckinDetail.push(this.datePipe.transform(checkinInfo.checkOutTime)),
                col11CheckinDetail.push('Chưa biết lấy số giờ trường nào'),
                col12CheckinDetail.push(checkinInfo.checkInAddress),
                col13CheckinDetail.push('Chưa biết lấy cách KH trường nào'),
                col14CheckinDetail.push('Chưa biết lấy cách checkin trường nào'),
                col15CheckinDetail.push('Chưa biết lấy thiết bị trường nào'),
                col16CheckinDetail.push('Chưa biết lấy chụp ảnh trường nào'),
                col17CheckinDetail.push(checkinInfo.isRoute),
                col18CheckinDetail.push(checkinInfo.isOrder),
                col19CheckinDetail.push('Chưa biết ghi tồn lấy trường nào'),
                col20CheckinDetail.push('Chưa biết lấy số km di chuyển trường nào'),
                col21CheckinDetail.push(checkinInfo.note);
        });
        rowCheckinDetail.push(
            col1CheckinDetail,
            col2CheckinDetail,
            col3CheckinDetail,
            col4CheckinDetail,
            col5CheckinDetail,
            col6CheckinDetail,
            col7CheckinDetail,
            col8CheckinDetail,
            col9CheckinDetail,
            col10CheckinDetail,
            col11CheckinDetail,
            col12CheckinDetail,
            col13CheckinDetail,
            col14CheckinDetail,
            col15CheckinDetail,
            col16CheckinDetail,
            col17CheckinDetail,
            col18CheckinDetail,
            col19CheckinDetail,
            col20CheckinDetail,
            col21CheckinDetail,
        );
        return rowCheckinDetail;
    }
}
