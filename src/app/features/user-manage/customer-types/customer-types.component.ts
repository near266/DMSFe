import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CustomerType } from 'src/app/core/model/CustomerType';
import { ConfirmDialogService } from 'src/app/core/services/confirmDialog.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { AddCustomerTypeComponent } from './add-customer-type/add-customer-type.component';
import { CustomerTypeComponent } from './customer-type/customer-type.component';
import { CustomerTypeService } from './services/customer-type.service';

@Component({
    selector: 'app-customer-types',
    templateUrl: './customer-types.component.html',
    styleUrls: ['./customer-types.component.scss'],
})
export class CustomerTypesComponent implements OnInit {
    loading = true;
    sideBarWidth!: string;
    type!: string;
    selectedIds: string[] = [];
    customerType: CustomerType[] = [];
    totalCount: number;
    keywords: '';
    request: any = {
        keyword: '',
        status: null,
        page: 1,
        pageSize: 30,
    };
    isLoading: boolean = false;

    res: any;
    dia?: any;
    page: number = 1;
    pageSize: number = 30;
    total: number = 0;
    totalcustomerTypes: number;

    constructor(
        public datepipe: DatePipe,
        private dialog: MatDialog,
        private snackbar: SnackbarService,
        private customerTypeService: CustomerTypeService,
        private confirmService: ConfirmDialogService,
    ) {}

    ngOnInit(): void {
        this.view();
    }

    view() {
        this.customerTypeService.getAllCustomerType(this.request).subscribe((data) => {
            if (data) {
                this.customerType = data.list;
                this.totalcustomerTypes = data.list.length;
                // console.log(data);
            }
        });
    }

    AddType() {
        const dialogRef = this.dialog.open(AddCustomerTypeComponent, {
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

    open(data: CustomerType | null = null) {
        const dialogRef = this.dialog.open(CustomerTypeComponent, {
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
        this.customerTypeService.searchCustomerType(this.request).subscribe(
            (data) => {
                this.loading = false;
                if (data) {
                    this.customerType = data.list;
                }
            },
            (error) => {
                this.loading = false;
                this.snackbar.openSnackbar(error, 2000, 'Đóng', 'center', 'bottom', true);
            },
        );
    }

    Select(e: string) {
        if (e.includes('Tất cả')) {
            this.request.keyword = this.keywords;
            this.request.status = null;
            this.customerTypeService.searchCustomerType(this.request).subscribe(
                (data) => {
                    this.loading = false;
                    if (data) {
                        this.customerType = data.list;
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
            this.customerTypeService.searchCustomerType(this.request).subscribe(
                (data) => {
                    this.loading = false;
                    if (data) {
                        this.customerType = data.list;
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
            this.customerTypeService.searchCustomerType(this.request).subscribe(
                (data) => {
                    this.loading = false;
                    if (data) {
                        this.customerType = data.list;
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
        this.customerTypeService.getAllCustomerType(this.request).subscribe(
            (data) => {
                if (data) {
                    this.res = data.list;
                    this.customerType = [];
                    this.totalcustomerTypes = this.res.length;
                    this.customerType = data.list;
                    this.loading = false;
                } else {
                    this.loading = false;
                    this.snackbar.openSnackbar(
                        'Không tìm thấy danh sách loại khách hàng',
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
                    'Không tìm thấy danh sách loại khách hàng',
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

    DeleteCustomerTypes() {
        this.confirmService
            .open('Bạn có chắc chắn muốn xóa các loại khách hàng này không', ['Có', 'Không'])
            .subscribe((data) => {
                if (data === 'Có') {
                    this.deleteCustomerTypesByIds(this.selectedIds);
                }
            });
    }

    deleteCustomerTypesByIds(selectedIds: string[]) {
        const body = {
            listId: selectedIds,
        };
        // console.log(body);

        let sub = this.customerTypeService.del(body).subscribe(
            (data) => {
                if (data && data.message > 0) {
                    this.snackbar.openSnackbar(
                        'Xóa loại khách hàng thành công',
                        2000,
                        'Đóng',
                        'center',
                        'bottom',
                        true,
                    );
                    this.filter();
                } else {
                    this.snackbar.openSnackbar('Xóa loại khách hàng thất bại', 2000, 'Đóng', 'center', 'bottom', false);
                }
                sub.unsubscribe();
            },
            (error) => {
                this.snackbar.openSnackbar('Xóa loại khách hàng thất bại', 2000, 'Đóng', 'center', 'bottom', false);
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
            .open('Bạn có muốn xuất tất cả dữ liệu loại khách hàng không', ['Có', 'Không'])
            .subscribe((data) => {
                if (data === 'Có') {
                    this.isLoading = true;
                    this.customerTypeService.export().subscribe(
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
