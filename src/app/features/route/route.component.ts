import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Title } from '@angular/platform-browser';
import { Response } from 'src/app/core/model/Response';
import { Route } from 'src/app/core/model/Route';
import { RouteService } from 'src/app/core/services/route.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { TypeExport } from '../user-manage/common/common.service';
import { AddRouterComponent } from './add-router/add-router.component';
import { ConfirmDialogService } from 'src/app/core/services/confirmDialog.service';

@Component({
    selector: 'app-route',
    templateUrl: './route.component.html',
    styleUrls: ['./route.component.scss'],
})
export class RouteComponent implements OnInit, AfterViewInit {
    constructor(
        private title: Title,
        private dialog: MatDialog,
        private routeService: RouteService,
        public datePipe: DatePipe,
        private _snackBar: SnackbarService,
        private confirmService: ConfirmDialogService,
    ) {}

    page = 1;
    totalCount = 0;
    response: Response<Route> = {
        data: [],
        totalCount: 0,
    };
    isRole: any = localStorage.getItem('role');
    keywordString: any;
    filterObj = {
        keyword: '',
        groupID: '',
        cusId: '',
    };
    listIdRoute: any[] = [];
    isLoading: boolean = false;
    // MatPaginator Inputs
    length: number;
    pageSize = 30;
    employeeId: string = '';

    // pageSizeOptions: number[] = [5, 10, 25, 100];

    // MatPaginator Output
    pageEvent: PageEvent;
    // firstPageLabel = $localize`First page`;
    // itemsPerPageLabel = $localize`Items per page:`;
    // lastPageLabel = $localize`Last page`;

    // You can set labels to an arbitrary string too, or dynamically compute
    // it through other third-party internationalization libraries.
    nextPageLabel = 'Next page';
    previousPageLabel = 'Previous page';

    ngOnInit(): void {
        this.title.setTitle('Quản lý tuyến');
        this.checkIsRole();
    }
    ngAfterViewInit(): void {
        this.init(this.page);
    }

