import { Component, OnInit, AfterViewInit, DoCheck, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { IBody } from '../../models/IBody';
import { LogicService } from '../../services/logic.service';

@Component({
    selector: 'app-overview',
    templateUrl: './overview.component.html',
    styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent implements OnInit, AfterViewInit, DoCheck, OnChanges, OnDestroy {
    body: IBody = {
        page: 1,
        pagesize: 30,
    };

    totalCount: number = 0;
    totalProduct: number = 0;
    totalOrder: number = 0;
    totalCustomer: number = 0;

    subscription: Subscription;

    constructor(private title: Title, private logic: LogicService) {}

    ngOnInit(): void {
        this.title.setTitle('Thùng rác');
        this.logic.totalCustomer$.subscribe((data) => {
            Promise.resolve().then(() => {
                this.totalCustomer = data;
                this.totalCount = this.totalCustomer + this.totalOrder + this.totalProduct;
            });
        });

        this.logic.totalProduct$.subscribe((data) => {
            Promise.resolve().then(() => {
                this.totalProduct = data;
                this.totalCount = this.totalCustomer + this.totalOrder + this.totalProduct;
            });
        });

        this.logic.totalOrder$.subscribe((data) => {
            Promise.resolve().then(() => {
                this.totalOrder = data;
                this.totalCount = this.totalCustomer + this.totalOrder + this.totalProduct;
            });
        });
        this.subscription = this.logic.changes$.subscribe((data) => {
            if (data == true) {
                this.getData();
            }
        });
    }

    ngAfterViewInit(): void {
        // this.logic.getCustomer(this.body);
    }
    ngOnChanges(changes: SimpleChanges): void {}
    ngDoCheck(): void {}
    ngOnDestroy(): void {
        this.subscription.unsubscribe()
    }

    getData() {
        this.logic.getCustomer(this.body);
        this.logic.getProduct(this.body);
        this.body.pagesize = 10;
        this.logic.getOrder(this.body);
        this.body.pagesize = 30;
    }
}
