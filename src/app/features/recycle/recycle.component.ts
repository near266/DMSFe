import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { IBody } from './models/IBody';
import { LogicService } from './services/logic.service';

@Component({
    selector: 'app-recycle',
    templateUrl: './recycle.component.html',
    styleUrls: ['./recycle.component.scss'],
})
export class RecycleComponent implements OnInit, AfterViewInit {
    body: IBody = {
        page: 1,
        pagesize: 30,
    };

    constructor(private title: Title, private logic: LogicService) {}
    ngOnInit(): void {
        this.title.setTitle('Thùng rác');
    }
    ngAfterViewInit(): void {
        this.getData();
    }

    getData() {
        this.logic.getCustomer(this.body);
        this.logic.getProduct(this.body);
        this.body.pagesize = 10;
        this.logic.getOrder(this.body);
        this.body.pagesize = 30;
    }
}
