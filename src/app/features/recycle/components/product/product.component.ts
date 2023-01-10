import { Component, OnInit } from '@angular/core';
import { IBody } from '../../models/IBody';
import { IDataTable } from '../../models/IDataTable';
import { IListReturn } from '../../models/IListReturn';
import { Product } from '../../models/Product';
import { LogicService } from '../../services/logic.service';

@Component({
    selector: 'app-product',
    templateUrl: './product.component.html',
    styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {
    title = 'Sản phẩm';
    command: string = '';
    status: boolean;

    product: Product[] = [];
    data: IDataTable[] = [];
    totalCount = 0;

    body: IBody = {
        page: 1,
        pagesize: 30,
    };

    constructor(private logic: LogicService) {}

    ngOnInit(): void {
        this.logic.products$.subscribe((data) => {
            Promise.resolve().then(() => {
                this.product = data;
                if (this.product) {
                    this.data = [];
                    this.product.forEach((element) => {
                        let item: IDataTable = {
                            id: element.id,
                            title: element.productName,
                            lastModifiedBy: element.lastModifiedBy,
                            lastModifiedDate: element.lastModifiedDate,
                        };
                        this.data.push(item);
                    });
                }
            });
        });
        this.logic.totalProduct$.subscribe((data) => {
            Promise.resolve().then(() => {
                this.totalCount = data;
            });
        });
    }

    getData() {
        this.logic.getProduct(this.body);
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
            this.logic.restoreProduct(event.list, this.body);
        } else if (event.type == 'delete') {
            const body = {
                id: event.list,
            };
            this.logic.deleteProduct(body, this.body);
        }
    }
}
