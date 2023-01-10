import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { DataService } from 'src/app/core/services/data.service';
import { EmployeeService } from 'src/app/core/services/employee.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { ConfirmDialogService } from 'src/app/core/shared/services/confirm-dialog.service';
import { AddUserComponent } from './add-user/add-user.component';
import { DetailUserComponent } from './detail-user/detail-user.component';

@Component({
    selector: 'app-user-manage',
    templateUrl: './user-manage.component.html',
    styleUrls: ['./user-manage.component.scss'],
})
export class UserManageComponent implements OnInit {
    constructor(
        private title: Title,
        private dialog: MatDialog,
        public datePipe: DatePipe,
        private employeeService: EmployeeService,
        private dataService: DataService,
        private snackbar: SnackbarService,
        private confirm: ConfirmDialogService,
    ) {}

    users: any = [];

    pageSizeList = [30, 50, 100, 200, 500];
    pageSize = 30;
    page = 1;
    totalPage: number;
    totalCount: number;
    api = '';
    groupId = '';
    dia?: any;
    body = {
        keyword: '',
        position: 'string',
        page: this.page,
        pagesize: this.pageSize,
    };

    listId: string[] = [];

    request: any = {
        page: 1,
        pageSize: 30,
        groupId: 'root',
    };
    typeRequest: string = 'normal';

    SearchEmployee() {
        if (this.body.keyword == '') {
            this.request.keyword = null;
        } else {
            this.request.keyword = this.body.keyword;
        }
        this.filterEmployee();
    }

    AddUser() {
        this.dia = this.dialog.open(AddUserComponent, {
            height: '100vh',
            minWidth: '900px',
            panelClass: 'custom-mat-dialog-container',
        });
    }
    DetailUser(id: any, email: any) {
        this.dia = this.dialog.open(DetailUserComponent, {
            height: '100vh',
            minWidth: '900px',
            data: {
                id: id,
                status: 'view',
                login: email,
            },
            panelClass: 'custom-mat-dialog-container',
        });
    }

    searchUser(event: any) {
        this.request.groupId = event;
        this.filterEmployee();
    }

    filterEmployee() {
        let type = this.request.groupId;
        if (this.request.groupId == 'root') {
            delete this.request['groupId'];
            let sub = this.employeeService.SearchEmployee(this.request).subscribe((data) => {
                this.totalCount = data.totalCount;
                if (this.totalCount / this.pageSize > Math.round(this.totalCount / this.pageSize)) {
                    this.totalPage = Math.round(this.totalCount / this.pageSize) + 1;
                } else {
                    this.totalPage = Math.round(this.totalCount / this.pageSize);
                }
                this.users = [];
                data.data.forEach((element: any) => {
                    if (this.listId.indexOf(element.id) >= 0) {
                        element.checked = true;
                    } else {
                        element.checked = false;
                    }
                    this.users.push(element);
                });
                sub.unsubscribe();
            });
        } else {
            this.employeeService.GetEmployeeInGroup(this.request).subscribe((data) => {
                if (data) {
                    this.page = 1;
                    this.totalCount = data.totalCount;
                    if (this.totalCount / this.pageSize > Math.round(this.totalCount / this.pageSize)) {
                        this.totalPage = Math.round(this.totalCount / this.pageSize) + 1;
                    } else {
                        this.totalPage = Math.round(this.totalCount / this.pageSize);
                    }
                    this.users = [];
                    data.data.forEach((element: any) => {
                        if (this.listId.indexOf(element.id) >= 0) {
                            element.employee.checked = true;
                        } else {
                            element.employee.checked = false;
                        }
                        this.users.push(element.employee);
                    });
                }
            });
        }
        this.request.groupId = type;
    }

    closeSideBar() {
        this.class = {
            left: 'w-5',
            right: 'w-full',
            statusbar: false,
        };
    }

    openSideBar() {
        this.class = {
            left: 'w-3/12',
            right: 'w-9/12',
            statusbar: true,
        };
    }

    class = {
        left: 'w-3/12',
        right: 'w-9/12',
        statusbar: true,
    };

    ngOnInit(): void {
        this.title.setTitle('Cây đơn vị');
        this.filterEmployee();
        this.dataService.employee.subscribe((data) => {
            if (data == 'success') {
                this.filterEmployee();
                this.dia.close();
            }
        });
    }
    listMenuObj = [
        {
            title: 'Chức danh',
            leftTitleIcon: 'fa-filter',
            listMenuPosition: [
                { title: 'Tất cả', leftIcon: 'fa-check text-emerald-500', value: 'positionAll' },
                { title: 'Chủ sở hữu', leftIcon: 'fa-dollar-sign text-red-500', value: 'positionOwner' },
                { title: 'Giám sát', leftIcon: 'fa-user text-yellow-500', value: 'positionMonitor' },
                { title: 'Kế toán', leftIcon: 'fa-dollar-sign text-red-500', value: 'positionAccountant' },
                { title: 'Nhân viên', leftIcon: 'fa-person text-emerald-500', value: 'positionEmployee' },
            ],
        },
        {
            title: 'Trạng thái',
            leftTitleIcon: 'fa-flag',
            listMenuPosition: [
                { title: 'Tất cả', leftIcon: 'fa-check text-emerald-500', value: 'statusAll' },
                { title: 'Hoạt động', leftIcon: '', value: 'statusActive' },
                { title: 'Không hoạt động', leftIcon: '', value: 'statusInActive' },
            ],
        },
        {
            title: 'Tải lại',
            leftTitleIcon: 'fa-arrows-rotate',
            listMenuPosition: [
                { title: 'Danh sách nhân viên', leftIcon: 'fa-bars text-emerald-500', value: 'reload' },
                // { title: 'Cây đơn vị', leftIcon: '', value: 'act' },
            ],
        },
        {
            title: 'Nhập dữ liệu',
            leftTitleIcon: 'fa-upload',
            listMenuPosition: [
                { title: 'Thêm phòng ban nhân viên', leftIcon: 'fa-bars text-emerald-500', value: 'all' },
                { title: 'Cập nhật lại thông tin nhân viên', leftIcon: 'fa-gear text-emerald-500', value: 'act' },
                {
                    title: 'Cập nhật lại văn phòng chấm công thời gian',
                    leftIcon: 'fa-location-dot text-emerald-500',
                    value: 'act',
                },
            ],
        },
    ];
    listMenuObj2 = [
        {
            title: 'Thao tác nhiều',
            leftTitleIcon: 'fa-grid',
            listMenuPosition: [
                { title: 'Xóa tài khoản', leftIcon: 'fa-user-xmark text-emerald-500', value: 'all' },
                { title: 'Khóa tài khoản', leftIcon: 'fa-lock text-emerald-500', value: 'emp-lock' },
                { title: 'Mở khóa tài khoản', leftIcon: 'fa-unlock text-emerald-500', value: 'emp-unlock' },
            ],
        },
    ];

