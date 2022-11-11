import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { RolesService } from 'src/app/core/services/roles.service';
import { sortList, timeSortList } from './utils/sort';
import { ReturnsService } from './services/returns.service';
import { SidenavService } from './services/sidenav.service';
import { ReturnsFilterService } from './services/returns-filter.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import moment from 'moment';

@Component({
    selector: 'app-returns',
    templateUrl: './returns.component.html',
    styleUrls: ['./returns.component.scss'],
})
export class ReturnsComponent implements OnInit {
    @ViewChild('drawer') sidenav: MatSidenav;
    isShowSidebarToMargin = true;
    listMenu = sortList;
    timeSortList = timeSortList;
    sideBarWidth!: string;
    dateSearchForm: FormGroup;
    totalReturns$: Observable<number>;

    constructor(
        private sidenavService: SidenavService,
        private rolesService: RolesService,
        private returnsService: ReturnsService,
        private filterService: ReturnsFilterService,
        private fb: FormBuilder,
    ) {}
    ngAfterViewInit(): void {
        this.sidenavService.setSideNav(this.sidenav);
    }
    requiredRoles(role: string) {
        return this.rolesService.requiredRoles(role);
    }
    ngOnInit(): void {
        this.dateSearchForm = this.fb.group({
            fromDate: [null],
            toDate: [null],
        });
        this.totalReturns$ = this.returnsService.totalReturns$;
    }
    select(event: any) {
        this.filterService.currentFiler$.next(event.key);
        this.filterService.isAscending$.next(event.isAsc);
        this.returnsService.getInititalReturns(1);
    }
    sortTime(event: any) {
        this.filterService.timeFilterType$.next(event.value);
        if (this.filterService.startDate$.getValue() || this.filterService.endDate$.getValue()) {
            this.returnsService.getInititalReturns(1);
        }
    }
    filterDate() {
        if (this.dateSearchForm.get('fromDate')?.value) {
            this.filterService.startDate$.next(moment(this.dateSearchForm.get('fromDate')?.value).format('YYYY-MM-DD'));
        }
        if (this.dateSearchForm.get('toDate')?.value) {
            this.filterService.endDate$.next(moment(this.dateSearchForm.get('toDate')?.value).format('YYYY-MM-DD'));
        }
        // set lại page
        this.returnsService.getInititalReturns(1);
    }

    clearDatePicker() {
        this.dateSearchForm.setValue({
            fromDate: null,
            toDate: null,
        });
        this.filterService.startDate$.next('');
        this.filterService.endDate$.next('');
    }
}
