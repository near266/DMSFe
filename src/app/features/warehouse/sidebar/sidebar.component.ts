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
            'Chưa chốt',
            'Chốt sổ'
        ],
    };
    statusPrintMenu: Config = {
        icon: '<i class="fa-solid fa-print"></i>',
        title: 'Trạng thái in',
        menuChildrens: ['Tất cả', 'Đã in', 'Chưa in'],
    };
    visitionMenu: Config = {
        icon: '<i class="fa-solid fa-industry"></i>',
        title: 'Nhà cung cấp',
        menuChildrens: ['Tất cả', 'Có viếng thăm', 'Không viếng thăm'],
    };
    lineMenu: Config = {
        icon: '<i class="fa-solid fa-grip"></i>',
        title: 'Loại nhập/xuất',
        menuChildrens: [
          'Tất cả',
          'Nhập mua NCC',
          'Xuất trả NCC',
          'Xuất bán KH',
          'Nhập trả KH',
          'Xuất sang kho NV',
          'Nhập từ kho NV',
          'Xuất điều chỉnh',
          'Nhập điều chỉnh',
          'Chuyển kho',
          'Chuyển kho từ phiếu đặt',
          'Chuyển kho chưa duyệt'
        ],
    };
    typeCustomerMenu: Config = {
        icon: '<i class="fa-solid fa-briefcase"></i>',
        title: 'Kho hàng',
        menuChildrens: ['Tất cả', 'VIP 1', 'VIP 2', 'VIP 3', 'VIP 4', 'Tiềm năng', 'Thân thiết', 'Vãng lai'],
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
