import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogService } from 'src/app/core/services/confirmDialog.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { Unit } from '../../product/models/product';
import { TypeExport } from '../common/common.service';
import { AddnitComponent } from './addnit/addnit.component';
import { DetailUnitComponent } from './detail-unit/detail-unit.component';
import { UnitService } from './services/unit.service';

@Component({
    selector: 'app-units',
    templateUrl: './units.component.html',
    styleUrls: ['./units.component.scss'],
})
export class UnitsComponent implements OnInit {
    loading = true;
    sideBarWidth!: string;
    type!: string;
    selectedIds: string[] = [];
    unit: Unit[] = [];
    totalCount: number;
    keywords: '';
    request: any = {
        keyword: '',
        status: true,
        page: 1,
        pageSize: 30,
    };

    res: any;
    dia?: any;
    page: number = 1;
    pageSize: number = 30;
    total: number = 0;
    totalunits: number;
    isLoading: boolean = false;

    constructor(
        public datepipe: DatePipe,
        private dialog: MatDialog,
        private unitService: UnitService,
        private snackbar: SnackbarService,
        private confirmService: ConfirmDialogService,
    ) {}

    ngOnInit(): void {
        this.view();
    }

    view() {
        this.unitService.getAllUnits().subscribe((data) => {
            // console.log(this.unit);
            if (data) {
                this.unit = data;
                this.totalunits = data.length;
            }
        });
    }

