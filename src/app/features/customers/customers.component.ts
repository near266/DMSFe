import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { customers } from 'src/app/core/data/Customers';
import { Area } from 'src/app/core/model/Area';
import { Channel } from 'src/app/core/model/Channel';
import { Config } from 'src/app/core/model/Config';
import { CustomerGroup } from 'src/app/core/model/CustomerGroup';
import { Customers } from 'src/app/core/model/Customers';
import { CustomerType } from 'src/app/core/model/CustomerType';
import { Response } from 'src/app/core/model/Response';
import { AreaService } from 'src/app/core/services/area.service';
import { ChannelService } from 'src/app/core/services/channel.service';
import { CustomerGroupService } from 'src/app/core/services/customer-group.service';
import { CustomerTypeService } from 'src/app/core/services/customer-type.service';
import { CustomerService } from 'src/app/core/services/customer.service';
import { ProvincesService } from 'src/app/core/services/provinces.service';
import { RolesService } from 'src/app/core/services/roles.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { environment } from 'src/environments/environment';
import { AddCustomerComponent } from './add-customer/add-customer.component';
import { DetailCustomerComponent } from './detail-customer/detail-customer.component';
import { FieldsDialogComponent } from './fields-dialog/fields-dialog.component';

export interface IBody {
    filter?: any;
    listId?: any[] | null;
    type?: any;
    listProperties?: any[] | null;
}
@Component({
    selector: 'app-customers',
    templateUrl: './customers.component.html',
    styleUrls: ['./customers.component.scss'],
})
export class CustomersComponent implements OnInit, AfterViewInit {
    loading = true;
    customerGroup: CustomerGroup[] = [];
    customerType: CustomerType[] = [];
    channel: Channel[] = [];
    area: Area[] = [];
    isProvince = false;
    hasEmployee = false;
    hasArea = false;
    customer = customers;
    role: string;
    listRole: string[] = [];
    response: Response<Customers> = {
        data: [],
        totalCount: 0,
    };
    selectedList: string[] = [];

    listProvinces: any[] = [];
    listDistricts: any[] = [];
    listWards: any[] = [];
    showArea = false;
    showProvince = false;
    showDistrict = false;
    showWard = false;
    isChoseUpdated = false;
    areaName = '';
    provinceName = '';
    districtName = '';
    wardName = '';
    areaTemp: Area[] = [];
    provinceTemp: any[] = [];
    districtTemp: any[] = [];
    wardTemp: any[] = [];

    keywords = '';
    province = '';
    district = '';
    ward = '';
    areas = '';

    request: any = {
        keyword: '',
        page: 1,
        pageSize: 30,
    };
    current_page = 1;

    page = 1;
    pageSize = 30;
    totalPage = 0;
    pageList: number[] = [];
    firstLoad = true;

    statusMenu: Config = {
        icon: '<i class="fa-solid fa-flag"></i>',
        title: 'Trạng thái',
        menuChildrens: ['Tất cả', 'Hoạt động', 'Không hoạt động'],
    };

    startDate = '';
    endDate = '';

    selectStatus(event: any) {
        switch (event) {
            case 'Tất cả': {
                event = null;
                break;
            }
            case 'Hoạt động': {
                event = true;
                break;
            }
            case 'Không hoạt động': {
                event = false;
                break;
            }
            default: {
                event = null;
                break;
            }
        }
        this.request.status = event;
        this.filter();
    }

    locationMenu: Config = {
        icon: '<i class="fa-solid fa-location-dot"></i>',
        title: 'Vị trí',
        menuChildrens: ['Tất cả', 'Có vị trí', 'Nghi ngờ sai vị trí', 'Sai vị trí', 'Không vị trí'],
    };

    selectLocation(event: any) {
        switch (event) {
            case 'Tất cả': {
                event = null;
                break;
            }
            case 'Có vị trí': {
                event = true;
                break;
            }
            case 'Nghi ngờ sai vị trí': {
                event = false;
                break;
            }
            case 'Sai vị trí': {
                event = false;
                break;
            }
            case 'Không vị trí': {
                event = false;
                break;
            }
            default: {
                event = null;
                break;
            }
        }
        this.request.status = event;
    }

