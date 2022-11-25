import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { Channel } from 'src/app/core/model/Channel';
import { Config } from 'src/app/core/model/Config';
import { CustomerType } from 'src/app/core/model/CustomerType';
import { AreaService } from 'src/app/core/services/area.service';
import { ChannelService } from 'src/app/core/services/channel.service';
import { CustomerGroupService } from 'src/app/core/services/customer-group.service';
import { CustomerTypeService } from 'src/app/core/services/customer-type.service';
import { ProductApiService } from 'src/app/features/product/apis/product.api.service';
import { Brand, Major, Supplier } from 'src/app/features/product/models/product';
import { SupplierService } from 'src/app/features/user-manage/suppliers/services/supplier.service';
import { Area, CustomerGroup } from '../../models/order-report';
import { LogicService } from '../../services/logic.service';

@Component({
    selector: 'report-template-sidebar',
    templateUrl: './template-sidebar.component.html',
    styleUrls: ['./template-sidebar.component.scss'],
})
export class TemplateSidebarComponent implements OnInit {
    @Input() body: any;
    @Output() body$ = new EventEmitter<Object>();

    private subscriptions = new Subscription();
    isShowEmployeeTree: boolean = false;
    listTypeCustomer: CustomerType[] = [];
    listGroupCustomer: CustomerGroup[] = [];
    areaList: Area[] = [];
    isSelectMenu: boolean = false;
    listChannel: Channel[] = [];
    listSupplier: Supplier[] = [];
    listBrand: Brand[] = [];
    listMajor: Major[] = [];

    typeCustomerMenu: Config = {
        icon: '<i class="fa-solid fa-vest-patches"></i>',
        title: 'Loại khách hàng',
        menuChildrens: [],
    };
    groupCustomerMenu: Config = {
        icon: '<i class="fa-solid fa-users"></i>',
        title: 'Nhóm khách hàng',
        menuChildrens: [],
    };
    channelMenu: Config = {
        icon: '<i class="fa-brands fa-youtube"></i>',
        title: 'Kênh',
        menuChildrens: [],
    };
    supplierMenu: Config = {
        icon: '<i class="fa-solid fa-warehouse"></i>',
        title: 'Nhà cung cấp',
        menuChildrens: [],
    };
    brandMenu: Config = {
        icon: '<i class="fa-sharp fa-solid fa-tags"></i>',
        title: 'Nhãn hiệu',
        menuChildrens: [],
    };
    majorMenu: Config = {
        icon: '<i class="fa-solid fa-chart-simple"></i>',
        title: 'Ngành hàng',
        menuChildrens: [],
    };

    constructor(
        private areaService: AreaService,
        private customerType: CustomerTypeService,
        private customerGroup: CustomerGroupService,
        private channelService: ChannelService,
        private supplierService: SupplierService,
        private productApi: ProductApiService,
        private logicService: LogicService,
    ) {}

    ngOnInit(): void {}

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.getAllArea();
            this.getListTypeCustomer();
            this.getListGroupCustomer();
            this.getListChannel();
            this.getListSupplier();
            this.getListBrand();
            this.getListMajor();
        }, 0);
    }

    getListTypeCustomer() {
        this.subscriptions.add(
            this.customerType.get_all().subscribe((data) => {
                this.listTypeCustomer = data;
                this.typeCustomerMenu.menuChildrens = this.listTypeCustomer.map((type: CustomerType) => {
                    return type.customerTypeName;
                });
                this.typeCustomerMenu.menuChildrens.unshift('Tất cả');
            }),
        );
    }

    getListGroupCustomer() {
        this.subscriptions.add(
            this.customerGroup.get_all().subscribe((data: CustomerGroup[]) => {
                this.listGroupCustomer = data;
                this.groupCustomerMenu.menuChildrens = this.listGroupCustomer?.map((group: any) => {
                    return group.customerGroupName;
                });
                this.groupCustomerMenu.menuChildrens.unshift('Tất cả');
            }),
        );
    }

    getListChannel() {
        this.subscriptions.add(
            this.channelService.get_all().subscribe((data: Channel[]) => {
                this.listChannel = data;
                this.channelMenu.menuChildrens = this.listChannel.map((channel: Channel) => {
                    return channel.channelName;
                });
                this.channelMenu.menuChildrens.unshift('Tất cả');
            }),
        );
    }

    getListSupplier() {
        this.subscriptions.add(
            this.productApi.getAllSuppliers().subscribe((data: Supplier[]) => {
                this.listSupplier = data;
                this.supplierMenu.menuChildrens = this.listSupplier.map((supplier: Supplier) => {
                    return supplier.supplierName!;
                });
                this.supplierMenu.menuChildrens.unshift('Tất cả');
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

    getListBrand() {
        this.subscriptions.add(
            this.productApi.getAllBrands().subscribe((data: Brand[]) => {
                this.listBrand = data;
                this.brandMenu.menuChildrens = this.listBrand.map((brand: Brand) => {
                    return brand.brandName!;
                });
                this.brandMenu.menuChildrens.unshift('Tất cả');
            }),
        );
    }

    getListMajor() {
        this.subscriptions.add(
            this.productApi.getAllMajors().subscribe((data: Major[]) => {
                this.listMajor = data;
                this.majorMenu.menuChildrens = this.listMajor.map((major: Major) => {
                    return major.commodityName!;
                });
                this.majorMenu.menuChildrens.unshift('Tất cả');
            }),
        );
    }

    searchCustomer(e: any) {
        this.body.customerKey = e.target.value.trim();
        this.emitBody();
    }

    searchProduct(e: any) {
        this.body.productKey = e.target.value.trim();
        this.emitBody();
    }

    // Tìm kiếm theo nhân viên/phòng ban
    selectOrderEmployee(e: any) {
        const id = ('' + e).split(',')[1];
        this.body.orderEmployee = id;
        this.emitBody();
    }

    // Tìm kiếm theo loại khách hàng
    selectTypeCustomer(e: any) {
        this.body.customerTypeId = this.logicService.filterId(this.listTypeCustomer, 'id', 'customerTypeName', e);
        this.emitBody();
    }

    // Tìm kiếm theo nhóm khách hàng
    selectGroupCustomer(e: any) {
        this.body.customerGroupId = this.logicService.filterId(this.listGroupCustomer, 'id', 'customerGroupName', e);
        this.emitBody();
    }

    // Tìm kiếm theo khu vực
    selectArea(e: any) {
        this.body.areaId = e;
        this.emitBody();
    }
    // Tìm kiếm theo kênh
    selectChannel(e: any) {
        this.body.channelId = this.logicService.filterId(this.listChannel, 'id', 'channelName', e);
        this.emitBody();
    }

    // Tìm kiếm theo nhà cung cấp
    selectSupplier(e: any) {
        this.body.supplierId = this.logicService.filterId(this.listSupplier, 'id', 'supplierName', e);
        this.emitBody();
    }

    // Tìm kiếm theo brand
    selectBrand(e: any) {
        this.body.brandId = this.logicService.filterId(this.listBrand, 'id', 'brandName', e);
        this.emitBody();
    }

    selectMajor(e: any) {
        this.body.majorId = this.logicService.filterId(this.listMajor, 'id', 'commodityName', e);
        this.emitBody();
    }

    emitBody() {
        this.body$.emit(this.body);
    }
}
