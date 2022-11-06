import { Component, OnInit, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import moment from 'moment';
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
    isShowEmployeeTree = false;
    isSearchByBill = false;
    isSelectMenu = false;

    listTypeCustomerNameAndIds: any = [];
    listTypeCustomer: any = [];
    listGroupCustomer: any = [];
    listGroupCustomerAndIds: any = [];
    listSearchedProduct: any = [];
    areaList: any = [];

    productFilterCtrl: FormControl = new FormControl();
    isChoose = false;
    selected: any;

    searchText: string = '';
    statusMenu: Config = {
        icon: '<i class="fa-solid fa-flag-usa"></i>',
        title: 'Trạng thái',
        menuChildrens: ['Tất cả', 'Đã bán hàng', 'Đã xuất hàng'],
    };
    statusPrintMenu: Config = {
        icon: '<i class="fa-solid fa-print"></i>',
        title: 'Trạng thái in',
        menuChildrens: ['Tất cả', 'Đã in', 'Chưa in'],
    };
    sourceMenu: Config = {
        icon: '<i class="fa-solid fa-house"></i>',
        title: 'Nguồn',
        menuChildrens: ['Tất cả', 'Từ phiếu đặt hàng', 'Thêm trực tiếp'],
    };
    paymentMenu: Config = {
        icon: '<i class="fa-solid fa-credit-card"></i>',
        title: 'Thanh toán',
        menuChildrens: ['Tất cả', 'Đã gạch nợ', 'Chưa gạch nợ'],
    };
    typeCustomerMenu: Config = {
        icon: '<i class="fa-solid fa-vest-patches"></i>',
        title: 'Loại khách hàng',
        menuChildrens: this.listTypeCustomer,
    };
    groupCustomerMenu: Config = {
        icon: '<i class="fa-solid fa-users"></i>',
        title: 'Nhóm khách hàng',
        menuChildrens: ['Tất cả', 'Hợp đồng', 'KH lẻ'],
    };
    storageMenu: Config = {
        icon: '<i class="fa-solid fa-warehouse"></i>',
        title: 'Lưu trữ',
        menuChildrens: ['Tất cả', 'Mở', 'Khóa'],
    };

    body: any = {
        keyword: '',
        sortField: 'CreatedDate',
        isAscending: false,
        page: 1,
        pageSize: 30,
    };

    constructor(
        private fb: FormBuilder,
        private dataService: DataService,
        private customerType: CustomerTypeService,
        private customerGroup: CustomerGroupService,
        private purchaseOrder: PurchaseOrderService,
        private areaService: AreaService,
    ) {}

    formFilter = this.fb.group({
        keyword: null,
        deliveryDate: null,
        orderEmployeeId: null,
        customerTypeId: null,
        customerGroupId: null,
        areaId: null,
        productKey: null,
        status: null,
        printStatus: true,
        paymentMethod: 0,
        // page: 1,
        // pageSize: 100000,
        sortField: null,
        isAscending: true,
        fromDate: [null],
        toDate: [null],
        dateFilter: null,
    });

    ngOnInit(): void {
        this.isShowSidebarOutput.emit(this.isShowSidebar);
        // create search product form
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

    getAllArea() {
        this.areaService.get_all().subscribe((data) => {
            this.areaList = data;
            console.log(this.areaList);
        });
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

    searchKeyword() {
        this.dataService.searchKeyword(this.searchText);
    }

    toggleShowSidebar() {
        this.isShowSidebar = !this.isShowSidebar;
        this.isShowSidebarOutput.emit(this.isShowSidebar);
    }

    emitBody() {
        this.bodyFilter.emit(this.body);
    }

    toggleShowEmployeeTree() {
        this.isShowEmployeeTree = !this.isShowEmployeeTree;
    }

    selectOrderEmployee(e: any) {
        const id = ('' + e).split(',')[1];
        this.body.orderEmployeeId = id;
        this.body.page = 1;
        this.emitBody();
    }

    selectStatus(e: any) {
        switch (e) {
            case 'Tất cả': {
                e = null;
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
            default: {
                e = null;
                break;
            }
        }
        this.body.status = e;
        this.body.page = 1;
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

    selectSourceBill(e: any) {
        switch (e) {
            case 'Tất cả': {
                e = null;
                break;
            }
            case 'Từ phiếu đặt hàng': {
                e = true;
                break;
            }
            case 'Thêm trực tiếp': {
                e = false;
                break;
            }
            default: {
                e = null;
                break;
            }
        }
        this.body.sourceBill = e;
        this.body.page = 1;
        this.emitBody();
    }

    selectPayment(e: any) {
        console.log(e);
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

    selectArea(e: any) {
        this.body.areaId = e;
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