    selectArea(event: any) {
        if (event == 'all') {
            this.request.areaId = null;
        } else if (event == 'none') {
            this.request.areaId = '00000000-0000-0000-0000-000000000000';
        } else {
            this.request.areaId = event;
        }
        this.filter();
        return;
    }

    archiveMenu: Config = {
        icon: '<i class="fa-solid fa-briefcase"></i>',
        title: 'Lưu trữ',
        menuChildrens: ['Tất cả', 'Mở', 'Khóa'],
    };

    selectArchive(event: any) {
        switch (event) {
            case 'Tất cả': {
                event = null;
                break;
            }
            case 'Mở': {
                event = false;
                break;
            }
            case 'Khóa': {
                event = true;
                break;
            }
            default: {
                event = null;
                break;
            }
        }
        this.request.archived = event;
        this.filter();
    }

    customerMenu: Config = {
        icon: '<i class="fa-solid fa-file"></i>',
        title: 'KH có mã và không',
        menuChildrens: ['Tất cả', 'Khách hàng có mã', 'Khách hàng không có mã'],
    };

    selectCustomer(event: any) {
        switch (event) {
            case 'Tất cả': {
                event = null;
                break;
            }
            case 'Khách hàng có mã': {
                event = true;
                break;
            }
            case 'Khách hàng không có mã': {
                event = false;
                break;
            }
            default: {
                event = null;
                break;
            }
        }
        this.request.isCustomerCode = event;
        this.filter();
    }

    categoryMenu: Config = {
        icon: '<i class="fa-solid fa-grip"></i>',
        title: 'Loại khách hàng',
        menuChildrens: [
            'Tất cả',
            // 'VIP 1',
            // 'VIP 2',
            // 'VIP 3',
            // 'VIP 4',
            // 'Tiềm năng',
            // 'Thân thiết',
            // 'Vãng lai',
            // 'Không thuộc loại KH nào',
        ],
    };

    selectCategory(event: any) {
        if (event == 'Tất cả' || event == '') {
            this.request.customerTypeId = null;
            this.filter();
            return;
        }
        for (let i = 0; i < this.customerType.length; i++) {
            if (event == this.customerType[i].customerTypeName) {
                this.request.customerTypeId = this.customerType[i].id;
                this.filter();
                return;
            }
        }
    }

    groupMenu: Config = {
        icon: '<i class="fa-solid fa-users"></i>',
        title: 'Nhóm khách hàng',
        menuChildrens: ['Tất cả'],
    };

    selectGroup(event: any) {
        if (event == 'Tất cả' || event == '') {
            this.request.customerGroupId = null;
            this.filter();
            return;
        }
        for (let i = 0; i < this.customerGroup.length; i++) {
            if (event == this.customerGroup[i].customerGroupName) {
                this.request.customerGroupId = this.customerGroup[i].id;
                this.filter();
                return;
            }
        }
    }

    channelMenu: Config = {
        icon: '<i class="fa-solid fa-retweet"></i>',
        title: 'Kênh',
        menuChildrens: ['Tất cả'],
    };

    selectChannel(event: any) {
        if (event == 'Tất cả' || event == '') {
            this.request.channelId = null;
            this.filter();
            return;
        }
        for (let i = 0; i < this.channel.length; i++) {
            if (event == this.channel[i].channelName) {
                this.request.channelId = this.channel[i].id;
                this.filter();
                return;
            }
        }
    }

    constructor(
        private title: Title,
        private dialog: MatDialog,
        private customerService: CustomerService,
        private snackbar: SnackbarService,
        public datePipe: DatePipe,
        private provincesService: ProvincesService,
        private fb: FormBuilder,
        private rolesService: RolesService,
        private customerGroupService: CustomerGroupService,
        private customerTypeService: CustomerTypeService,
        private channelService: ChannelService,
        private areaService: AreaService,
        private router: Router,
    ) {}

    ngOnInit(): void {
        this.title.setTitle('Khách hàng');
        this.role = '' + localStorage.getItem('role');
        this.listRole = this.role.split(',');
        this.request.page = 1;
        this.request.pageSize = this.pageSize;
    }