    Select(e: any) {
        switch (e) {
            case 'positionAll': {
                this.request.title = null;
                this.filterEmployee();
                break;
            }
            case 'positionOwner': {
                this.request.title = 'Chủ sở hữu';
                this.filterEmployee();
                break;
            }
            case 'positionMonitor': {
                this.request.title = 'Giám sát';
                this.filterEmployee();
                break;
            }
            case 'positionAccountant': {
                this.request.title = 'Kế toán';
                this.filterEmployee();
                break;
            }
            case 'positionEmployee': {
                this.request.title = 'Nhân viên';
                this.filterEmployee();
                break;
            }
            case 'statusAll': {
                this.request.status = null;
                this.filterEmployee();
                break;
            }
            case 'statusActive': {
                this.request.status = true;
                this.filterEmployee();
                break;
            }
            case 'statusInActive': {
                this.request.status = false;
                this.filterEmployee();
                break;
            }
            case 'reload': {
                this.request.page = 1;
                this.page = 1;
                this.filterEmployee();
                break;
            }
            case 'emp-lock': {
                let ref = this.confirm.openDialog({
                    message: 'Bạn có chắc chắn muốn khóa tài khoản này?',
                    confirm: 'Đồng ý',
                    cancel: 'Hủy',
                });
                ref.subscribe((res) => {
                    if (res) {
                        const body = {
                            listId: this.listId,
                            activated: false,
                        };
                        this.employeeService.DisableEmployee(body).subscribe(
                            (data) => {
                                if (data) {
                                    this.snackbar.openSnackbar(
                                        'Khóa tài khoản thành công',
                                        2000,
                                        'Đóng',
                                        'center',
                                        'bottom',
                                        true,
                                    );
                                    this.filterEmployee();
                                } else {
                                    this.snackbar.openSnackbar(
                                        'Khóa tài khoản thất bại',
                                        2000,
                                        'Đóng',
                                        'center',
                                        'bottom',
                                        false,
                                    );
                                }
                            },
                            (error) => {
                                this.snackbar.openSnackbar(
                                    'Khóa tài khoản thất bại',
                                    2000,
                                    'Đóng',
                                    'center',
                                    'bottom',
                                    false,
                                );
                            },
                        );
                    }
                });
                return;
            }
            case 'emp-unlock': {
                let ref = this.confirm.openDialog({
                    message: 'Bạn có chắc chắn muốn mở tài khoản này?',
                    confirm: 'Đồng ý',
                    cancel: 'Hủy',
                });
                ref.subscribe((res) => {
                    if (res) {
                        const body = {
                            listId: this.listId,
                            activated: true,
                        };
                        this.employeeService.DisableEmployee(body).subscribe(
                            (data) => {
                                if (data) {
                                    this.snackbar.openSnackbar(
                                        'Mở tài khoản thành công',
                                        2000,
                                        'Đóng',
                                        'center',
                                        'bottom',
                                        true,
                                    );
                                    this.filterEmployee();
                                } else {
                                    this.snackbar.openSnackbar(
                                        'Mở tài khoản thất bại',
                                        2000,
                                        'Đóng',
                                        'center',
                                        'bottom',
                                        false,
                                    );
                                }
                            },
                            (error) => {
                                this.snackbar.openSnackbar(
                                    'Mở tài khoản thất bại',
                                    2000,
                                    'Đóng',
                                    'center',
                                    'bottom',
                                    false,
                                );
                            },
                        );
                    }
                });
                return;
            }
        }
    }

    TickEmployee(id: string) {
        if (this.listId.indexOf(id) >= 0) {
            this.listId.splice(this.listId.indexOf(id), 1);
        } else {
            this.listId.push(id);
        }
    }

    ChangePage(e: any) {
        this.page = e;
        this.request.page = this.page;
        this.filterEmployee();
    }

    ChangePageSize() {
        if (this.page * this.pageSize > this.totalCount) {
            this.page = 1;
            this.request.page = this.page;
        }
        this.filterEmployee();
    }

    Export() {
        this.confirm
            .openDialog({
                message: 'Bạn có chắc chắn muốn xuất dữ liệu tất cả nhân viên không?',
                confirm: 'Đồng ý',
                cancel: 'Hủy',
            })
            .subscribe((data) => {
                this.employeeService.export().subscribe(
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
            });
    }
}
