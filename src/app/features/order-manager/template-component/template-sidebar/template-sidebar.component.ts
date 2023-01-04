import {
    AfterViewInit,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
} from '@angular/core';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe-decorator';
import { FormControl } from '@angular/forms';
import moment from 'moment';
import { Observable, Subscription } from 'rxjs';
import { Config } from 'src/app/core/model/Config';
import { AreaService } from 'src/app/core/services/area.service';
import { CustomerGroupService } from 'src/app/core/services/customer-group.service';
import { CustomerTypeService } from 'src/app/core/services/customer-type.service';
import { Area } from '../../models/area';
import { Product } from '../../models/product';
import { CommonLogicService } from '../../services/commonLogic.service';

@Component({
    selector: 'order-template-sidebar',
    templateUrl: './template-sidebar.component.html',
    styleUrls: ['./template-sidebar.component.scss'],
})
export class TemplateSidebarComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
    @Input() type: string = '';
    @Input() body: any;
    @Output() body$ = new EventEmitter<Object>();

    private subscriptions = new Subscription();

    @AutoUnsubscribe()
    listProductActive$: Observable<Product[]> = this.commonLogicService.listProductActive$;
    searchText: string = '';
    isShowEmployeeTree: boolean = false;
    isSelectMenu: boolean = false;
    isChoose: boolean = false;
    listTypeCustomerNameAndIds: any = [];
    listGroupCustomer: string[] = [];
    listGroupCustomerAndIds: any = [];
    listTypeCustomer: string[] = [];
    areaList: Area[] = [];
    productFilterCtrl: FormControl = new FormControl();
    productSelected: any;
    areaSelected: any;
    // menu trạng thái đơn đặt
    statusPurchaseMenu: Config = {
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

    // Đơn bán
    sourceMenu: Config = {
        icon: '<i class="fa-solid fa-house"></i>',
        title: 'Nguồn',
        menuChildrens: ['Tất cả', 'Từ phiếu đặt hàng', 'Thêm trực tiếp'],
    };
    statusSaleMenu: Config = {
        icon: '<i class="fa-solid fa-flag"></i>',
        title: 'Trạng thái',
        menuChildrens: ['Tất cả', 'Đã bán hàng', 'Đã xuất hàng'],
    };

    constructor(
        private customerType: CustomerTypeService,
        private customerGroup: CustomerGroupService,
        private areaService: AreaService,
        private commonLogicService: CommonLogicService,
    ) {}

    ngOnInit(): void {
        this.searchProduct();
        this.getSearchText();
    }

    ngAfterViewInit(): void {
        this.getAllArea();
        this.getListTypeCustomer();
        this.getListGroupCustomer();
    }

    ngOnChanges(changes: SimpleChanges): void {}

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    getSearchText() {
        if (this.commonLogicService.getSearchTextSource()) {
            this.searchText = this.commonLogicService.getSearchTextSource();
            this.searchKeyword();
        }
    }

    emitBody() {
        this.body$.emit(this.body);
    }

    // Tìm kiếm theo keyword
    searchKeyword() {
        this.body.keyword = this.searchText.trim();
        this.body.page = 1;
        this.commonLogicService.setSearchTextSource(this.searchText.trim());
        this.emitBody();
    }

    // Tìm kiếm theo nhân viên đặt
    selectOrderEmployee(e: any) {
        const id = ('' + e).split(',')[1];
        this.body.orderEmployeeId = id;
        this.body.page = 1;
        this.emitBody();
    }

    // Đơn đặt từ trên app (đơn đặt)
    selectSourceApp(e: any) {
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
        this.body.page = 1;
        this.emitBody();
    }

    // Tìm theo trạng thái đơn đặt
    selectPurchaseStatus(e: any) {
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

    // Tìm theo trạng thái đơn bán
    selectSaleStatus(e: any) {
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

    // Tìm kiếm theo trạng thái in
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

    // Tìm kiếm theo viếng thăm (đơn đặt)
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

    // Tìm kiếm theo nguồn (đơn bán)
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

    // Tìm kiếm theo tuyến (đơn đặt)
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

    // Tìm kiếm theo loại khách hàng
    selectTypeCustomer(e: any) {
        let id = null;
        this.listTypeCustomerNameAndIds.forEach((type: any) => {
            if (type.customerTypeName === e) {
                id = type.id;
            }
        });
        this.body.customerTypeId = id;
        this.body.page = 1;
        this.emitBody();
    }

    // Tìm kiếm theo nhóm khách hàng
    selectGroupCustomer(e: any) {
        let id = null;
        this.listGroupCustomerAndIds.forEach((type: any) => {
            if (type.customerGroupName === e) {
                id = type.id;
            }
        });
        this.body.customerGroupId = id;
        this.body.page = 1;
        this.emitBody();
    }

    // Tìm kiếm theo khu vực
    selectArea(id: any, e: any) {
        if (e.isUserInput) {
            this.body.areaId = id;
            this.body.page = 1;
            this.emitBody();
        }
    }

    cancelSelectArea() {
        this.areaSelected = null;
        this.body.areaId = null;
        this.body.page = 1;
        this.emitBody();
    }

    // Tìm kiếm theo lưu trữ
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
        this.body.archived = e;
        this.body.page = 1;
        this.emitBody();
    }

    // Tìm kiếm theo ngày giao hàng
    selectDeliveryDate(e: any) {
        this.isChoose = true;
        this.body.deliveryDate = moment(e.value).format('YYYY-MM-DD');
        this.body.page = 1;
        this.emitBody();
    }

    // Tìm kiếm theo sản phẩm
    selectProductFilter(id: any, e: any) {
        if (e.isUserInput) {
            this.body.productId = id;
            this.body.page = 1;
            this.emitBody();
        }
    }

    cancelSelectProduct() {
        this.productSelected = null;
        this.body.productId = null;
        this.body.page = 1;
        this.emitBody();
    }

    searchProduct() {
        this.subscriptions.add(
            this.productFilterCtrl.valueChanges.subscribe((keyword) => {
                if (keyword != '') {
                    this.commonLogicService.searchListProductActived(keyword);
                }
            }),
        );
    }

    getListTypeCustomer() {
        this.subscriptions.add(
            this.customerType.get_all().subscribe((data) => {
                this.listTypeCustomerNameAndIds = data;
                this.listTypeCustomer = data?.map((type: any) => {
                    return type.customerTypeName;
                });
                this.listTypeCustomer.push('Tất cả');
                this.typeCustomerMenu.menuChildrens = this.listTypeCustomer;
            }),
        );
    }

    getListGroupCustomer() {
        this.subscriptions.add(
            this.customerGroup.get_all().subscribe((data: CustomerGroup[]) => {
                this.listGroupCustomerAndIds = data;
                this.listGroupCustomer = data?.map((group: any) => {
                    return group.customerGroupName;
                });
                this.listGroupCustomer.push('Tất cả');
                this.groupCustomerMenu.menuChildrens = this.listGroupCustomer;
            }),
        );
    }

    getAllArea() {
        this.subscriptions.add(
            this.areaService.get_all().subscribe((data: Area[]) => {
                this.areaList = data;
            }),
        );
    }
}

export class CustomerGroup {
    id: string;
    serial: number;
    customerGroupCode: string;
    customerGroupName: string;
    deptLimit: number;
    status: boolean;
}