    ngAfterViewInit(): void {
        this.page = 1;
        this.init(this.keywords, this.page, this.pageSize);
        this.provincesService.getListProvinces().subscribe((data) => {
            this.listProvinces = data;
        });
        this.customerGroupService.get_all().subscribe((data) => {
            this.customerGroup = data as CustomerGroup[];
            this.customerGroup.forEach((e) => {
                this.groupMenu.menuChildrens.push(e.customerGroupName);
            });
        });
        this.customerTypeService.get_all().subscribe((data) => {
            this.customerType = data as CustomerType[];
            this.customerType.forEach((e) => {
                this.categoryMenu.menuChildrens.push(e.customerTypeName);
            });
        });
        this.channelService.get_all().subscribe((data) => {
            this.channel = data as Channel[];
            this.channel.forEach((e) => {
                this.channelMenu.menuChildrens.push(e.channelName);
            });
        });
        this.areaService.get_all().subscribe((data) => {
            this.area = data as Area[];
            this.area.forEach((e) => {
                // this.locationMenu.menuChildrens.push(e.areaName);
            });
        });
    }

    checked() {
        this.response.data.forEach((element) => {
            if (this.selectedList.indexOf('' + element.id) > -1) {
                element.checked = true;
            } else {
                element.checked = false;
            }
        });
    }

    checkSelectedList(id: any) {
        if (this.selectedList.indexOf(id) > -1) {
            this.selectedList.splice(this.selectedList.indexOf(id), 1);
        } else {
            this.selectedList.push(id);
        }
    }

    init(keyword: any, page: number, pageSize: number) {
        this.loading = true;
        const body = {
            keyword: keyword,
            page: page,
            pageSize: pageSize,
        };
        this.request.page = page;
        this.current_page = page;
        this.customerService.search(this.request).subscribe(
            (data) => {
                this.loading = false;
                if (data) {
                    this.response = data;
                    this.checked();
                    this.totalPage = Number.parseInt((this.response.totalCount / this.pageSize).toString());
                    if (this.response.totalCount % this.pageSize > 0) this.totalPage++;
                    this.pageList = [];
                    for (let i = 1; i <= this.totalPage; i++) {
                        this.pageList.push(i);
                    }
                    let splitUrl = this.router.url.split('/');
                    this.response.data.forEach((element) => {
                        if (element.status == true) element.status = 'Hoạt động';
                        else if (element.status == false) element.status = 'Không hoạt động';
                        else element.status = 'Không hoạt động';
                        if (element.dob) {
                            element.dob = this.datePipe.transform(element.dob, 'dd/MM/yyyy');
                        }
                        if (splitUrl.length == 3 && this.firstLoad == true) {
                            if (element.id == splitUrl[2]) {
                                this.firstLoad = false;
                                this.DetailCustomer(element);
                            }
                        }
                    });
                }
            },
            (error) => {
                this.loading = false;
                this.snackbar.openSnackbar(
                    'Không thể tải danh sách khách hàng',
                    2000,
                    'Đóng',
                    'center',
                    'bottom',
                    true,
                );
            },
        );
    }

    requiredRoles(role: string) {
        return this.rolesService.requiredRoles(role);
    }

    add() {
        const dialogRef = this.dialog.open(AddCustomerComponent, {
            height: '100vh',
            minWidth: '1100px',
        });
        dialogRef.afterClosed().subscribe((data) => {
            if (data) {
                this.page = 1;
                this.init(this.keywords, this.page, this.pageSize);
            }
        });
    }