    init(page: any, groupId?: any, cusId?: any, keyword?: any) {
        this.routeService.SearchAllRoute(page, this.pageSize, groupId, cusId, keyword).subscribe((data) => {
            this.length = data.totalCount;
            this.response = data;
        });
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
            left: 'w-1/5',
            right: 'w-4/5',
            statusbar: true,
        };
    }

    class = {
        left: 'w-1/5',
        right: 'w-4/5',
        statusbar: true,
    };

    item = {
        level: 1,
        name: 'level1',
        tree: [
            {
                level: 2,
                name: 'level2',
                tree: [
                    {
                        level: 3,
                        name: 'level3',
                        tree: [
                            {
                                level: 4,
                                name: 'level4',
                                tree: null,
                            },
                        ],
                    },
                    {
                        level: 3,

                        name: 'level3+2',
                        tree: [
                            {
                                level: 4,
                                name: 'level4',
                                tree: null,
                            },
                        ],
                    },
                    {
                        level: 3,
                        name: 'level3+3',
                        tree: [
                            {
                                level: 4,
                                name: 'level4',
                                tree: null,
                            },
                        ],
                    },
                ],
            },
            {
                level: 2,
                name: 'level2.2',
                tree: [
                    {
                        level: 3,
                        name: 'level3.2',
                        tree: [
                            {
                                level: 4,
                                name: 'level4.2',
                                tree: null,
                            },
                        ],
                    },
                ],
            },
        ],
    };

    listMenuObj = [
        {
            title: 'Lọc',
            leftTitleIcon: 'fa-filter',
            listMenuPosition: [
                { title: 'Tất cả', leftIcon: 'fa-check text-emerald-500', value: 'all' },
                { title: 'Tuyến hoạt động', leftIcon: 'fa-shuffle text-emerald-500', value: 'emp' },
                { title: 'Tuyến không hoạt động', leftIcon: 'fa-trash text-emerald-500', value: 'emp-basic' },
            ],
        },
        {
            title: 'Lọc ngày',
            leftTitleIcon: 'fa-filter',
            listMenuPosition: [
                { title: 'Tất cả', leftIcon: 'fa-check text-emerald-500', value: 'all' },
                { title: 'Không giới hạn', leftIcon: 'fa-shuffle text-emerald-500', value: 'emp' },
                { title: 'Thứ 2', leftIcon: 'fa-shuffle text-emerald-500', value: 'emp' },
                { title: 'Thứ 3', leftIcon: 'fa-shuffle text-emerald-500', value: 'emp' },
                { title: 'Thứ 4', leftIcon: 'fa-shuffle text-emerald-500', value: 'emp' },
                { title: 'Thứ 5', leftIcon: 'fa-shuffle text-emerald-500', value: 'emp' },
                { title: 'Thứ 6', leftIcon: 'fa-shuffle text-emerald-500', value: 'emp' },
                { title: 'Thứ 7', leftIcon: 'fa-shuffle text-emerald-500', value: 'emp' },
                { title: 'Chủ nhật', leftIcon: 'fa-shuffle text-emerald-500', value: 'emp' },
            ],
        },
        {
            title: 'Sắp xếp',
            leftTitleIcon: 'fa-sort-alpha-asc',
            listMenuPosition: [
                { title: 'Tên tuyến', leftIcon: 'fa-arrow-up text-emerald-500', value: 'all' },
                { title: 'Mã tuyến', leftIcon: 'fa-arrow-down text-emerald-500', value: 'all' },
                { title: 'Mã tuyến', leftIcon: 'fa-arrow-up text-emerald-500', value: 'all' },
            ],
        },
    ];
    listMenuObj2 = [
        {
            title: 'Quản trị',
            leftTitleIcon: 'fa-lock',
            listMenuPosition: [
                { title: 'Khóa nhiều', leftIcon: 'fa-lock text-emerald-500', value: 'all' },
                { title: 'Mở khóa nhiều', leftIcon: 'fa-unlock text-emerald-500', value: 'all' },
                { title: 'Xóa nhiều', leftIcon: 'fa-trash text-emerald-500', value: 'delete' },
                { title: 'Nhật ký nhập dữ liệu', leftIcon: 'fa-clock-rotate-left text-emerald-500', value: 'all' },
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
                if (this.listIdRoute.length) {
                    this.Export(
                        TypeExport.Selected,
                        this.listIdRoute,
                        `Bạn có muốn xuất ${this.listIdRoute.length} tuyến không?`,
                    );
                }
                break;
            }
            case 'Điều kiện tìm': {
                if (this.response.totalCount) {
                    let body = {
                        keyword: this.keywordString,
                        employeeId: this.employeeId,
                        // groupId: this.filterObj.groupID,
                        page: this.page,
                        pagesize: this.pageSize,
                    };
                    this.Export(TypeExport.Filter, body, `Bạn có muốn xuất ${this.response.totalCount} tuyến không?`);
                }
                break;
            }
        }
    }

    Export(type: number, data$: any, message: string) {
        this.confirmService.open(message, ['Có', 'Không']).subscribe((data) => {
            if (data === 'Có') {
                this.isLoading = true;
                this.routeService.export(type, data$).subscribe(
                    (data) => {
                        const blob = new Blob([data], {
                            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                        });
                        const url = window.URL.createObjectURL(blob);
                        window.open(url);
                        this.isLoading = false;
                    },
                    (err) => {
                        this._snackBar.failureSnackBar();
                    },
                );
            }
        });
    }

    Select(e: any) {
        switch (e) {
            case 'delete':
                let body = {
                    listId: this.listIdRoute,
                };
                this.routeService.Delete(body).subscribe({
                    next: (data) => {
                        this._snackBar.openSnackbar('Xoá tuyến thành công!', 3000, '', 'right', 'bottom', true);
                        this.init(this.page, this.filterObj.groupID, this.filterObj.cusId, this.keywordString);
                    },
                    error: (err) => {
                        this._snackBar.openSnackbar('Lỗi xoá tuyến!', 3000, '', 'right', 'bottom', true);
                    },
                });
        }
    }

    routes = [
        {
            id: 1,
            img: 'https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2021/5/26/913299/Ngan-Ha25.jpg',
            status: 'Hoạt động',
            email: 'zxcvbnm@gmail.com',
            code: 'NV_01',
            fullname: 'Hoàng Văn Tú',
            gender: 'Nam',
            pos: '',
            phone: '098765432',
            add: 'Hà Nội',
            ver: '3.2.1',
            lastModifed: '2022-01-01T12:01:01.234Z',
            lastAsync: '2022-01-01T12:01:01.234Z',
        },
    ];

    openAddRoute() {
        const dialogRef = this.dialog.open(AddRouterComponent, {
            height: '95vh',
            minWidth: '80%',
            data: {
                type: 'add',
            },
        });
        dialogRef.afterClosed().subscribe((result) => {
            this.init(this.page);
        });
    }

    openDetailRoute(id: any) {
        const dialogRef = this.dialog.open(AddRouterComponent, {
            height: '95vh',
            minWidth: '95%',
            data: {
                id: id,
                type: 'update',
            },
        });
        dialogRef.afterClosed().subscribe((result) => {
            this.init(this.page);
        });
    }

    changePage(event: any) {
        // console.log(event);
        this.init((event.pageIndex + 1).toString());
    }

    setPageSizeOptions(setPageSizeOptionsInput: string) {
        // console.log(setPageSizeOptionsInput);
        if (setPageSizeOptionsInput) {
            //  this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
        }
    }

    checkIsRole() {
        if (this.isRole.includes('MANAGER') || this.isRole.includes('SALE_ADMIN')) {
            return true;
        } else {
            return false;
        }
        return;
    }

    reload() {
        this.init(this.page);
    }

    searchUser(request: any) {
        let GrID;
        let EmpID;
        let levelTree = request.split(',')[0];
        switch (levelTree) {
            case '1':
                GrID = request.split(',')[1];
                this.filterObj.groupID = request.split(',')[1];
                break;
            case '2':
                EmpID = request.split(',')[1];
                this.filterObj.cusId = request.split(',')[0];
                break;
        }
        this.employeeId = EmpID;
        this.init(this.page, GrID, EmpID);
    }

    filterRoute(event: any) {
        this.keywordString = event.target.value;
        this.init(this.page, this.filterObj.groupID, this.filterObj.cusId, this.keywordString);
    }

    getCount(routerId: any) {
        this.routeService.CountCustomerInRoute(routerId).subscribe({
            next: (data) => {
                console.log(data);
            },
        });
    }

    checkIdRoute(event: any, idRoute: any) {
        // console.log(event.target.id, idRoute);
        if (event.target.id == 'all') {
            if (event.target.checked) {
                this.listIdRoute = [];
                this.response.data.forEach((currentValue: any) => {
                    this.listIdRoute.push(currentValue.id);
                });
            } else {
                this.listIdRoute = [];
            }
        } else {
            if (event.target.checked) {
                this.listIdRoute.push(idRoute);
            } else {
                this.listIdRoute = this.listIdRoute.filter((id: any) => id != idRoute);
            }
        }
    }
}
