import { Component, OnInit, AfterViewInit, Output, Input, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Config } from 'src/app/core/model/Config';
import { CustomerGroup } from 'src/app/core/model/CustomerGroup';
import { CustomerType } from 'src/app/core/model/CustomerType';
import { CustomerGroupService } from 'src/app/core/services/customer-group.service';
import { CustomerTypeService } from 'src/app/core/services/customer-type.service';
import { LogicService } from 'src/app/features/order-report/services/logic.service';
import { LogicServiceService } from '../../services/logicService.service';

@Component({
    selector: 'visit-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, AfterViewInit {
    body: any = {
        page: 1,
        pageSize: 5,
    };
    isShowEmployeeTree: boolean = false;
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
    listTypeCustomer: CustomerType[] = [];
    listGroupCustomer: CustomerGroup[] = [];
    range: FormGroup;
    isValidDate: boolean = true;

    private subscriptions = new Subscription();
    constructor(
        private customerType: CustomerTypeService,
        private customerGroup: CustomerGroupService,
        private logicServoice: LogicServiceService,
        private orderLogicService: LogicService,
        private fb: FormBuilder,
    ) {}

    ngOnInit(): void {
        this.range = this.fb.group({
            start: [null, Validators.required],
            end: [null, Validators.required],
        });
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.getListTypeCustomer();
            this.getListGroupCustomer();
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

    selectOrderEmployee(orderEmployeeId: string) {
        let id = orderEmployeeId.split(',')[1];
        this.body.employeeId = id;

        this.emitBody();
    }

    // Tìm kiếm theo loại khách hàng
    selectTypeCustomer(e: any) {
        this.body.customerTypeId = this.orderLogicService.filterId(this.listTypeCustomer, 'id', 'customerTypeName', e);

        this.emitBody();
    }

    // Tìm kiếm theo nhóm khách hàng
    selectGroupCustomer(e: any) {
        this.body.customerGroupId = this.orderLogicService.filterId(
            this.listGroupCustomer,
            'id',
            'customerGroupName',
            e,
        );
        this.emitBody();
    }

    emitBody() {
        this.body.page = 1;
        this.logicServoice.setBodySource(this.body);
    }

    changeDate() {
        if (this.range.valid) {
            this.isValidDate = true;
            this.body.fromDate = new Date(this.range.get('start')?.value).toISOString();
            this.body.toDate = new Date(this.range.get('end')?.value).toISOString();
            this.emitBody();
        } else {
            this.isValidDate = false;
        }
    }

    clearDate() {
        this.isValidDate = true;
        this.range.patchValue({
            start: null,
            end: null,
        });
        this.body.fromDate = null;
        this.body.toDate = null;
        this.emitBody();
    }
}
