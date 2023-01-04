import { DatePipe } from '@angular/common';
import { Component, OnInit, Input, AfterViewInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CustomerService } from 'src/app/core/services/customer.service';
import { CRow } from 'src/app/core/shared/components/template-table-normal/template-table-normal.component';
import { CustomerHistory, CustomerHistoryList } from './models/customerHistory';

@Component({
    selector: 'customer-history',
    templateUrl: './history.component.html',
    styleUrls: ['./history.component.scss'],
})
export class HistoryComponent implements OnInit, AfterViewInit, OnDestroy {
    @Input() id: string = '';
    subscription: Subscription = new Subscription();
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

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    ngAfterViewInit(): void {
        this.getData();
    }

    getData() {
        this.subscription.add(
            this.customerService.getCustomerHistory(this.id).subscribe((data: CustomerHistory) => {
                this.formatData(data.list);
            }),
        );
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
                                text: ` ${this.datePipe.transform(detail.createdDate)}`,
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
                                text: `${this.datePipe.transform(detail.lastModifiedDate)}`,
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

    countBetween(date: Date): string {
        let today = Date.now();
        let between: string = 'Vừa xong';
        const ONE_DAY = 1000 * 60 * 60 * 24;
        const ONE_HOUR = 1000 * 60 * 60;
        const ONE_MINUTE = 1000 * 60;
        let dayBetween: number = 0;
        let hourBetween: number = 0;
        let minuteBetween: number = 0;
        const differenceMs = Math.abs(today - date.getTime());
        dayBetween = Math.round(differenceMs / ONE_DAY);
        hourBetween = Math.round(differenceMs / ONE_HOUR);
        minuteBetween = Math.round(differenceMs / ONE_MINUTE);
        console.log(today, differenceMs, dayBetween, hourBetween, minuteBetween);
        if (dayBetween == 0) {
            if (hourBetween == 0) {
                if (minuteBetween == 0) {
                    between = 'Vừa xong';
                } else {
                    between = minuteBetween + ' phút trước';
                }
            } else {
                between = hourBetween + ' giờ trước';
            }
        } else {
            between = dayBetween + ' ngày trước';
        }

        return between;
    }
}