    DetailCustomer(user: any) {
        const dialogRef = this.dialog.open(DetailCustomerComponent, {
            height: '100vh',
            minWidth: '1100px',
            data: { id: user.id, archived: user.archived },
        });
        dialogRef.afterClosed().subscribe((data) => {
            if (data) {
                this.init(this.keywords, this.page, this.pageSize);
            }
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
            left: 'w-2/12',
            right: 'w-10/12',
            statusbar: true,
        };
    }

    class = {
        left: 'w-2/12',
        right: 'w-10/12',
        statusbar: true,
    };

    listMenuExport = [
        {
            title: 'Xuất dữ liệu',
            leftTitleIcon: 'fa-download',
            listMenuPosition: [
                { title: 'Được chọn', leftIcon: 'fa-magnifying-glass text-emerald-500', value: 'Được chọn' },
                { title: 'Điều kiện tìm', leftIcon: 'fa-arrow-down text-emerald-500', value: 'Điều kiện tìm' },
            ],
        },
    ];

    SelectTypeExport(type: number) {
        let body: IBody = {
            filter: null,
            type: type,
        };
        if (type == 1) {
            body.filter = this.request;
            body.filter.page = 1;
            body.filter.pageSize = this.response.totalCount;
            body.listId = null;
        } else {
            body.filter = null;
            body.listId = this.selectedList;
        }
        const dialogRef = this.dialog.open(FieldsDialogComponent, {
            height: '70vh',
            minWidth: '700px',
            panelClass: 'custom-mat-dialog-container',
            autoFocus: false,
        });
        dialogRef.afterClosed().subscribe((data) => {
            if (data) {
                body.listProperties = data.event;
                this.customerService.export(body).subscribe(
                    (data) => {
                        if (data) {
                            const blob = new Blob([data], {
                                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                            });
                            const url = window.URL.createObjectURL(blob);
                            window.open(url);
                        }
                    },
                    (error) => {
                        this.snackbar.failureSnackBar();
                    },
                );
            }
        });
    }

    listMenuObj = [
        {
            title: 'Lọc thời gian',
            leftTitleIcon: 'fa-calendar-days',
            listMenuPosition: [
                { title: 'Ngày tạo', leftIcon: '', value: 'Ngày tạo' },
                { title: 'Ngày cập nhật', leftIcon: '', value: 'Ngày cập nhật' },
                { title: 'Sinh nhật', leftIcon: '', value: 'Sinh nhật' },
            ],
        },
        {
            title: 'Sắp xếp',
            leftTitleIcon: 'fa-sort-alpha-asc',
            listMenuPosition: [
                { title: 'Tên khách hàng', leftIcon: 'fa-arrow-down', value: 'CustomerName-down' },
                { title: 'Tên khách hàng', leftIcon: 'fa-arrow-up', value: 'CustomerName-up' },

                { title: 'Mã khách hàng', leftIcon: 'fa-arrow-down', value: 'CustomerCode-down' },
                { title: 'Mã khách hàng', leftIcon: 'fa-arrow-up', value: 'CustomerCode-up' },

                { title: 'Ngày tạo', leftIcon: 'fa-arrow-down', value: 'CreatedDate-down' },
                { title: 'Ngày tạo', leftIcon: 'fa-arrow-up', value: 'CreatedDate-up' },

                { title: 'Ngày cập nhật', leftIcon: 'fa-arrow-down', value: 'LastModifiedDate-down' },
                { title: 'Ngày cập nhật', leftIcon: 'fa-arrow-up', value: 'LastModifiedDate-up' },

                // { title: 'Số lần viếng thăm', leftIcon: 'fa-arrow-down', value: 'all' },
                // { title: 'Số lần viếng thăm', leftIcon: 'fa-arrow-up', value: 'all' },

                // { title: 'Số lần đặt hàng', leftIcon: 'fa-arrow-down', value: 'all' },
                // { title: 'Số lần đặt hàng', leftIcon: 'fa-arrow-up', value: 'all' },

                // { title: 'Số lần bán hàng', leftIcon: 'fa-arrow-down', value: 'all' },
                // { title: 'Số lần bán hàng', leftIcon: 'fa-arrow-up', value: 'all' },
            ],
        },
    ];

    Select(e: string) {
        if (e.includes('Sinh nhật') || e.includes('Ngày cập nhật') || e.includes('Ngày tạo')) {
            this.sortByType(e);
            return;
        } else {
            this.sortByField(e);
            return;
        }
    }
    sortByType(key: string) {
        this.request.type = key;
        if (this.request.startedDate && this.request.endDate) {
            this.filter();
        }
    }

    sortByField(key: string) {
        let sort = key.split('-');
        this.request.sortFeild = sort[0];
        this.request.sortValue = sort[1];
        if (this.request.sortValue == 'up') this.request.sortValue = true;
        if (this.request.sortValue == 'down') this.request.sortValue = false;
        this.filter();
    }

    selection(e: any) {
        console.log(e);
    }

    selectedDate() {
        let startDate = new Date(this.startDate);
        startDate.setDate(startDate.getDate() + 1);
        let endDate = new Date(this.endDate);
        endDate.setDate(endDate.getDate() + 1);
        this.request.startedDate = startDate.toISOString();
        this.request.endDate = endDate.toISOString();
        if (this.request.type) {
            this.filter();
        }
    }

    clearDate() {
        this.startDate = '';
        this.endDate = '';
        if (this.request.type) {
            this.request.startedDate = null;
            this.request.endDate = null;
            this.request.type = null;
            this.filter();
        }
    }

    search(request: any) {
        this.loading = true;
        this.page = 1;
        this.current_page = 1;
        if (request) {
            request = ('' + request).trim();
        }
        if (request == null || request == undefined) {
            this.keywords = '';
        } else {
            this.keywords = request;
        }
        this.request.keyword = this.keywords;
        this.request.page = this.page;
        this.customerService.search(this.request).subscribe(
            (data) => {
                this.loading = false;
                if (data) {
                    this.response = data;
                    this.checked();
                    this.totalPage = Number.parseInt((this.response.totalCount / this.pageSize).toString());
                    if (this.response.totalCount % this.pageSize > 0) this.totalPage++;
                    this.pageList = [];
                    for (let i = 1; i <= this.totalPage; i++) {
                        this.pageList.push(i);
                    }
                    if (this.response.data) {
                        this.response.data.forEach((element) => {
                            if (element.status == true) element.status = 'Hoạt động';
                            else if (element.status == false) element.status = 'Không hoạt động';
                            else element.status = 'Không hoạt động';
                            if (element.dob) {
                                element.dob = this.datePipe.transform(element.dob, 'dd/MM/yyyy');
                            }
                        });
                    }
                }
            },
            (error) => {
                this.loading = false;
                this.snackbar.openSnackbar(
                    'Không tìm thấy danh sách khách hàng',
                    2000,
                    'Đóng',
                    'center',
                    'bottom',
                    false,
                );
            },
        );
    }

    getDistrict(event: any) {
        this.district = '';
        this.ward = '';
        this.request.province = event;
        if (event == '') this.request.province = null;
        this.request.district = null;
        this.request.ward = null;
        this.filter();
        this.listProvinces.forEach((data) => {
            if (data.name == event) {
                this.provincesService.getDistrictsListByID(data.code).subscribe((res) => {
                    this.listDistricts = res.districts;
                });
            }
        });
    }

    getWard(event: any) {
        this.ward = '';
        this.request.district = event;
        if (event == '') this.request.district = null;
        this.request.ward = null;
        this.filter();
        this.listDistricts.forEach((data) => {
            if (data.name == event) {
                this.provincesService.getWardsListByID(data.code).subscribe((res) => {
                    this.listWards = res.wards;
                });
            }
        });
    }

    getAddress(event: any) {
        this.request.ward = event;
        if (event == '') this.request.ward = null;
        this.filter();
    }

    searchUser(request: any) {
        const type = Number.parseInt(('' + request).split(',')[0]);
        const id = ('' + request).split(',')[1];

        if (type == 0 || type == 1) {
            this.request.groupId = id;
            this.request.employeeId = null;
        } else if (type == 2) {
            this.request.groupId = null;
            this.request.employeeId = id;
        } else {
            this.request.groupId = null;
            this.request.employeeId = null;
        }
        this.filter();
    }

    filter() {
        this.loading = true;
        this.page = 1;
        this.current_page = 1;
        this.request.keyword = this.keywords;
        this.request.page = this.page;
        this.customerService.search(this.request).subscribe(
            (data) => {
                this.loading = false;
                if (data) {
                    this.response = data;
                    this.checked();
                    this.totalPage = Number.parseInt((this.response.totalCount / this.pageSize).toString());
                    if (this.response.totalCount % this.pageSize > 0) this.totalPage++;
                    this.pageList = [];
                    for (let i = 1; i <= this.totalPage; i++) {
                        this.pageList.push(i);
                    }
                    if (this.response.data) {
                        this.response.data.forEach((element) => {
                            if (element.status == true) element.status = 'Hoạt động';
                            else if (element.status == false) element.status = 'Không hoạt động';
                            else element.status = 'Không hoạt động';
                            if (element.dob) {
                                element.dob = this.datePipe.transform(element.dob, 'dd/MM/yyyy');
                            }
                        });
                    }
                } else {
                    this.snackbar.openSnackbar(
                        'Không tìm thấy danh sách khách hàng',
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
                    'Không tìm thấy danh sách khách hàng',
                    2000,
                    'Đóng',
                    'center',
                    'bottom',
                    false,
                );
            },
        );
    }
}
