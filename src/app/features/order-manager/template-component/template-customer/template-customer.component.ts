import { Component, Input, OnInit, AfterViewInit, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CustomerService } from 'src/app/core/services/customer.service';
import { Customer } from 'src/app/features/route/models/searchAllCusInRoute';

@Component({
    selector: 'app-template-customer',
    templateUrl: './template-customer.component.html',
    styleUrls: ['./template-customer.component.scss'],
})
export class TemplateCustomerComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
    private subctriptions: Subscription = new Subscription();

    @Input() customerId: string;
    customerInfo: Customer;
    constructor(private customerService: CustomerService) {}

    ngOnInit(): void {}

    ngAfterViewInit(): void {}

    ngOnChanges(changes: SimpleChanges): void {
        if (this.customerId) {
            this.getCustomerInfo();
        }
    }

    ngOnDestroy(): void {
        this.subctriptions.unsubscribe();
    }

    getCustomerInfo() {
        this.subctriptions.add(
            this.customerService.get_by_id(this.customerId).subscribe((data) => {
                this.customerInfo = data;
                console.log(this.customerInfo);
            }),
        );
    }
}
