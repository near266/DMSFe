import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { sortList } from '../product/utils/sort';
import { ReturnsService } from './services/returns.service';
import { SidenavService } from './services/sidenav.service';

@Component({
    selector: 'app-returns',
    templateUrl: './returns.component.html',
    styleUrls: ['./returns.component.scss'],
})
export class ReturnsComponent implements OnInit {
    @ViewChild('drawer') sidenav: MatSidenav;
    isShowSidebarToMargin = true;
    listMenu = sortList;
    sideBarWidth!: string;
    totalReturns: number;

    constructor(
        private sidenavService: SidenavService,
        private router: Router,
        private returnsService: ReturnsService,
    ) {}
    ngAfterViewInit(): void {
        this.sidenavService.setSideNav(this.sidenav);
    }

    ngOnInit(): void {
        this.totalReturns = this.returnsService.totalReturns;
    }
    select(event: any) {
        console.log(event);
    }
}