    AddUnit() {
        const dialogRef = this.dialog.open(AddnitComponent, {
            height: '100vh',
            minWidth: '900px',
            panelClass: 'custom-mat-dialog-container',
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result?.event === true) {
                this.view();
            }
        });
    }

    open(data: Unit | null = null) {
        const dialogRef = this.dialog.open(DetailUnitComponent, {
            width: '730px',
            height: '90vh',
            data,
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result?.event === true) {
                this.view();
            }
        });
    }

    search(request: any) {
        console.log(123);
        this.loading = true;
        if (request) {
            request = ('' + request).trim();
        }
        if (request == null || request == undefined) {
            this.keywords = '';
        } else {
            this.keywords = request;
        }
        this.request.keyword = this.keywords;
        this.unitService.searchUnit(this.request).subscribe(
            (data) => {
                this.loading = false;
                if (data) {
                    this.unit = data;
                    this.totalunits = data.length;
                }
            },
            (error) => {
                this.loading = false;
                this.snackbar.openSnackbar(error, 2000, 'Đóng', 'center', 'bottom', true);
            },
        );
    }

    Select(e: string) {
        this.selectedIds = [];
        // console.log(this.request);
        if (e.includes('Tất cả')) {
            this.request.keyword = this.keywords;
            this.request.status = null;
            this.unitService.searchUnit(this.request).subscribe(
                (data) => {
                    this.loading = false;
                    if (data) {
                        this.unit = data;
                        this.totalunits = data.length;
                    }
                },
                (error) => {
                    this.loading = false;
                    this.snackbar.openSnackbar(error, 2000, 'Đóng', 'center', 'bottom', true);
                },
            );
            return;
        } else if (e.includes('Hoạt động')) {
            this.request.keyword = this.keywords;
            this.request.status = true;
            this.unitService.searchUnit(this.request).subscribe(
                (data) => {
                    this.loading = false;
                    if (data) {
                        this.unit = data;
                        this.totalunits = data.length;
                    }
                },
                (error) => {
                    this.loading = false;
                    this.snackbar.openSnackbar(error, 2000, 'Đóng', 'center', 'bottom', true);
                },
            );
            return;
        } else if (e.includes('Khóa')) {
            this.request.keyword = this.keywords;
            this.request.status = false;
            this.unitService.searchUnit(this.request).subscribe(
                (data) => {
                    this.loading = false;
                    if (data) {
                        this.unit = data;
                        this.totalunits = data.length;
                    }
                },
                (error) => {
                    this.loading = false;
                    this.snackbar.openSnackbar(error, 2000, 'Đóng', 'center', 'bottom', true);
                },
            );
            return;
        }
    }

    // sortByType(key: string) {
    //   this.request.type = key;
    //   if(this.request.startedDate && this.request.endDate) {
    //     this.search('');
    //   }
    // }

    // sortByField(key: string) {
    //   let sort = key.split('-');
    //   this.request.sortFeild = sort[0];
    //   this.request.sortValue = sort[1];
    //   if (this.request.sortValue == 'up') this.request.sortValue = true;
    //   if (this.request.sortValue == 'down') this.request.sortValue = false;
    //   this.search(key);
    // }

    filter() {
        this.loading = true;
        this.unitService.getAllUnits().subscribe(
            (data) => {
                if (data) {
                    this.res = data;
                    this.unit = [];
                    this.totalunits = this.res.length;
                    this.unit = data;
                    this.loading = false;
                } else {
                    this.loading = false;
                    this.snackbar.openSnackbar(
                        'Không tìm thấy danh sách đơn vị',
                        2000,
                        'Đóng',
                        'center',
                        'bottom',
                        false,
                    );
                }
            },
            (error) => {
                this.loading = false;
                this.snackbar.openSnackbar('Không tìm thấy danh sách đơn vị', 2000, 'Đóng', 'center', 'bottom', false);
            },
        );
    }

    change(id: string, unit: any, e: any) {
        console.log(e.target.checked);
        if (e.target.checked) {
            unit.checked = true;
        } else {
            unit.checked = false;
        }
        if (this.selectedIds.indexOf(id) < 0) {
            this.selectedIds.push(id);
        } else {
            this.selectedIds.splice(this.selectedIds.indexOf(id), 1);
        }
    }

    selectAll(e: any) {
        if (e.target.checked) {
            this.selectedIds = [];
            this.unit.forEach((unit: Unit) => {
                unit.checked = true;
                this.selectedIds.push(unit.id!);
            });
        } else {
            this.unit.forEach((unit: Unit) => {
                unit.checked = false;
            });
            this.selectedIds = [];
        }
    }

    DeleteUnits() {
        if (this.selectedIds.length > 0) {
            this.confirmService
                .open(`Bạn có chắc chắn muốn xóa ${this.selectedIds.length} đơn vị tính không?`, ['Có', 'Không'])
                .subscribe((data) => {
                    if (data === 'Có') {
                        this.deleteUnitsByIds(this.selectedIds);
                    }
                });
        }
    }

    Export(type: number, data$: any, message: string) {
        this.confirmService.open(message, ['Có', 'Không']).subscribe((data) => {
            if (data === 'Có') {
                this.isLoading = true;
                this.unitService.export(type, data$).subscribe(
                    (data) => {
                        const blob = new Blob([data], {
                            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                        });
                        const url = window.URL.createObjectURL(blob);
                        window.open(url);
                        this.isLoading = false;
                    },
                    (err) => {
                        this.snackbar.failureSnackBar();
                    },
                );
            }
        });
    }

    deleteUnitsByIds(selectedIds: string[]) {
        const body = {
            id: selectedIds,
        };
        let sub = this.unitService.del(body).subscribe(
            (data) => {
                if (data && data.message > 0) {
                    this.snackbar.openSnackbar('Xóa đơn vị thành công', 2000, 'Đóng', 'center', 'bottom', true);
                    this.filter();
                } else {
                    this.snackbar.openSnackbar('Xóa đơn vị thất bại', 2000, 'Đóng', 'center', 'bottom', false);
                }
                sub.unsubscribe();
            },
            (error) => {
                this.snackbar.openSnackbar('Xóa đơn vị thất bại', 2000, 'Đóng', 'center', 'bottom', false);
                sub.unsubscribe();
            },
        );
    }

    listMenuObj = [
        {
            title: 'Trạng thái',
            leftTitleIcon: 'fa-filter',
            listMenuPosition: [
                { title: 'Tất cả', leftIcon: '', value: 'Tất cả' },
                { title: 'Hoạt động', leftIcon: '', value: 'Hoạt động' },
                { title: 'Khóa', leftIcon: '', value: 'Khóa' },
            ],
        },
    ];

    exportMenu = {
        title: 'Xuất dữ liệu',
        leftTitleIcon: 'fa-file-export',
        listMenuPosition: [
            { title: 'Được chọn', leftIcon: 'fa-circle-check', value: 'Được chọn' },
            { title: 'Điều kiện tìm', leftIcon: 'fa-filter', value: 'Điều kiện tìm' },
        ],
    };

    handleEmitMessage(e: any) {
        switch (e) {
            case 'Được chọn': {
                if (this.selectedIds.length) {
                    this.Export(
                        TypeExport.Selected,
                        this.selectedIds,
                        `Bạn có muốn xuất ${this.selectedIds.length} đơn vị tính không?`,
                    );
                }
                break;
            }
            case 'Điều kiện tìm': {
                if (this.totalunits) {
                    this.Export(
                        TypeExport.Filter,
                        this.request,
                        `Bạn có muốn xuất ${this.totalunits} đơn vị tính không?`,
                    );
                }
                break;
            }
        }
    }
}
