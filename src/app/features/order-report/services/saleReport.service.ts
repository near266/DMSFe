import { Injectable } from '@angular/core';
import { ConfirmDialogService } from 'src/app/core/services/confirmDialog.service';
import { ReportService } from 'src/app/core/services/report.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';

@Injectable({
    providedIn: 'root',
})
export class SaleReportService {
    constructor(
        private confirmService: ConfirmDialogService,
        private reportService: ReportService,
        private snackBar: SnackbarService,
    ) {}
    exportGross(body: any, total: number) {
        if (total) {
            this.confirmService.open(`Bạn có muốn xuất ${total} bản ghi không?`, ['Xuất', 'Hủy']).subscribe((data) => {
                if (data === 'Xuất') {
                    this.reportService.SaleReceiptExportGross(body).subscribe(
                        (data) => {
                            const blob = new Blob([data], {
                                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                            });
                            const url = window.URL.createObjectURL(blob);
                            window.open(url);
                        },
                        (err) => {
                            this.snackBar.failureSnackBar();
                        },
                    );
                } else {
                }
            });
        }
    }

    exportNotGross(body: any, total: number) {
        if (total) {
            this.confirmService.open(`Bạn có muốn xuất ${total} bản ghi không?`, ['Xuất', 'Hủy']).subscribe((data) => {
                if (data === 'Xuất') {
                    this.reportService.SaleReceiptExportNotGross(body).subscribe(
                        (data) => {
                            const blob = new Blob([data], {
                                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                            });
                            const url = window.URL.createObjectURL(blob);
                            window.open(url);
                        },
                        (err) => {
                            this.snackBar.failureSnackBar();
                        },
                    );
                } else {
                }
            });
        }
    }
}
