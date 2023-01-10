import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogService } from 'src/app/core/services/confirmDialog.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { Supplier } from '../../product/models/product';
import { AddSupplierComponent } from './add-supplier/add-supplier.component';
import { SupplierService } from './services/supplier.service';
import { SupplierComponent } from './supplier/supplier.component';

@Component({
    selector: 'app-suppliers',
    templateUrl: './suppliers.component.html',
    styleUrls: ['./suppliers.component.scss'],
})
export class SuppliersComponent implements OnInit {
    loading = true;
    sideBarWidth!: string;
    type!: string;
    selectedIds: string[] = [];
    supplier: Supplier[] = [];
    totalCount: number;
    keywords: '';
    request: any = {
        keyword: '',
        status: null,
        page: 1,
        pageSize: 30,
    };

    res: any;
    dia?: any;
    page: number = 1;
    pageSize: number = 30;
    total: number = 0;
    totalsuppliers: number;
    isLoading: boolean = false;

    constructor(
        public datepipe: DatePipe,
        private dialog: MatDialog,
        private snackbar: SnackbarService,
        private supplierService: SupplierService,
        private confirmService: ConfirmDialogService,
    ) {}

    ngOnInit(): void {
        this.view();
    }

    view() {
        this.supplierService.getAllSupplier(this.request).subscribe((data) => {
            // console.log(data);
            if (data) {
                this.supplier = data;
                this.totalsuppliers = data.length;
            }
        });
    }

    Add() {
        const dialogRef = this.dialog.open(AddSupplierComponent, {
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

    open(data: Supplier | null = null) {
        const dialogRef = this.dialog.open(SupplierComponent, {
            width: '730px',
            height: '95vh',
            data,
            panelClass: 'custom-mat-dialog-container',
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result?.event === true) {
                this.view();
            }
        });
    }

    search(request: any) {
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
        this.supplierService.searchSupplier(this.request).subscribe(
            (data) => {
                this.loading = false;
                if (data) {
                    this.supplier = data;
                }
            },
            (error) => {
                this.loading = false;
                this.snackbar.openSnackbar(error, 2000, 'Đóng', 'center', 'bottom', true);
            },
        );
    }

    Select(e: string) {
        // console.log(this.request);
        if (e.includes('Tất cả')) {
            this.request.keyword = this.keywords;
            this.request.status = null;
            this.supplierService.searchSupplier(this.request).subscribe(
                (data) => {
                    this.loading = false;
                    if (data) {
                        this.supplier = data;
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
            this.supplierService.searchSupplier(this.request).subscribe(
                (data) => {
                    this.loading = false;
                    if (data) {
                        this.supplier = data;
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
            this.supplierService.searchSupplier(this.request).subscribe(
                (data) => {
                    this.loading = false;
                    if (data) {
                        this.supplier = data;
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
        this.supplierService.getAllSupplier(this.request).subscribe(
            (data) => {
                if (data) {
                    this.res = data;
                    this.supplier = [];
                    this.totalsuppliers = this.res.length;
                    this.supplier = data;
                    this.loading = false;
                } else {
                    this.loading = false;
                    this.snackbar.openSnackbar(
                        'Không tìm thấy danh sách nhà cung cấp',
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
                this.snackbar.openSnackbar(
                    'Không tìm thấy danh sách nhà cung cấp',
                    2000,
                    'Đóng',
                    'center',
                    'bottom',
                    false,
                );
            },
        );
    }

    change(id: string) {
        if (this.selectedIds.indexOf(id) < 0) {
            this.selectedIds.push(id);
        } else {
            this.selectedIds.splice(this.selectedIds.indexOf(id), 1);
        }
    }

    DeleteSuppliers() {
        if (this.selectedIds.length) {
            this.confirmService
                .open('Bạn có chắc chắn muốn xóa ' + this.selectedIds.length + ' nhà cung cấp không', ['Có', 'Không'])
                .subscribe((data) => {
                    if (data === 'Có') {
                        this.deleteSuppliersByIds(this.selectedIds);
                    }
                });
        }
    }

    deleteSuppliersByIds(selectedIds: string[]) {
        const body = {
            id: selectedIds,
        };
        let sub = this.supplierService.del(body).subscribe(
            (data) => {
                if (data && data.message > 0) {
                    this.snackbar.openSnackbar('Xóa nhà cung cấp thành công', 2000, 'Đóng', 'center', 'bottom', true);
                    this.filter();
                } else {
                    this.snackbar.openSnackbar('Xóa nhà cung cấp thất bại', 2000, 'Đóng', 'center', 'bottom', false);
                }
                sub.unsubscribe();
            },
            (error) => {
                this.snackbar.openSnackbar('Xóa nhà cung cấp thất bại', 2000, 'Đóng', 'center', 'bottom', false);
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

    Export() {
        this.confirmService
            .open('Bạn có muốn xuất tất cả dữ liệu nhà cung cấp không', ['Có', 'Không'])
            .subscribe((data) => {
                if (data === 'Có') {
                    this.isLoading = true;
                    this.supplierService.export().subscribe(
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
}
