import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Config } from 'src/app/core/model/Config';
@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
    @Output() isShowSidebarOutput = new EventEmitter<boolean>();
    isShowSidebar = true;
    isSearchByBill = false;
    statusMenu: Config = {
        icon: '<i class="fa-solid fa-flag"></i>',
        title: 'Trạng thái',
        menuChildrens: [
            'Tất cả',
            'Chờ duyệt',
            'Đã duyệt',
            'Đã bán hàng',
            'Đã xuất hàng',
            'Từ chối'
        ],
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
    constructor() {}

    ngOnInit(): void {
        this.isShowSidebarOutput.emit(this.isShowSidebar);
    }

    toggleShowSidebar() {
        this.isShowSidebar = !this.isShowSidebar;
        this.isShowSidebarOutput.emit(this.isShowSidebar);
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
