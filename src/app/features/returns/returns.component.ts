import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { RolesService } from 'src/app/core/services/roles.service';
import { sortList } from './utils/sort';
import { ReturnsService } from './services/returns.service';
import { SidenavService } from './services/sidenav.service';
import { ReturnsFilterService } from './services/returns-filter.service';

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
        private rolesService: RolesService,
        private returnsService: ReturnsService,
        private filterService: ReturnsFilterService,
    ) {}
    ngAfterViewInit(): void {
        this.sidenavService.setSideNav(this.sidenav);
    }
    requiredRoles(role: string) {
        return this.rolesService.requiredRoles(role);
    }
    ngOnInit(): void {
        this.returnsService.totalReturns$.subscribe((res) => {
            this.totalReturns = res;
        });
    }
    select(event: any) {
        this.filterService.currentFiler$.next(event.key);
        console.log(event);
        this.filterService.isAscending$.next(event.isAsc);
        this.returnsService.getInititalReturns(1);
    }
}
