import { AsyncPipe } from '@angular/common';
import {
    AfterViewInit,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { DetailPhotoComponent } from 'src/app/features/photos/components/detail-photo/detail-photo.component';
import { LogicServiceService } from '../../services/logicService.service';
import { DetailEmployeeComponent } from '../detail-employee/detail-employee.component';

@Component({
    selector: 'visit-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {
    @Input() body: any = {
        page: 1,
        pageSize: 5,
    };
    @Output() body$ = new EventEmitter();
    isLoading$ = this.logicService.isLoading$;
    total: number = 0;
    headers = [
        'Ngày',
        'Thứ',
        'Giờ làm',
        'Giờ VT',
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
        'Chụp ảnh',
        'Đúng tuyến',
        'Đơn hàng',
        'Ghi chú',
    ];

    subscriptions: Subscription = new Subscription();
    visitReportData: FormatData[] = [];

    constructor(
        private logicService: LogicServiceService,
        private matDialog: MatDialog,
        private asyncPipe: AsyncPipe,
    ) {}

    ngOnInit(): void {
        this.subscriptions.add(
            this.logicService.total$.subscribe((total: number) => {
                this.total = total;
            }),
        );
        this.subscriptions.add(
            this.logicService.visitReport$.subscribe((data: FormatData[]) => {
                this.visitReportData = data;
            }),
        );
    }

    ngAfterViewInit(): void {
        this.logicService.searchReport(this.body);
    }

    ngOnChanges(changes: SimpleChanges): void {
        console.log(this.body);
        this.logicService.searchReport(this.body);
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    openDetailAlbum(id: string): void {
        this.matDialog.open(DetailPhotoComponent, {
            height: '100vh',
            minWidth: '1000px',
            panelClass: 'custom-mat-dialog-container',
            autoFocus: false,
            data: id,
        });
    }

    openDetailEmployeeDialog(id: any) {
        this.matDialog.open(DetailEmployeeComponent, {
            height: '100vh',
            minWidth: '1000px',
            autoFocus: false,
            data: id,
            panelClass: 'overflow-hidden',
        });
    }

    handlePageChange(e: any) {
        this.body.page = e;
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
    id: string;
    timkeepingList: TimeKeeping[];
}

export interface TimeKeeping {
    day: string;
    date: string;
    hourWork: string;
    visitTime: string;
    checkinList: any;
}
