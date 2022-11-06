import { Component, OnInit, Output, EventEmitter, AfterViewInit } from '@angular/core';
import moment from 'moment';
import { FormBuilder, FormControl } from '@angular/forms';
import { Config } from 'src/app/core/model/Config';
import { AreaService } from 'src/app/core/services/area.service';
import { CustomerGroupService } from 'src/app/core/services/customer-group.service';
import { CustomerTypeService } from 'src/app/core/services/customer-type.service';
import { PurchaseOrderService } from 'src/app/core/services/purchaseOrder.service';
import { DataService } from '../../services/data.service';
@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, AfterViewInit {
    @Output() isShowSidebarOutput = new EventEmitter<boolean>();
    @Output() bodyFilter = new EventEmitter<any>();

    isShowSidebar = true;
    isSearchByBill = false;
    isChoose = false;
    isShowEmployeeTree: boolean = false;
    searchText: string = '';
    listTypeCustomer: any = [];
    listTypeCustomerNameAndIds: any = [];
    listGroupCustomerAndIds: any = [];
    listGroupCustomer: any = [];
    areaList: any = [];
    listSearchedProduct: any = [];
    productFilterCtrl: FormControl = new FormControl();

    body: any = {
        keyword: '',
        sortField: 'CreatedDate',
        isAscending: false,
        page: 1,
        pageSize: 30,
    };

    statusMenu: Config = {
        icon: '<i class="fa-solid fa-flag"></i>',
        title: 'Trạng thái',
        menuChildrens: ['Tất cả', 'Chờ duyệt', 'Đã duyệt', 'Đã bán hàng', 'Đã xuất hàng', 'Từ chối'],
    };
    statusPrintMenu: Config = {
        icon: '<i class="fa-solid fa-print"></i>',
        title: 'Trạng thái in',
        menuChildrens: ['Tất cả', 'Đã in', 'Chưa in'],
    };
    visitionMenu: Config = {
        icon: '<i class="fa-solid fa-house"></i>',
        title: 'Viếng thăm',
        menuChildrens: ['Tất cả', 'Có viếng thăm', 'Không viếng thăm'],
    };
    lineMenu: Config = {
        icon: '<i class="fa-solid fa-shuffle"></i>',
        title: 'Tuyến',
        menuChildrens: ['Tất cả', 'Đúng tuyến', 'Không đúng tuyến'],
    };
    typeCustomerMenu: Config = {
        icon: '<i class="fa-solid fa-vest-patches"></i>',
        title: 'Loại khách hàng',
        menuChildrens: this.listTypeCustomer,
    };
    groupCustomerMenu: Config = {
        icon: '<i class="fa-solid fa-users"></i>',
        title: 'Nhóm khách hàng',
        menuChildrens: this.listGroupCustomer,
    };
    storageMenu: Config = {
        icon: '<i class="fa-solid fa-warehouse"></i>',
        title: 'Lưu trữ',
        menuChildrens: ['Tất cả', 'Mở', 'Khóa'],
    };
    sourceOrderMenu: Config = {
        icon: '<i class="fa-solid fa-pen-to-square"></i>',
        title: 'Đơn đặt từ trên app',
        menuChildrens: ['Tất cả', 'Từ App'],
    };
    constructor(
        private dataService: DataService,
        private customerType: CustomerTypeService,
        private customerGroup: CustomerGroupService,
        private purchaseOrder: PurchaseOrderService,
        private areaService: AreaService,
    ) {}

    ngOnInit(): void {
        this.isShowSidebarOutput.emit(this.isShowSidebar);
        this.productFilterCtrl.valueChanges.subscribe((data) => this.searchListProductActived(data));
    }

    ngAfterViewInit(): void {
        this.customerType.get_all().subscribe((data) => {
            this.listTypeCustomerNameAndIds = data;
            this.listTypeCustomer = data?.map((type: any) => {
                return type.customerTypeName;
            });
            this.listTypeCustomer.push('Tất cả');
            this.typeCustomerMenu.menuChildrens = this.listTypeCustomer;
        });
        this.customerGroup.get_all().subscribe((data) => {
            this.listGroupCustomerAndIds = data;
            this.listGroupCustomer = data?.map((group: any) => {
                return group.customerGroupName;
            });
            this.listGroupCustomer.push('Tất cả');
            this.groupCustomerMenu.menuChildrens = this.listGroupCustomer;
        });
        this.getAllArea();
    }

    searchListProductActived(value: any) {
        const body = {
            keyword: value,
            sortBy: {
                property: 'CreatedDate',
                value: true,
            },
            page: 1,
            pageSize: 3,
        };
        this.purchaseOrder.getListProductActived(body).subscribe((data) => {
            this.listSearchedProduct = data?.data;
        });
    }

    toggleShowEmployeeTree() {
        this.isShowEmployeeTree = !this.isShowEmployeeTree;
    }

    searchKeyword() {
        this.dataService.searchKeyword(this.searchText);
    }

    getAllArea() {
        this.areaService.get_all().subscribe((data) => {
            this.areaList = data;
            console.log(this.areaList);
        });
    }

    toggleShowSidebar() {
        this.isShowSidebar = !this.isShowSidebar;
        this.isShowSidebarOutput.emit(this.isShowSidebar);
    }

    emitBody() {
        this.bodyFilter.emit(this.body);
    }

    selectOrderEmployee(e: any) {
        const id = ('' + e).split(',')[1];
        this.body.orderEmployeeId = id;
        this.body.page = 1;
        this.emitBody();
    }

    selectSource(e: any) {
        switch (e) {
            case 'Tất cả': {
                e = null;
                break;
            }
            case 'Từ App': {
                e = true;
                break;
            }
            default: {
                e = null;
                break;
            }
        }
        this.body.isApp = e;
        this.emitBody();
    }

    selectStatus(e: any) {
        switch (e) {
            case 'Tất cả': {
                e = null;
                break;
            }
            case 'Chờ duyệt': {
                e = 1;
                break;
            }
            case 'Đã duyệt': {
                e = 2;
                break;
            }
            case 'Đã bán hàng': {
                e = 3;
                break;
            }
            case 'Đã xuất hàng': {
                e = 4;
                break;
            }
            case 'Từ chối': {
                e = 5;
                break;
            }
            default: {
                e = null;
                break;
            }
        }
        this.body.page = 1;
        this.body.status = e;
        this.emitBody();
    }

    selectPrintStatus(e: any) {
        switch (e) {
            case 'Tất cả': {
                e = null;
                break;
            }
            case 'Đã in': {
                e = true;
                break;
            }
            case 'Chưa in': {
                e = false;
                break;
            }
            default: {
                e = null;
                break;
            }
        }
        this.body.printStatus = e;
        this.body.page = 1;
        this.emitBody();
    }

    selectTypeCustomer(e: any) {
        let id = null;
        this.listTypeCustomerNameAndIds.forEach((type: any) => {
            if (type.customerTypeName === e) {
                id = type.id;
            }
        });
        console.log(id);
        this.body.customerTypeId = id;
        this.body.page = 1;
        this.emitBody();
    }

    selectGroupCustomer(e: any) {
        let id = null;
        this.listGroupCustomerAndIds.forEach((type: any) => {
            if (type.customerGroupName === e) {
                id = type.id;
            }
        });
        console.log(id);
        this.body.customerGroupId = id;
        this.body.page = 1;
        this.emitBody();
    }

    selectArea(e: any) {
        this.body.areaId = e;
        this.body.page = 1;
        this.emitBody();
    }

    selectVisit(e: any) {
        switch (e) {
            case 'Tất cả': {
                e = null;
                break;
            }
            case 'Có viếng thăm': {
                e = true;
                break;
            }
            case 'Không viếng thăm': {
                e = false;
                break;
            }
            default: {
                e = null;
                break;
            }
        }
        this.body.visit = e;
        this.body.page = 1;
        this.emitBody();
    }

    selectRoute(e: any) {
        switch (e) {
            case 'Tất cả': {
                e = null;
                break;
            }
            case 'Đúng tuyến': {
                e = true;
                break;
            }
            case 'Không đúng tuyến': {
                e = false;
                break;
            }
            default: {
                e = null;
                break;
            }
        }
        this.body.isRoute = e;
        this.body.page = 1;
        this.emitBody();
    }

    selectArchivedStatus(e: any) {
        switch (e) {
            case 'Tất cả': {
                e = null;
                break;
            }
            case 'Mở': {
                e = true;
                break;
            }
            case 'Khóa': {
                e = false;
                break;
            }
            default: {
                e = null;
                break;
            }
        }
        this.body.archived = e;
        this.body.page = 1;
        this.emitBody();
    }

    selectDeliveryDate(e: any) {
        this.isChoose = true;
        this.body.deliveryDate = moment(e.value).format('YYYY-MM-DD');
        this.body.page = 1;
        this.emitBody();
    }

    selectProductFilter(e: any) {
        this.body.productId = e;
        this.body.page = 1;
        this.emitBody();
    }
}
