import { Component, OnInit, Inject, AfterViewInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { DetailPhotoComponent } from 'src/app/features/photos/components/detail-photo/detail-photo.component';
import { LogicServiceService } from '../../services/logicService.service';
import { FormatData } from '../table/table.component';

@Component({
    selector: 'app-detail-employee',
    templateUrl: './detail-employee.component.html',
    styleUrls: ['./detail-employee.component.scss'],
})
export class DetailEmployeeComponent implements OnInit, AfterViewInit, OnDestroy {
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: string,
        private logicService: LogicServiceService,
        private matDialog: MatDialog,
        public dialogRef: MatDialogRef<DetailEmployeeComponent>,
    ) {}
    body: any = {
        page: 1,
        pageSize: 1,
    };
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
    ];
    visitReportData: FormatData[] = [];
    isLoading$ = this.logicService.isLoading$;
    subscriptions: Subscription = new Subscription();

    ngOnInit(): void {
        this.body.employeeId = this.data;
        this.logicService.searchDetailReport(this.body);
        this.subscriptions.add(
            this.logicService.visitReportDetail$.subscribe((data) => {
                this.visitReportData = data;
            }),
        );
    }

    ngAfterViewInit(): void {}

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

    close() {
        this.dialogRef.close();
    }
}
