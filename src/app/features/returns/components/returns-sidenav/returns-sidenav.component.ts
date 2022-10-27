import { Component, OnInit } from '@angular/core';
import { ReturnsFilterService } from '../../services/returns-filter.service';
import { ReturnsService } from '../../services/returns.service';
import * as _ from 'lodash';
import { Config } from 'src/app/core/model/Config';

@Component({
    selector: 'app-returns-sidenav',
    templateUrl: './returns-sidenav.component.html',
    styleUrls: ['./returns-sidenav.component.scss'],
})
export class ReturnsSidenavComponent implements OnInit {
    searchValues: string = '';
    statusMenu: Config = {
        icon: '<i class="fa-solid fa-flag"></i>',
        title: 'Trạng thái',
        menuChildrens: ['Tất cả', 'Chờ duyệt', 'Đã duyệt', 'Đã bán hàng', 'Đã xuất hàng', 'Từ chối'],
    };
    constructor(private returnsService: ReturnsService, private filterService: ReturnsFilterService) {
        this.search = _.debounce(this.search, 500);
    }

    ngOnInit(): void {}
    search(event: string): void {
        this.filterService.keyword$.next(event);
        this.returnsService.getInititalReturns(1);
    }
    select(e: any) {
        console.log(e);
    }
}
