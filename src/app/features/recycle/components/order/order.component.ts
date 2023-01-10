import { Component, OnInit } from '@angular/core';
import { IBody } from '../../models/IBody';
import { IDataTable } from '../../models/IDataTable';
import { IListReturn } from '../../models/IListReturn';
import { Order } from '../../models/Order';
import { LogicService } from '../../services/logic.service';

@Component({
    selector: 'app-order',
    templateUrl: './order.component.html',
    styleUrls: ['./order.component.scss'],
})
export class OrderComponent implements OnInit {
    title = 'Đơn hàng, bán hàng, trả hàng';
    totalCount = 0;
    command: string = '';
    status: boolean;

    body: IBody = {
        page: 1,
        pagesize: 10,
    };

    orders: Order[] = [];
    data: IDataTable[] = [];

    constructor(private logic: LogicService) {}

    ngOnInit(): void {
        this.logic.orders$.subscribe((data) => {
            Promise.resolve().then(() => {
                this.orders = data;
                if (this.orders) {
                    this.data = [];
                    this.orders.forEach((element) => {
                        let item: IDataTable = {
                            id: element.id,
                            title: element.orderCode,
                            lastModifiedBy: element.lastModifiedBy,
                            lastModifiedDate: element.lastModifiedDate,
                        };
                        if (element.customer) {
                            if (element.customer.customerCode) item.title += ', ' + element.customer.customerCode;
                            if (element.customer.customerName) item.title += ', ' + element.customer.customerName;
                            if (element.customer.address) item.title += ', ' + element.customer.address;
                        }
                        this.data.push(item);
                    });
                }
            });
        });

        this.logic.totalOrder$.subscribe((data) => {
            Promise.resolve().then(() => {
                this.totalCount = data;
            });
        });
    }

    getData() {
        this.logic.getOrder(this.body);
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
