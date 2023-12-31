import { AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Observable, Subscription, filter } from 'rxjs';
import { CustomerGroupService } from 'src/app/core/services/customer-group.service';
import { CustomerTypeService } from 'src/app/core/services/customer-type.service';
import { FakeData, FakeData2 } from './mocks/fakeData';
import { fakeData } from './mocks/mock';
import { Headers } from './model/header';
import { tableData } from './model/tableData';
import { LogicServiceService } from './services/logicService.service';

@Component({
    selector: 'app-visit-report',
    templateUrl: './visit-report.component.html',
    styleUrls: ['./visit-report.component.scss'],
})
export class VisitReportComponent implements OnInit {
    visitReport$: Observable<any> = this.logicService.visitReport$;
    headers = Headers;

    body: any = {
        page: 1,
        pageSize: 5,
    };
    bodySearch:any={
    name: '',
    page:1,
    pageSize:10,
    }
     
    
      
    fakeData = fakeData;

    constructor(private logicService: LogicServiceService, private async: AsyncPipe) {}

    ngOnInit(): void {}

    exportGross() {}

    exportNotGross() {}

    handleEmitBody(body: any) {
        this.body = body;
    }
    filter(){
        this.logicService.searchDetailReport(this.bodySearch);
    }
}
