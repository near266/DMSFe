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

    totalCustomer: number = 0;

    constructor(private title: Title, private logic: LogicService) {}

    ngOnInit(): void {
        this.title.setTitle('Thùng rác');
    }

    ngAfterViewInit(): void {
        this.logic.getCustomer(this.body);
        this.logic.totalCustomer$.subscribe(data => {
            Promise.resolve().then(() => {
                this.totalCustomer = data;
            })
        })
    }
    ngOnChanges(changes: SimpleChanges): void {}
    ngDoCheck(): void {}
    ngOnDestroy(): void {}
}
