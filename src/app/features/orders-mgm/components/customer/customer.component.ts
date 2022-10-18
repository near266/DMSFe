import { Component, OnInit, DoCheck, OnDestroy, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CustomerService } from 'src/app/core/services/customer.service';
import { DataService } from 'src/app/core/services/data.service';

@Component({
    selector: 'app-customer',
    templateUrl: './customer.component.html',
    styleUrls: ['./customer.component.scss'],
})
export class CustomerComponent implements OnInit, DoCheck, OnDestroy, AfterViewInit {
    subscription!: Subscription;
    type: string = 'View';
    customerId: any = '';
    customerInfo: any;

    constructor(private dataservice: DataService, private customerService: CustomerService) {}

    ngOnInit(): void {
        this.subscription = this.dataservice.type.subscribe((data: any) => {
            this.type = data;
        });
        this.customerId = localStorage.getItem('customerId')!;
        this.getCustomerInfo();
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    ngAfterViewInit(): void {}

    ngDoCheck(): void {}

    getCustomerInfo() {
        this.customerService.get_by_id(this.customerId).subscribe((data) => {
            this.customerInfo = data;
            console.log(this.customerInfo);
        });
    }
}
