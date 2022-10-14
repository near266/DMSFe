import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
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
        public datePipe: DatePipe
    ) { }

    pageSizeList = [30, 50, 100, 200, 500]
    pageSize = 30
    page = 1
    totalPage: number
    totalCount: number

    AddUser() {
        this.dialog.open(AddUserComponent, {
            height: '100vh',
            minWidth: '900px',
        });
    }

    DetailUser(employeeId: any) {
        this.dialog.open(DetailUserComponent, {
            height: '100vh',
            minWidth: '900px',
            data: {
                employeeId: employeeId,
                status: 'view',
            },
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

    ngOnInit(): void {
        this.title.setTitle('Cây đơn vị - DMS:Delap');
        this.totalCount = this.users.length
        if (this.totalCount / this.pageSize > Math.round(this.totalCount / this.pageSize)) {
            this.totalPage = Math.round(this.totalCount / this.pageSize) + 1;
        }
        else {
            this.totalPage = Math.round(this.totalCount / this.pageSize)
        }
        console.log(this.item);
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
                { title: 'Khóa tài khoản', leftIcon: 'fa-lock text-emerald-500', value: 'emp' },
                { title: 'Mở khóa tài khoản', leftIcon: 'fa-unlock text-emerald-500', value: 'emp-basic' },
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

    Select(e: any) {
        console.log(e);
    }

    ChangePage(e: any) {
        this.page = e
    }

    ChangePageSize() {
        if (this.page * this.pageSize > this.totalCount) {
            this.page = 1
        }
    }

    users = [
        {
            employeeId: "nabv12-davvaw-2wwwaav-www2nva",
            status: true,
            email: "user011@gmail.com",
            employeeCode: "KH-01",
            employeeName: "Hoàng Văn Tú",
            employeeTitle: "title...",
            phone: "0918772411",
            position: "Nhân viên",
            department: "ABC",
            address: "Hoàng Văn Thái",
            gender: 1,
            avatar: "https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2021/5/26/913299/Ngan-Ha25.jpg",
            lastSeenDate: "2022-12-21T00:00:00.000Z",
            lastSyncDate: "2022-12-21T00:00:00.000Z",
            versionMobile: 321
        },
        {
            employeeId: "nabv12-d19vaw-2www01nv-www2nva",
            status: false,
            email: "user012@gmail.com",
            employeeCode: "KH-02",
            employeeName: "Hoàng Văn",
            employeeTitle: "title...",
            phone: "0918772876",
            position: "Giám sát",
            department: "ABC",
            address: "Hoàng Văn Thái",
            gender: 2,
            avatar: "https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2021/5/26/913299/Ngan-Ha25.jpg",
            lastSeenDate: "2022-12-21T07:00:00.000Z",
            lastSyncDate: "2022-12-21T07:00:00.000Z",
            versionMobile: 321
        },
        {
            employeeId: "nabv12-d19vaw-2w1nv-www2nva",
            status: false,
            email: "user012@gmail.com",
            employeeCode: "KH-02",
            employeeName: "Hoàng Văn",
            employeeTitle: "title...",
            phone: "0918772876",
            position: "Giám sát",
            department: "ABC",
            address: "Hoàng Văn Thụ",
            gender: 3,
            avatar: "https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2021/5/26/913299/Ngan-Ha25.jpg",
            lastSeenDate: "2022-12-21T07:00:00.000Z",
            lastSyncDate: "2022-12-21T07:00:00.000Z",
            versionMobile: 321
        },
        {
            employeeId: "nabv12-davvaw-2wwwaav-www2nva",
            status: true,
            email: "user011@gmail.com",
            employeeCode: "KH-01",
            employeeName: "Hoàng Văn Tú",
            employeeTitle: "title...",
            phone: "0918772411",
            position: "Nhân viên",
            department: "ABC",
            address: "Hoàng Văn Thái",
            gender: 1,
            avatar: "https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2021/5/26/913299/Ngan-Ha25.jpg",
            lastSeenDate: "2022-12-21T00:00:00.000Z",
            lastSyncDate: "2022-12-21T00:00:00.000Z",
            versionMobile: 321
        },
        {
            employeeId: "nabv12-d19vaw-2www01nv-www2nva",
            status: false,
            email: "user012@gmail.com",
            employeeCode: "KH-02",
            employeeName: "Hoàng Văn",
            employeeTitle: "title...",
            phone: "0918772876",
            position: "Giám sát",
            department: "ABC",
            address: "Hoàng Văn Thái",
            gender: 2,
            avatar: "https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2021/5/26/913299/Ngan-Ha25.jpg",
            lastSeenDate: "2022-12-21T07:00:00.000Z",
            lastSyncDate: "2022-12-21T07:00:00.000Z",
            versionMobile: 321
        },
        {
            employeeId: "nabv12-d19vaw-2w1nv-www2nva",
            status: false,
            email: "user012@gmail.com",
            employeeCode: "KH-02",
            employeeName: "Hoàng Văn",
            employeeTitle: "title...",
            phone: "0918772876",
            position: "Giám sát",
            department: "ABC",
            address: "Hoàng Văn Thụ",
            gender: 3,
            avatar: "https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2021/5/26/913299/Ngan-Ha25.jpg",
            lastSeenDate: "2022-12-21T07:00:00.000Z",
            lastSyncDate: "2022-12-21T07:00:00.000Z",
            versionMobile: 321
        },
        {
            employeeId: "nabv12-davvaw-2wwwaav-www2nva",
            status: true,
            email: "user011@gmail.com",
            employeeCode: "KH-01",
            employeeName: "Hoàng Văn Tú",
            employeeTitle: "title...",
            phone: "0918772411",
            position: "Nhân viên",
            department: "ABC",
            address: "Hoàng Văn Thái",
            gender: 1,
            avatar: "https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2021/5/26/913299/Ngan-Ha25.jpg",
            lastSeenDate: "2022-12-21T00:00:00.000Z",
            lastSyncDate: "2022-12-21T00:00:00.000Z",
            versionMobile: 321
        },
        {
            employeeId: "nabv12-d19vaw-2www01nv-www2nva",
            status: false,
            email: "user012@gmail.com",
            employeeCode: "KH-02",
            employeeName: "Hoàng Văn",
            employeeTitle: "title...",
            phone: "0918772876",
            position: "Giám sát",
            department: "ABC",
            address: "Hoàng Văn Thái",
            gender: 2,
            avatar: "https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2021/5/26/913299/Ngan-Ha25.jpg",
            lastSeenDate: "2022-12-21T07:00:00.000Z",
            lastSyncDate: "2022-12-21T07:00:00.000Z",
            versionMobile: 321
        },
        {
            employeeId: "nabv12-d19vaw-2w1nv-www2nva",
            status: false,
            email: "user012@gmail.com",
            employeeCode: "KH-02",
            employeeName: "Hoàng Văn",
            employeeTitle: "title...",
            phone: "0918772876",
            position: "Giám sát",
            department: "ABC",
            address: "Hoàng Văn Thụ",
            gender: 3,
            avatar: "https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2021/5/26/913299/Ngan-Ha25.jpg",
            lastSeenDate: "2022-12-21T07:00:00.000Z",
            lastSyncDate: "2022-12-21T07:00:00.000Z",
            versionMobile: 321
        },
        {
            employeeId: "nabv12-davvaw-2wwwaav-www2nva",
            status: true,
            email: "user011@gmail.com",
            employeeCode: "KH-01",
            employeeName: "Hoàng Văn Tú",
            employeeTitle: "title...",
            phone: "0918772411",
            position: "Nhân viên",
            department: "ABC",
            address: "Hoàng Văn Thái",
            gender: 1,
            avatar: "https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2021/5/26/913299/Ngan-Ha25.jpg",
            lastSeenDate: "2022-12-21T00:00:00.000Z",
            lastSyncDate: "2022-12-21T00:00:00.000Z",
            versionMobile: 321
        },
        {
            employeeId: "nabv12-d19vaw-2www01nv-www2nva",
            status: false,
            email: "user012@gmail.com",
            employeeCode: "KH-02",
            employeeName: "Hoàng Văn",
            employeeTitle: "title...",
            phone: "0918772876",
            position: "Giám sát",
            department: "ABC",
            address: "Hoàng Văn Thái",
            gender: 2,
            avatar: "https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2021/5/26/913299/Ngan-Ha25.jpg",
            lastSeenDate: "2022-12-21T07:00:00.000Z",
            lastSyncDate: "2022-12-21T07:00:00.000Z",
            versionMobile: 321
        },
        {
            employeeId: "nabv12-d19vaw-2w1nv-www2nva",
            status: false,
            email: "user012@gmail.com",
            employeeCode: "KH-02",
            employeeName: "Hoàng Văn",
            employeeTitle: "title...",
            phone: "0918772876",
            position: "Giám sát",
            department: "ABC",
            address: "Hoàng Văn Thụ",
            gender: 3,
            avatar: "https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2021/5/26/913299/Ngan-Ha25.jpg",
            lastSeenDate: "2022-12-21T07:00:00.000Z",
            lastSyncDate: "2022-12-21T07:00:00.000Z",
            versionMobile: 321
        },
        {
            employeeId: "nabv12-davvaw-2wwwaav-www2nva",
            status: true,
            email: "user011@gmail.com",
            employeeCode: "KH-01",
            employeeName: "Hoàng Văn Tú",
            employeeTitle: "title...",
            phone: "0918772411",
            position: "Nhân viên",
            department: "ABC",
            address: "Hoàng Văn Thái",
            gender: 1,
            avatar: "https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2021/5/26/913299/Ngan-Ha25.jpg",
            lastSeenDate: "2022-12-21T00:00:00.000Z",
            lastSyncDate: "2022-12-21T00:00:00.000Z",
            versionMobile: 321
        },
        {
            employeeId: "nabv12-d19vaw-2www01nv-www2nva",
            status: false,
            email: "user012@gmail.com",
            employeeCode: "KH-02",
            employeeName: "Hoàng Văn",
            employeeTitle: "title...",
            phone: "0918772876",
            position: "Giám sát",
            department: "ABC",
            address: "Hoàng Văn Thái",
            gender: 2,
            avatar: "https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2021/5/26/913299/Ngan-Ha25.jpg",
            lastSeenDate: "2022-12-21T07:00:00.000Z",
            lastSyncDate: "2022-12-21T07:00:00.000Z",
            versionMobile: 321
        },
        {
            employeeId: "nabv12-d19vaw-2w1nv-www2nva",
            status: false,
            email: "user012@gmail.com",
            employeeCode: "KH-02",
            employeeName: "Hoàng Văn",
            employeeTitle: "title...",
            phone: "0918772876",
            position: "Giám sát",
            department: "ABC",
            address: "Hoàng Văn Thụ",
            gender: 3,
            avatar: "https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2021/5/26/913299/Ngan-Ha25.jpg",
            lastSeenDate: "2022-12-21T07:00:00.000Z",
            lastSyncDate: "2022-12-21T07:00:00.000Z",
            versionMobile: 321
        },
        {
            employeeId: "nabv12-davvaw-2wwwaav-www2nva",
            status: true,
            email: "user011@gmail.com",
            employeeCode: "KH-01",
            employeeName: "Hoàng Văn Tú",
            employeeTitle: "title...",
            phone: "0918772411",
            position: "Nhân viên",
            department: "ABC",
            address: "Hoàng Văn Thái",
            gender: 1,
            avatar: "https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2021/5/26/913299/Ngan-Ha25.jpg",
            lastSeenDate: "2022-12-21T00:00:00.000Z",
            lastSyncDate: "2022-12-21T00:00:00.000Z",
            versionMobile: 321
        },
        {
            employeeId: "nabv12-d19vaw-2www01nv-www2nva",
            status: false,
            email: "user012@gmail.com",
            employeeCode: "KH-02",
            employeeName: "Hoàng Văn",
            employeeTitle: "title...",
            phone: "0918772876",
            position: "Giám sát",
            department: "ABC",
            address: "Hoàng Văn Thái",
            gender: 2,
            avatar: "https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2021/5/26/913299/Ngan-Ha25.jpg",
            lastSeenDate: "2022-12-21T07:00:00.000Z",
            lastSyncDate: "2022-12-21T07:00:00.000Z",
            versionMobile: 321
        },
        {
            employeeId: "nabv12-d19vaw-2w1nv-www2nva",
            status: false,
            email: "user012@gmail.com",
            employeeCode: "KH-02",
            employeeName: "Hoàng Văn",
            employeeTitle: "title...",
            phone: "0918772876",
            position: "Giám sát",
            department: "ABC",
            address: "Hoàng Văn Thụ",
            gender: 3,
            avatar: "https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2021/5/26/913299/Ngan-Ha25.jpg",
            lastSeenDate: "2022-12-21T07:00:00.000Z",
            lastSyncDate: "2022-12-21T07:00:00.000Z",
            versionMobile: 321
        },
        {
            employeeId: "nabv12-davvaw-2wwwaav-www2nva",
            status: true,
            email: "user011@gmail.com",
            employeeCode: "KH-01",
            employeeName: "Hoàng Văn Tú",
            employeeTitle: "title...",
            phone: "0918772411",
            position: "Nhân viên",
            department: "ABC",
            address: "Hoàng Văn Thái",
            gender: 1,
            avatar: "https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2021/5/26/913299/Ngan-Ha25.jpg",
            lastSeenDate: "2022-12-21T00:00:00.000Z",
            lastSyncDate: "2022-12-21T00:00:00.000Z",
            versionMobile: 321
        },
        {
            employeeId: "nabv12-d19vaw-2www01nv-www2nva",
            status: false,
            email: "user012@gmail.com",
            employeeCode: "KH-02",
            employeeName: "Hoàng Văn",
            employeeTitle: "title...",
            phone: "0918772876",
            position: "Giám sát",
            department: "ABC",
            address: "Hoàng Văn Thái",
            gender: 2,
            avatar: "https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2021/5/26/913299/Ngan-Ha25.jpg",
            lastSeenDate: "2022-12-21T07:00:00.000Z",
            lastSyncDate: "2022-12-21T07:00:00.000Z",
            versionMobile: 321
        },
        {
            employeeId: "nabv12-d19vaw-2w1nv-www2nva",
            status: false,
            email: "user012@gmail.com",
            employeeCode: "KH-02",
            employeeName: "Hoàng Văn",
            employeeTitle: "title...",
            phone: "0918772876",
            position: "Giám sát",
            department: "ABC",
            address: "Hoàng Văn Thụ",
            gender: 3,
            avatar: "https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2021/5/26/913299/Ngan-Ha25.jpg",
            lastSeenDate: "2022-12-21T07:00:00.000Z",
            lastSyncDate: "2022-12-21T07:00:00.000Z",
            versionMobile: 321
        },
        {
            employeeId: "nabv12-davvaw-2wwwaav-www2nva",
            status: true,
            email: "user011@gmail.com",
            employeeCode: "KH-01",
            employeeName: "Hoàng Văn Tú",
            employeeTitle: "title...",
            phone: "0918772411",
            position: "Nhân viên",
            department: "ABC",
            address: "Hoàng Văn Thái",
            gender: 1,
            avatar: "https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2021/5/26/913299/Ngan-Ha25.jpg",
            lastSeenDate: "2022-12-21T00:00:00.000Z",
            lastSyncDate: "2022-12-21T00:00:00.000Z",
            versionMobile: 321
        },
        {
            employeeId: "nabv12-d19vaw-2www01nv-www2nva",
            status: false,
            email: "user012@gmail.com",
            employeeCode: "KH-02",
            employeeName: "Hoàng Văn",
            employeeTitle: "title...",
            phone: "0918772876",
            position: "Giám sát",
            department: "ABC",
            address: "Hoàng Văn Thái",
            gender: 2,
            avatar: "https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2021/5/26/913299/Ngan-Ha25.jpg",
            lastSeenDate: "2022-12-21T07:00:00.000Z",
            lastSyncDate: "2022-12-21T07:00:00.000Z",
            versionMobile: 321
        },
        {
            employeeId: "nabv12-d19vaw-2w1nv-www2nva",
            status: false,
            email: "user012@gmail.com",
            employeeCode: "KH-02",
            employeeName: "Hoàng Văn",
            employeeTitle: "title...",
            phone: "0918772876",
            position: "Giám sát",
            department: "ABC",
            address: "Hoàng Văn Thụ",
            gender: 3,
            avatar: "https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2021/5/26/913299/Ngan-Ha25.jpg",
            lastSeenDate: "2022-12-21T07:00:00.000Z",
            lastSyncDate: "2022-12-21T07:00:00.000Z",
            versionMobile: 321
        },
        {
            employeeId: "nabv12-davvaw-2wwwaav-www2nva",
            status: true,
            email: "user011@gmail.com",
            employeeCode: "KH-01",
            employeeName: "Hoàng Văn Tú",
            employeeTitle: "title...",
            phone: "0918772411",
            position: "Nhân viên",
            department: "ABC",
            address: "Hoàng Văn Thái",
            gender: 1,
            avatar: "https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2021/5/26/913299/Ngan-Ha25.jpg",
            lastSeenDate: "2022-12-21T00:00:00.000Z",
            lastSyncDate: "2022-12-21T00:00:00.000Z",
            versionMobile: 321
        },
        {
            employeeId: "nabv12-d19vaw-2www01nv-www2nva",
            status: false,
            email: "user012@gmail.com",
            employeeCode: "KH-02",
            employeeName: "Hoàng Văn",
            employeeTitle: "title...",
            phone: "0918772876",
            position: "Giám sát",
            department: "ABC",
            address: "Hoàng Văn Thái",
            gender: 2,
            avatar: "https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2021/5/26/913299/Ngan-Ha25.jpg",
            lastSeenDate: "2022-12-21T07:00:00.000Z",
            lastSyncDate: "2022-12-21T07:00:00.000Z",
            versionMobile: 321
        },
        {
            employeeId: "nabv12-d19vaw-2w1nv-www2nva",
            status: false,
            email: "user012@gmail.com",
            employeeCode: "KH-02",
            employeeName: "Hoàng Văn",
            employeeTitle: "title...",
            phone: "0918772876",
            position: "Giám sát",
            department: "ABC",
            address: "Hoàng Văn Thụ",
            gender: 3,
            avatar: "https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2021/5/26/913299/Ngan-Ha25.jpg",
            lastSeenDate: "2022-12-21T07:00:00.000Z",
            lastSyncDate: "2022-12-21T07:00:00.000Z",
            versionMobile: 321
        },
        {
            employeeId: "nabv12-davvaw-2wwwaav-www2nva",
            status: true,
            email: "user011@gmail.com",
            employeeCode: "KH-01",
            employeeName: "Hoàng Văn Tú",
            employeeTitle: "title...",
            phone: "0918772411",
            position: "Nhân viên",
            department: "ABC",
            address: "Hoàng Văn Thái",
            gender: 1,
            avatar: "https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2021/5/26/913299/Ngan-Ha25.jpg",
            lastSeenDate: "2022-12-21T00:00:00.000Z",
            lastSyncDate: "2022-12-21T00:00:00.000Z",
            versionMobile: 321
        },
        {
            employeeId: "nabv12-d19vaw-2www01nv-www2nva",
            status: false,
            email: "user012@gmail.com",
            employeeCode: "KH-02",
            employeeName: "Hoàng Văn",
            employeeTitle: "title...",
            phone: "0918772876",
            position: "Giám sát",
            department: "ABC",
            address: "Hoàng Văn Thái",
            gender: 2,
            avatar: "https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2021/5/26/913299/Ngan-Ha25.jpg",
            lastSeenDate: "2022-12-21T07:00:00.000Z",
            lastSyncDate: "2022-12-21T07:00:00.000Z",
            versionMobile: 321
        },
        {
            employeeId: "nabv12-d19vaw-2w1nv-www2nva",
            status: false,
            email: "user012@gmail.com",
            employeeCode: "KH-02",
            employeeName: "Hoàng Văn",
            employeeTitle: "title...",
            phone: "0918772876",
            position: "Giám sát",
            department: "ABC",
            address: "Hoàng Văn Thụ",
            gender: 3,
            avatar: "https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2021/5/26/913299/Ngan-Ha25.jpg",
            lastSeenDate: "2022-12-21T07:00:00.000Z",
            lastSyncDate: "2022-12-21T07:00:00.000Z",
            versionMobile: 321
        },
        {
            employeeId: "nabv12-davvaw-2wwwaav-www2nva",
            status: true,
            email: "user011@gmail.com",
            employeeCode: "KH-01",
            employeeName: "Hoàng Văn Tú",
            employeeTitle: "title...",
            phone: "0918772411",
            position: "Nhân viên",
            department: "ABC",
            address: "Hoàng Văn Thái",
            gender: 1,
            avatar: "https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2021/5/26/913299/Ngan-Ha25.jpg",
            lastSeenDate: "2022-12-21T00:00:00.000Z",
            lastSyncDate: "2022-12-21T00:00:00.000Z",
            versionMobile: 321
        },
        {
            employeeId: "nabv12-d19vaw-2www01nv-www2nva",
            status: false,
            email: "user012@gmail.com",
            employeeCode: "KH-02",
            employeeName: "Hoàng Văn",
            employeeTitle: "title...",
            phone: "0918772876",
            position: "Giám sát",
            department: "ABC",
            address: "Hoàng Văn Thái",
            gender: 2,
            avatar: "https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2021/5/26/913299/Ngan-Ha25.jpg",
            lastSeenDate: "2022-12-21T07:00:00.000Z",
            lastSyncDate: "2022-12-21T07:00:00.000Z",
            versionMobile: 321
        },
        {
            employeeId: "nabv12-d19vaw-2w1nv-www2nva",
            status: false,
            email: "user012@gmail.com",
            employeeCode: "KH-02",
            employeeName: "Hoàng Văn",
            employeeTitle: "title...",
            phone: "0918772876",
            position: "Giám sát",
            department: "ABC",
            address: "Hoàng Văn Thụ",
            gender: 3,
            avatar: "https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2021/5/26/913299/Ngan-Ha25.jpg",
            lastSeenDate: "2022-12-21T07:00:00.000Z",
            lastSyncDate: "2022-12-21T07:00:00.000Z",
            versionMobile: 321
        },
        {
            employeeId: "nabv12-davvaw-2wwwaav-www2nva",
            status: true,
            email: "user011@gmail.com",
            employeeCode: "KH-01",
            employeeName: "Hoàng Văn Tú",
            employeeTitle: "title...",
            phone: "0918772411",
            position: "Nhân viên",
            department: "ABC",
            address: "Hoàng Văn Thái",
            gender: 1,
            avatar: "https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2021/5/26/913299/Ngan-Ha25.jpg",
            lastSeenDate: "2022-12-21T00:00:00.000Z",
            lastSyncDate: "2022-12-21T00:00:00.000Z",
            versionMobile: 321
        },
        {
            employeeId: "nabv12-d19vaw-2www01nv-www2nva",
            status: false,
            email: "user012@gmail.com",
            employeeCode: "KH-02",
            employeeName: "Hoàng Văn",
            employeeTitle: "title...",
            phone: "0918772876",
            position: "Giám sát",
            department: "ABC",
            address: "Hoàng Văn Thái",
            gender: 2,
            avatar: "https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2021/5/26/913299/Ngan-Ha25.jpg",
            lastSeenDate: "2022-12-21T07:00:00.000Z",
            lastSyncDate: "2022-12-21T07:00:00.000Z",
            versionMobile: 321
        },
        {
            employeeId: "nabv12-d19vaw-2w1nv-www2nva",
            status: false,
            email: "user012@gmail.com",
            employeeCode: "KH-02",
            employeeName: "Hoàng Văn",
            employeeTitle: "title...",
            phone: "0918772876",
            position: "Giám sát",
            department: "ABC",
            address: "Hoàng Văn Thụ",
            gender: 3,
            avatar: "https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2021/5/26/913299/Ngan-Ha25.jpg",
            lastSeenDate: "2022-12-21T07:00:00.000Z",
            lastSyncDate: "2022-12-21T07:00:00.000Z",
            versionMobile: 321
        },
        {
            employeeId: "nabv12-davvaw-2wwwaav-www2nva",
            status: true,
            email: "user011@gmail.com",
            employeeCode: "KH-01",
            employeeName: "Hoàng Văn Tú",
            employeeTitle: "title...",
            phone: "0918772411",
            position: "Nhân viên",
            department: "ABC",
            address: "Hoàng Văn Thái",
            gender: 1,
            avatar: "https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2021/5/26/913299/Ngan-Ha25.jpg",
            lastSeenDate: "2022-12-21T00:00:00.000Z",
            lastSyncDate: "2022-12-21T00:00:00.000Z",
            versionMobile: 321
        },
        {
            employeeId: "nabv12-d19vaw-2www01nv-www2nva",
            status: false,
            email: "user012@gmail.com",
            employeeCode: "KH-02",
            employeeName: "Hoàng Văn",
            employeeTitle: "title...",
            phone: "0918772876",
            position: "Giám sát",
            department: "ABC",
            address: "Hoàng Văn Thái",
            gender: 2,
            avatar: "https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2021/5/26/913299/Ngan-Ha25.jpg",
            lastSeenDate: "2022-12-21T07:00:00.000Z",
            lastSyncDate: "2022-12-21T07:00:00.000Z",
            versionMobile: 321
        },
        {
            employeeId: "nabv12-d19vaw-2w1nv-www2nva",
            status: false,
            email: "user012@gmail.com",
            employeeCode: "KH-02",
            employeeName: "Hoàng Văn L",
            employeeTitle: "title...",
            phone: "0918772876",
            position: "Giám sát",
            department: "ABC",
            address: "Hoàng Văn Thụ",
            gender: 3,
            avatar: "https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2021/5/26/913299/Ngan-Ha25.jpg",
            lastSeenDate: "2022-12-21T07:00:00.000Z",
            lastSyncDate: "2022-12-21T07:00:00.000Z",
            versionMobile: 321
        }
    ];

}
