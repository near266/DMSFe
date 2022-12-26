import { Component, OnInit, AfterViewInit, Output, Input, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { Config } from 'src/app/core/model/Config';
import { CustomerGroup } from 'src/app/core/model/CustomerGroup';
import { CustomerType } from 'src/app/core/model/CustomerType';
import { CustomerGroupService } from 'src/app/core/services/customer-group.service';
import { CustomerTypeService } from 'src/app/core/services/customer-type.service';

@Component({
  selector: 'visit-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, AfterViewInit {
    @Input() body: any;
    @Output() body$ = new EventEmitter<Object>();
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

    private subscriptions = new Subscription();
    constructor(
      private customerType: CustomerTypeService,
      private customerGroup: CustomerGroupService
    ) { }

    ngOnInit(): void {
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

    }

    // Tìm kiếm theo loại khách hàng
    selectTypeCustomer(e: any) {
    }

    // Tìm kiếm theo nhóm khách hàng
    selectGroupCustomer(e: any) {
      
    }

    
    emitBody() {
      this.body$.emit(this.body);
    }
}
