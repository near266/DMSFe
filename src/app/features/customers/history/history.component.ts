import { DatePipe } from '@angular/common';
import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { CustomerService } from 'src/app/core/services/customer.service';
import { CRow } from 'src/app/core/shared/components/template-table-normal/template-table-normal.component';
import { CustomerHistory, CustomerHistoryList } from './models/customerHistory';

@Component({
    selector: 'customer-history',
    templateUrl: './history.component.html',
    styleUrls: ['./history.component.scss'],
})
export class HistoryComponent implements OnInit, AfterViewInit {
    @Input() id: string = '';
    headers = [
        'Trạng thái',
        'Mã KH',
        'Tên KH',
        'Loại KH',
        'Nhóm KH',
        'Khu vực',
        'Kênh',
        'SĐT',
        'Email',
        'Địa chỉ',
        'Ảnh',
        'Vĩ độ',
        'Kinh độ',
    ];
    rows: CRow[] = [];
    constructor(private customerService: CustomerService, private datePipe: DatePipe) {}

    ngOnInit(): void {}

    ngAfterViewInit(): void {
        this.getData();
    }

    getData() {
        this.customerService.getCustomerHistory(this.id).subscribe((data: CustomerHistory) => {
            this.formatData(data.list);
        });
    }

    formatData(data: CustomerHistoryList[]) {
        let dataAfterFormat: CRow[] = [];
        data.forEach((detail: CustomerHistoryList) => {
            let row1 = new CRow();
            let row2 = new CRow();
            // type = 0 -> Tạo, type = 1 -> Chỉnh sửa
            switch (detail.type) {
                case 0: {
                    row1 = {
                        listCol: [
                            {
                                text: `${detail.createdBy} khởi tạo khách hàng từ ${detail.source}`,
                            },
                            {
                                text: `${this.datePipe.transform(detail.createdDate, 'dd/MM/yyyy')}`,
                            },
                        ],
                        colspan: 6,
                        addClass: 'font-bold italic',
                    };
                    break;
                }
                case 1: {
                    row1 = {
                        listCol: [
                            {
                                text: `${detail.lastModifiedBy} cập nhật thông tin khách hàng từ ${detail.source}`,
                            },
                            {
                                text: `${this.datePipe.transform(detail.lastModifiedDate, 'dd/MM/yyyy')}`,
                            },
                        ],
                        colspan: 6,
                        addClass: 'font-bold italic',
                    };
                    break;
                }
            }
            row2 = {
                listCol: [
                    {
                        text: detail.status ? 'Hoạt Động' : 'Dừng hoạt động',
                        addClass: 'text-red-500',
                    },
                    {
                        text: detail.customerCode,
                    },
                    {
                        text: detail.customerName,
                    },
                    {
                        text: detail.customerType?.customerTypeName,
                    },
                    {
                        text: detail.customerGroup?.customerGroupName,
                    },
                    {
                        text: detail.area?.areaName,
                    },
                    {
                        text: detail.channel?.channelName,
                    },
                    {
                        text: detail.phone,
                    },
                    {
                        text: detail.email,
                    },
                    {
                        text: detail.address,
                    },
                    {
                        text: detail.avatar,
                    },
                    {
                        text: detail.latitude,
                    },
                    {
                        text: detail.longitude,
                    },
                ],
            };
            dataAfterFormat.push(row1, row2);
        });
        this.rows = dataAfterFormat;
    }
}
