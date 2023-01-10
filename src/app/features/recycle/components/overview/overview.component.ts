import { Component, OnInit, AfterViewInit, DoCheck, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { Title } from '@angular/platform-browser';
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
        pagesize: 25
    }

    totalCount: number = 0;
    totalProduct: number = 0;
    totalOrder: number = 0;
    totalCustomer: number = 0;

    constructor(private title: Title, private logic: LogicService) {}

    ngOnInit(): void {
        this.title.setTitle('Thùng rác');
        this.logic.totalCustomer$.subscribe(data => {
            Promise.resolve().then(() => {
                this.totalCustomer = data;
                this.totalCount = this.totalCustomer + this.totalOrder + this.totalProduct;
            });
        })

        this.logic.totalProduct$.subscribe(data => {
            Promise.resolve().then(() => {
                this.totalProduct = data;
                this.totalCount = this.totalCustomer + this.totalOrder + this.totalProduct;
            });
        })

        this.logic.totalOrder$.subscribe(data => {
            Promise.resolve().then(() => {
                this.totalOrder = data;
                this.totalCount = this.totalCustomer + this.totalOrder + this.totalProduct;
            });
        })

    }

    ngAfterViewInit(): void {
        // this.logic.getCustomer(this.body);
    }
    ngOnChanges(changes: SimpleChanges): void {}
    ngDoCheck(): void {}
    ngOnDestroy(): void {}
}
