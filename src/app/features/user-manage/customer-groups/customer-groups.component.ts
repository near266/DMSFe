import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CustomerGroup } from 'src/app/core/model/CustomerGroup';
import { ConfirmDialogService } from 'src/app/core/services/confirmDialog.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { AddCustomerGroupsComponent } from './add-customer-groups/add-customer-groups.component';
import { CustomerGroupComponent } from './customer-group/customer-group.component';
import { CustomerGroupsService } from './services/customer-groups.service';

@Component({
    selector: 'app-customer-groups',
    templateUrl: './customer-groups.component.html',
    styleUrls: ['./customer-groups.component.scss'],
})
export class CustomerGroupsComponent implements OnInit {
    loading = true;
    sideBarWidth!: string;
    type!: string;
    selectedIds: string[] = [];
    customerGroup: CustomerGroup[] = [];
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
    totalcustomerGroups: number;

    constructor(
        public datepipe: DatePipe,
        private dialog: MatDialog,
        private snackbar: SnackbarService,
        private customerGrouplService: CustomerGroupsService,
        private confirmService: ConfirmDialogService,
    ) {}

    ngOnInit(): void {
        this.view();
    }

    view() {
        this.customerGrouplService.getAllCustomerGroup(this.request).subscribe((data) => {
            if (data) {
                this.customerGroup = data.list;
                this.totalcustomerGroups = data.list.length;
                // console.log(data);
            }
        });
    }

    AddGroup() {
        const dialogRef = this.dialog.open(AddCustomerGroupsComponent, {
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

    open(data: CustomerGroup | null = null) {
        const dialogRef = this.dialog.open(CustomerGroupComponent, {
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
        // console.log(this.keywords)
        this.request.keyword = this.keywords;
        // console.log(this.request.keywwords);

        this.customerGrouplService.searchCustomerGroup(this.request).subscribe(
            (data) => {
                this.loading = false;
                if (data) {
                    this.customerGroup = data.list;
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
            this.customerGrouplService.searchCustomerGroup(this.request).subscribe(
                (data) => {
                    this.loading = false;
                    if (data) {
                        this.customerGroup = data.list;
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
            this.customerGrouplService.searchCustomerGroup(this.request).subscribe(
                (data) => {
                    this.loading = false;
                    if (data) {
                        this.customerGroup = data.list;
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
            this.customerGrouplService.searchCustomerGroup(this.request).subscribe(
                (data) => {
                    this.loading = false;
                    if (data) {
                        this.customerGroup = data.list;
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
        this.customerGrouplService.getAllCustomerGroup(this.request).subscribe(
            (data) => {
                if (data) {
                    this.res = data.list;
                    this.customerGroup = [];
                    this.totalcustomerGroups = this.res.length;
                    this.customerGroup = data.list;
                    this.loading = false;
                } else {
                    this.loading = false;
                    this.snackbar.openSnackbar(
                        'Không tìm thấy danh sách nhóm khách hàng',
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
                    'Không tìm thấy danh sách nhóm khách hàng',
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

    DeleteCustomerGroups() {
        this.confirmService
            .open('Bạn có chắc chắn muốn xóa các nhóm khách hàng này không?', ['Có', 'Không'])
            .subscribe((data) => {
                if (data === 'Có') {
                    this.deleteCustomerGroupsByIds(this.selectedIds);
                }
            });
    }

    deleteCustomerGroupsByIds(selectedIds: string[]) {
        const body = {
            listId: selectedIds,
        };
        // console.log(body);

        let sub = this.customerGrouplService.del(body).subscribe(
            (data) => {
                if (data && data.message > 0) {
                    this.snackbar.openSnackbar(
                        'Xóa nhóm khách hàng thành công',
                        2000,
                        'Đóng',
                        'center',
                        'bottom',
                        true,
                    );
                    this.filter();
                } else {
                    this.snackbar.openSnackbar('Xóa nhóm khách hàng thất bại', 2000, 'Đóng', 'center', 'bottom', false);
                }
                sub.unsubscribe();
            },
            (error) => {
                this.snackbar.openSnackbar('Xóa nhóm khách hàng thất bại', 2000, 'Đóng', 'center', 'bottom', false);
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
            .open('Bạn có muốn xuất tất cả dữ liệu đơn vị tính không', ['Có', 'Không'])
            .subscribe((data) => {
                if (data === 'Có') {
                    this.customerGrouplService.export().subscribe(
                        (data) => {
                            const blob = new Blob([data], {
                                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                            });
                            const url = window.URL.createObjectURL(blob);
                            window.open(url);
                        },
                        (err) => {
                            this.snackbar.failureSnackBar();
                        },
                    );
                }
            });
    }
}
