import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Response } from 'src/app/core/model/Response';
import { CustomerService } from 'src/app/core/services/customer.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { Customer } from '../models/Customer';
import { IBody } from '../models/IBody';

@Injectable({
    providedIn: 'root',
})
export class LogicService {
    private readonly defaultCustomers: Customer[] = [];

    private customers: BehaviorSubject<Customer[]> = new BehaviorSubject<Customer[]>(this.defaultCustomers);
    private totalCustomer: BehaviorSubject<number> = new BehaviorSubject<number>(0);

    private totalCount: BehaviorSubject<number> = new BehaviorSubject<number>(0);

    public customers$ = this.customers.asObservable();
    public totalCustomer$ = this.totalCustomer.asObservable();
    public totalCount$ = this.totalCount.asObservable();

    constructor(private customerService: CustomerService, public snackbar: SnackbarService) {}

    getCustomer(body: IBody) {
        this.customerService.searchArchived(body.page, body.pagesize, body.keyword).subscribe(
            (response: Response<Customer>) => {
                if (response) {
                    if(response.data) this.customers.next(response.data);
                    else this.customers.next(this.defaultCustomers);
                    this.totalCustomer.next(response.totalCount);
                } else {
                    this.snackbar.openSnackbar(
                        'Không tìm thấy danh sách khách hàng',
                        2000,
                        'Đóng',
                        'center',
                        'bottom',
                        false,
                    );
                    this.customers.next(this.defaultCustomers);
                    this.totalCustomer.next(0);
                }
            },
            (error) => {
                this.snackbar.openSnackbar(
                    'Không tìm thấy danh sách khách hàng',
                    2000,
                    'Đóng',
                    'center',
                    'bottom',
                    false,
                );
                this.customers.next(this.defaultCustomers);
                this.totalCustomer.next(0);
            },
        );
    }
}
