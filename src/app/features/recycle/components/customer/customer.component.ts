import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Customer } from '../../models/Customer';
import { IBody } from '../../models/IBody';
import { IDataTable } from '../../models/IDataTable';
import { IListReturn } from '../../models/IListReturn';
import { LogicService } from '../../services/logic.service';

@Component({
    selector: 'app-customer',
    templateUrl: './customer.component.html',
    styleUrls: ['./customer.component.scss'],
})
export class CustomerComponent implements OnInit, AfterViewInit {
    title = 'Khách hàng';
    totalCount: number = 0;
    command: string = '';
    status: boolean;

    body: IBody = {
        page: 1,
        pagesize: 30,
    };

    customer: Customer[] = [];
    data: IDataTable[] = [];

    constructor(private logic: LogicService) {}
    ngOnInit(): void {
        this.logic.customers$.subscribe((data) => {
            Promise.resolve().then(() => {
                this.customer = data;
                if (this.customer) {
                    this.data = [];
                    this.customer.forEach((element) => {
                        let item: IDataTable = {
                            id: element.id,
                            title: element.customerName,
                            lastModifiedBy: element.lastModifiedBy,
                            lastModifiedDate: element.lastModifiedDate,
                        };
                        this.data.push(item);
                    });
                }
            });
        });
        this.logic.totalCustomer$.subscribe((data) => {
            Promise.resolve().then(() => {
                this.totalCount = data;
            });
        });
    }
    ngAfterViewInit(): void {
        // this.getData();
    }

    getData() {
        this.logic.getCustomer(this.body);
    }

    signal(event: any) {
        if (event) {
            Promise.resolve().then(() => {
                this.command = event;
            });
        } else {
            Promise.resolve().then(() => {
                this.command = '';
            });
        }
    }

    refreshCommand(event: any) {
        if (event == 'restore') {
            Promise.resolve().then(() => {
                this.status = true;
            });
        } else {
            Promise.resolve().then(() => {
                this.status = false;
            });
        }

        Promise.resolve().then(() => {
            this.command = '';
        });
    }

    search(event: any) {
        this.body.page = 1;
        this.body.keyword = event;
        this.getData();
    }

    paginate(event: any) {
        this.body.page = event;
        this.getData();
    }

    getListId(event: IListReturn) {
        if (event.type == 'restore') {
            const body = {
                listId: event.list,
                archived: false,
            };
            this.logic.restoreCustomer(body, this.body);
        } else if (event.type == 'delete') {
            const body = {
                listId: event.list,
            };
            this.logic.deleteCustomer(body, this.body);
        }
    }
}
