import { Component, OnInit, AfterViewInit } from '@angular/core';
import { JGData } from '../../mocks/fake';
import { Headers } from '../../model/header';
import { FormatDataToTableService } from '../../services/formatDataToTable.service';
import { LogicServiceService } from '../../services/logicService.service';

@Component({
    selector: 'visit-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit, AfterViewInit {
    headers = [
        'Ngày',
        'Thứ',
        'Giờ làm',
        'Giờ VT',
        'Giờ đồng bộ',
        'Mã KH',
        'Tên KH',
        'Địa chỉ KH',
        'Loại KH',
        'Nhóm KH',
        'SĐT',
        'Liên hệ',
        'Checkin',
        'Checkout',
        'Số giờ',
        'Địa chỉ checkin',
        'Cách KH',
        'Cách Checkin',
        'Thiết bị',
        'Chụp ảnh',
        'Đúng tuyến',
        'Đơn hàng',
        'Ghi tồn',
        'Số KM di chuyển',
        'Ghi chú',
    ];
    data: FormatData[] = [
        {
            groupName: 'Nhóm 1 Nhóm 1Nhóm 1Nhóm 1Nhóm 1Nhóm 1',
            listEmployee: [
                {
                    employeeCode: 'NV1',
                    employeeName: 'Trần Minh Quang',
                    timkeepingList: [
                        {
                            day: 'Ngày 1',
                            date: 'Thứ 1',
                            hourWork: 12,
                            checkinList: [
                                [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
                                [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
                                ,
                            ],
                        },
                    ],
                },
                {
                    employeeCode: 'NV1',
                    employeeName: 'Trần Minh Quang',
                    timkeepingList: [
                        {
                            day: 'Ngày 1',
                            date: 'Thứ 1',
                            hourWork: 12,
                            checkinList: [
                                [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
                                [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
                                ,
                            ],
                        },
                    ],
                },
            ],
        },
    ];
    visitReport$ = this.logicService.visitReport$;
    isLoading$ = this.logicService.isLoading$;
    body: any = {
        employeeId: '766b83cc-4787-4b9e-816e-1ec0e5dfd1ed',
        page: 1,
        pageSize: 5,
    };
    constructor(private logicService: LogicServiceService) {}

    ngOnInit(): void {}

    ngAfterViewInit(): void {
        this.logicService.searchReport(this.body);
    }
}

export interface FormatData {
    groupName: string;
    listEmployee: Employee[];
}

export interface Employee {
    employeeCode: string;
    employeeName: string;
    timkeepingList: TimeKeeping[];
}

export interface TimeKeeping {
    day: string;
    date: string;
    hourWork: number;
    checkinList: any;
}
