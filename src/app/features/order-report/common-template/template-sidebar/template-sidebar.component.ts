import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { Config } from 'src/app/core/model/Config';
import { AreaService } from 'src/app/core/services/area.service';
import { ChannelService } from 'src/app/core/services/channel.service';
import { CustomerGroupService } from 'src/app/core/services/customer-group.service';
import { CustomerTypeService } from 'src/app/core/services/customer-type.service';
import { Area, CustomerGroup } from '../../models/order-report';

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
    listTypeCustomerNameAndIds: any = [];
    listGroupCustomer: string[] = [];
    listGroupCustomerAndIds: any = [];
    listTypeCustomer: string[] = [];
    areaList: Area[] = [];
    isSelectMenu: boolean = false;

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
    constructor(
        private areaService: AreaService,
        private customerType: CustomerTypeService,
        private customerGroup: CustomerGroupService,
        private channelService: ChannelService,
    ) {}

    ngOnInit(): void {}

    ngAfterViewInit(): void {
        this.getAllArea();
        this.getListTypeCustomer();
        this.getListGroupCustomer();
        this.getListChannel();
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

    getListChannel() {
        this.subscriptions.add(
            this.channelService.get_all().subscribe((data: CustomerGroup[]) => {
                console.log(data);
                // this.listGroupCustomerAndIds = data;
                // this.listGroupCustomer = data?.map((group: any) => {
                //     return group.customerGroupName;
                // });
                // this.listGroupCustomer.push('Tất cả');
                // this.groupCustomerMenu.menuChildrens = this.listGroupCustomer;
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

    emitBody() {
        this.body$.emit(this.body);
    }
}
