import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import moment from 'moment';
import { Config } from 'src/app/core/model/Config';
import { AreaService } from 'src/app/core/services/area.service';
import { CustomerGroupService } from 'src/app/core/services/customer-group.service';
import { CustomerTypeService } from 'src/app/core/services/customer-type.service';
import { Product } from '../../models/product';
import { CommonLogicService } from '../../services/commonLogic.service';

@Component({
    selector: 'app-template-sidebar',
    templateUrl: './template-sidebar.component.html',
    styleUrls: ['./template-sidebar.component.scss'],
})
export class TemplateSidebarComponent implements OnInit {
    searchText: string = '';
    isShowEmployeeTree: boolean = false;
    isSelectMenu: boolean = false;
    isChoose: boolean = false;
    listTypeCustomerNameAndIds: any = [];
    listGroupCustomer: string[] = [];
    listGroupCustomerAndIds: any = [];
    listTypeCustomer: string[] = [];
    productFilterCtrl: FormControl = new FormControl();
    listSearchedProduct: Product[] = [];

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
        menuChildrens: ['Tất cả', 'Lưu trữ', 'Không lưu trữ'],
    };
    sourceOrderMenu: Config = {
        icon: '<i class="fa-solid fa-pen-to-square"></i>',
        title: 'Đơn đặt từ trên app',
        menuChildrens: ['Tất cả', 'Từ App'],
    };

    constructor(
        private customerType: CustomerTypeService,
        private customerGroup: CustomerGroupService,
        private areaService: AreaService,
        private commonLogicService: CommonLogicService,
    ) {}

    ngOnInit(): void {
        this.productFilterCtrl.valueChanges.subscribe(
            (data) => (this.listSearchedProduct = this.commonLogicService.searchListProductActived(data)),
        );
    }

    searchKeyword() {}

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
        // this.body.isApp = e;
        // this.emitBody();
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
        // this.body.page = 1;
        // this.body.status = e;
        // this.emitBody();
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
        // this.body.printStatus = e;
        // this.body.page = 1;
        // this.emitBody();
    }

    selectTypeCustomer(e: any) {
        let id = null;
        this.listTypeCustomerNameAndIds.forEach((type: any) => {
            if (type.customerTypeName === e) {
                id = type.id;
            }
        });
        console.log(id);
        // this.body.customerTypeId = id;
        // this.body.page = 1;
        // this.emitBody();
    }

    selectGroupCustomer(e: any) {
        let id = null;
        this.listGroupCustomerAndIds.forEach((type: any) => {
            if (type.customerGroupName === e) {
                id = type.id;
            }
        });
        console.log(id);
        // this.body.customerGroupId = id;
        // this.body.page = 1;
        // this.emitBody();
    }

    selectArea(e: any) {
        // this.body.areaId = e;
        // this.body.page = 1;
        // this.emitBody();
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
        // this.body.visit = e;
        // this.body.page = 1;
        // this.emitBody();
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
        // this.body.isRoute = e;
        // this.body.page = 1;
        // this.emitBody();
    }

    selectArchivedStatus(e: any) {
        switch (e) {
            case 'Tất cả': {
                e = null;
                break;
            }
            case 'Lưu trữ': {
                e = true;
                break;
            }
            case 'Không lưu trữ': {
                e = false;
                break;
            }
            default: {
                e = false;
                break;
            }
        }
        // this.body.archived = e;
        // this.body.page = 1;
        // this.emitBody();
    }

    selectDeliveryDate(e: any) {
        // this.isChoose = true;
        // this.body.deliveryDate = moment(e.value).format('YYYY-MM-DD');
        // this.body.page = 1;
        // this.emitBody();
    }

    selectProductFilter(e: any) {
        // this.body.productId = e;
        // this.body.page = 1;
        // this.emitBody();
    }

    getListTypeCustomer() {
        this.customerType.get_all().subscribe((data) => {
            this.listTypeCustomerNameAndIds = data;
            this.listTypeCustomer = data?.map((type: any) => {
                return type.customerTypeName;
            });
            this.listTypeCustomer.push('Tất cả');
            this.typeCustomerMenu.menuChildrens = this.listTypeCustomer;
        });
        this.customerGroup.get_all().subscribe((data: CustomerGroup[]) => {
            this.listGroupCustomerAndIds = data;
            this.listGroupCustomer = data?.map((group: any) => {
                return group.customerGroupName;
            });
            this.listGroupCustomer.push('Tất cả');
            this.groupCustomerMenu.menuChildrens = this.listGroupCustomer;
        });
    }

    getListGroupCustomer() {}
}

export class CustomerGroup {
    id: string;
    serial: number;
    customerGroupCode: string;
    customerGroupName: string;
    deptLimit: number;
    status: boolean;
}
