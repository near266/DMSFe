import { Component, OnInit, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Config } from 'src/app/core/model/Config';
import { CustomerGroupService } from 'src/app/core/services/customer-group.service';
import { CustomerTypeService } from 'src/app/core/services/customer-type.service';
import { DataService } from '../../services/data.service';
@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, AfterViewInit {
    @Output() isShowSidebarOutput = new EventEmitter<boolean>();
    @Output() formFilterFromChild = new EventEmitter<any>();
    @Output() bodyFilter = new EventEmitter<any>();
    isShowSidebar = true;
    isSearchByBill = false;
    listTypeCustomer: any = [];
    listGroupCustomer: any = [];

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
        fromDate: null,
        toDate: null,
        dateFilter: null,
    });

    ngOnInit(): void {
        this.isShowSidebarOutput.emit(this.isShowSidebar);
    }

    ngAfterViewInit(): void {
        this.customerType.get_all().subscribe((data) => {
            this.listTypeCustomer = data;
            this.listTypeCustomer = this.listTypeCustomer.map((type: any) => {
                return type.customerTypeName;
            });
            this.listTypeCustomer.push('Tất cả');
            this.typeCustomerMenu.menuChildrens = this.listTypeCustomer;
        });
        this.customerGroup.get_all().subscribe((data) => {
            this.listGroupCustomer = data;
            this.listGroupCustomer = this.listGroupCustomer.map((group: any) => {
                return group.customerGroupName;
            });
            this.listGroupCustomer.push('Tất cả');
            this.groupCustomerMenu.menuChildrens = this.listGroupCustomer;
        });
    }

    searchKeyword() {
        this.dataService.searchKeyword(this.searchText);
    }

    toggleShowSidebar() {
        this.isShowSidebar = !this.isShowSidebar;
        this.isShowSidebarOutput.emit(this.isShowSidebar);
    }

    filter() {
        // console.log(this.formFilter.value);
        this.formFilterFromChild.emit(this.formFilter.value);
    }

    emitBody() {
        this.bodyFilter.emit(this.body);
    }

    selectStatus(e: any) {
        console.log(e);
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
        this.emitBody();
    }

    selectPrintStatus(e: any) {
        console.log(e);
    }

    selectSource(e: any) {
        console.log(e);
    }

    selectPayment(e: any) {
        console.log(e);
    }

    selectTypeCustomer(e: any) {
        console.log(e);
    }

    selectGroupCustomer(e: any) {
        console.log(e);
    }

    selection7(e: any) {
        console.log(e);
    }

    selection8(e: any) {
        console.log(e);
    }

    selection9(e: any) {
        console.log(e);
    }

    selection10(e: any) {
        console.log(e);
    }
}
