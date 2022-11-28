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
        private confirm: ConfirmDialogService
    ) { }

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
        position: "string",
        page: this.page,
        pagesize: this.pageSize
    }

    listId: string[] = [];

    SearchEmployee() {
        let sub = this.employeeService.SearchEmployee(this.body).subscribe(data => {
            this.totalCount = data.totalCount
            if (this.totalCount / this.pageSize > Math.round(this.totalCount / this.pageSize)) {
                this.totalPage = Math.round(this.totalCount / this.pageSize) + 1;
            }
            else {
                this.totalPage = Math.round(this.totalCount / this.pageSize)
            }
            this.users = []
            data.data.forEach((element: any) => {
              if (this.listId.indexOf(element.id) >= 0) {
                element.checked = true;
              } else {
                element.checked = false;
              }
              this.users.push(element)
            });
            sub.unsubscribe()
        })
    }

    AddUser() {
        this.dia = this.dialog.open(AddUserComponent, {
            height: '100vh',
            minWidth: '900px',
            panelClass: 'custom-mat-dialog-container'
        });
    }
    DetailUser(id: any, email: any) {
        this.dia = this.dialog.open(DetailUserComponent, {
            height: '100vh',
            minWidth: '900px',
            data: {
                id: id,
                status: 'view',
                login: email
            },
            panelClass: 'custom-mat-dialog-container'
        });
    }

    searchUser(event: any) {
        if (event != 'root') {
            this.employeeService.SearchEmployeeInGroup(event, 1, 1000).subscribe(data => {
                if (data) {
                    this.page = 1;
                    this.totalCount = data.totalCount;
                    if (this.totalCount / this.pageSize > Math.round(this.totalCount / this.pageSize)) {
                        this.totalPage = Math.round(this.totalCount / this.pageSize) + 1;
                    }
                    else {
                        this.totalPage = Math.round(this.totalCount / this.pageSize)
                    }
                    this.users = []
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
        } else {
            let sub = this.employeeService.GetAllEmployee(1, this.pageSize).subscribe(data => {
                this.totalCount = data.totalCount
                if (this.totalCount / this.pageSize > Math.round(this.totalCount / this.pageSize)) {
                    this.totalPage = Math.round(this.totalCount / this.pageSize) + 1;
                }
                else {
                    this.totalPage = Math.round(this.totalCount / this.pageSize)
                }
                this.users = []
                data.data.forEach((element: any) => {
                  if (this.listId.indexOf(element.id) >= 0) {
                    element.checked = true;
                  } else {
                    element.checked = false;
                  }
                  this.users.push(element)
                });
                sub.unsubscribe()
            })
        }
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
        this.GetListAll()
        this.dataService.employee.subscribe(data => {
            if (data == 'success') {
                this.GetListAll()
                this.dia.close()
            }
        })
    }
    listMenuObj = [
        {
            title: 'Chức danh',
            leftTitleIcon: 'fa-filter',
            listMenuPosition: [
                { title: 'Tất cả', leftIcon: 'fa-check text-emerald-500', value: 'all' },
                { title: 'Nhân viên', leftIcon: 'fa-person text-emerald-500', value: 'emp' },
                { title: 'Nhân viên gói Basic', leftIcon: 'fa-person text-emerald-500', value: 'emp-basic' },
                { title: 'Kế toán', leftIcon: 'fa-dollar-sign text-red-500', value: 'ketoan' },
                { title: 'Giám sát', leftIcon: 'fa-user text-yellow-500', value: 'giamsat' },
                { title: 'Chủ sở hữu', leftIcon: 'fa-dollar-sign text-red-500', value: 'ketoan' },
            ],
        },
        {
            title: 'Trạng thái',
            leftTitleIcon: 'fa-flag',
            listMenuPosition: [
                { title: 'Tất cả', leftIcon: 'fa-check text-emerald-500', value: 'all' },
                { title: 'Hoạt động', leftIcon: '', value: 'act' },
                { title: 'Khóa mật khẩu', leftIcon: '', value: 'lockpass' },
                { title: 'Khóa tài khoản', leftIcon: '', value: 'lockacc' },
            ],
        },
        {
            title: 'Tải lại',
            leftTitleIcon: 'fa-arrows-rotate',
            listMenuPosition: [
                { title: 'Danh sách nhân viên', leftIcon: 'fa-bars text-emerald-500', value: 'all' },
                { title: 'Cây đơn vị', leftIcon: '', value: 'act' },
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
                { title: 'Chuyển tài khoản sang email fake', leftIcon: 'fa-user-xmark text-emerald-500', value: 'all' },
                { title: 'Xóa tài khoản', leftIcon: 'fa-user-xmark text-emerald-500', value: 'all' },
                { title: 'Logout tài khoản web/mobile', leftIcon: 'fa-user-xmark text-emerald-500', value: 'all' },
                { title: 'Khóa tài khoản', leftIcon: 'fa-lock text-emerald-500', value: 'emp-lock' },
                { title: 'Mở khóa tài khoản', leftIcon: 'fa-unlock text-emerald-500', value: 'emp-unlock' },
                { title: 'Cài đặt bảo mật', leftIcon: 'fa-circle-exclamation text-emerald-500', value: 'ketoan' },
                { title: 'Cài đặt phân quyền', leftIcon: 'fa-user text-emerald-500', value: 'giamsat' },
                { title: 'Cấu hình mobile', leftIcon: 'fa-mobile text-emerald-500', value: 'ketoan' },
                { title: 'Cài đặt menu hiển thị', leftIcon: 'fa-gear text-emerald-500', value: 'ketoan' },
            ],
        },
        {
            title: 'Trạng thái',
            leftTitleIcon: 'fa-log',
            listMenuPosition: [{ title: 'Thông tin tổ chức', leftIcon: 'fa-gears text-emerald-500', value: 'all' }],
        },
    ];

    GetListAll() {
        let sub = this.employeeService.GetAllEmployee(this.page, this.pageSize).subscribe(data => {
            this.totalCount = data.totalCount;
            if (this.totalCount / this.pageSize > Math.round(this.totalCount / this.pageSize)) {
                this.totalPage = Math.round(this.totalCount / this.pageSize) + 1;
            }
            else {
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
        })
    }

    Select(e: any) {
      switch(e) {
        case 'emp-lock': {
          let ref = this.confirm.openDialog({message: 'Bạn có chắc chắn muốn khóa tài khoản này?', confirm: 'Đồng ý', cancel: 'Hủy'});
          ref.subscribe( res => {
            if (res) {
              const body = {
                listId: this.listId,
                activated: false
              };
              this.employeeService.DisableEmployee(body).subscribe( data => {
                if(data) {
                  this.snackbar.openSnackbar('Khóa tài khoản thành công', 2000, 'Đóng', 'center', 'bottom', true);
                  this.GetListAll();
                } else {
                  this.snackbar.openSnackbar('Khóa tài khoản thất bại', 2000, 'Đóng', 'center', 'bottom', false);
                }
              }, (error) => {
                this.snackbar.openSnackbar('Khóa tài khoản thất bại', 2000, 'Đóng', 'center', 'bottom', false);
              });
            }
          });
          return;
        }
        case 'emp-unlock': {
          let ref = this.confirm.openDialog({message: 'Bạn có chắc chắn muốn mở tài khoản này?', confirm: 'Đồng ý', cancel: 'Hủy'});
          ref.subscribe( res => {
            if (res) {
              const body = {
                listId: this.listId,
                activated: true
              };
              this.employeeService.DisableEmployee(body).subscribe( data => {
                if(data) {
                  this.snackbar.openSnackbar('Mở tài khoản thành công', 2000, 'Đóng', 'center', 'bottom', true);
                  this.GetListAll();
                } else {
                  this.snackbar.openSnackbar('Mở tài khoản thất bại', 2000, 'Đóng', 'center', 'bottom', false);
                }
              }, (error) => {
                this.snackbar.openSnackbar('Mở tài khoản thất bại', 2000, 'Đóng', 'center', 'bottom', false);
              });
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
        this.GetListAll()
    }

    ChangePageSize() {
        if (this.page * this.pageSize > this.totalCount) {
            this.page = 1
        }
        this.GetListAll()
    }

    users: any = [];

}
