import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Config } from 'src/app/core/model/Config';
import { DataService } from '../../services/data.service';
@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
    @Output() isShowSidebarOutput = new EventEmitter<boolean>();
    @Output() formFilterFromChild = new EventEmitter<any>();
    isShowSidebar = true;
    isSearchByBill = false;
    searchText: string = '';
    statusMenu: Config = {
        icon: '<i class="fa-solid fa-flag-usa"></i>',
        title: 'Trạng thái',
        menuChildrens: ['Tất cả', 'Đã bán hàng', 'Đã xuất hàng', 'Đã giao hàng', 'Hủy'],
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
        menuChildrens: ['Tất cả', 'VIP 1', 'VIP 2', 'VIP 3', 'VIP 4', 'Tiềm năng', 'Thân thiết', 'Vãng lai'],
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
    constructor(private fb: FormBuilder, private dataService: DataService) {}

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
        paymentMethod: null,
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

    selection1(e: any) {
        console.log(e);
    }

    selection2(e: any) {
        console.log(e);
    }

    selection3(e: any) {
        console.log(e);
    }

    selection4(e: any) {
        console.log(e);
    }

    selection5(e: any) {
        console.log(e);
    }

    selection6(e: any) {
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
