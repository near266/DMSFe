import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatSidenav } from '@angular/material/sidenav';
import { Observable } from 'rxjs';
import { SelectOption } from 'src/app/core/model/Select';
import { RolesService } from 'src/app/core/services/roles.service';
import { MenuItem, SelectOptionOutput } from 'src/app/core/shared/modules/side-menu/models/side-menu';
import { Return } from './models/return';
import { Pagination, SidenavSettings } from './models/settings';
import { ReturnsTableFacade } from './services/facade/returns-table.facade';
import { SidenavService } from './services/sidenav.service';
import { sortList, timeSortList } from './utils/sort';

@Component({
    selector: 'app-returns',
    templateUrl: './returns.component.html',
    styleUrls: ['./returns.component.scss'],
    providers: [ReturnsTableFacade],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReturnsComponent implements OnInit {
    @ViewChild('drawer') sidenav: MatSidenav;
    query: FormControl = new FormControl();
    menuItems$: Observable<MenuItem<SelectOption>[] | null> = this.facade.menuItems$;
    listMenu = sortList;
    timeSortList = timeSortList;
    dateSearchForm: FormGroup;
    settings$: Observable<SidenavSettings> = this.facade.settings$;
    returns$: Observable<Return[]>;
    totalItems$: Observable<number> = this.facade.totalItems$;
    loading$: Observable<boolean> = this.facade.loading$;
    pagination$: Observable<Pagination> = this.facade.pagination$;
    constructor(
        private sidenavService: SidenavService,
        private rolesService: RolesService,
        private facade: ReturnsTableFacade,
        private fb: FormBuilder,
    ) {}
    ngAfterViewInit(): void {
        this.sidenavService.setSideNav(this.sidenav);
    }
    requiredRoles(role: string) {
        return this.rolesService.requiredRoles(role);
    }
    ngOnInit(): void {
        this.returns$ = this.facade.getReturns(this.query);
        this.dateSearchForm = this.fb.group({
            fromDate: [null],
            toDate: [null],
        });
    }
    select(event: { key: string; isAsc: boolean }) {
        this.facade.handleSortFieldChange(event);
    }
    filterDate() {
        if (this.dateSearchForm.get('fromDate')?.value) {
            this.facade.handleDateChange(
                this.dateSearchForm.get('fromDate')?.value,
                this.dateSearchForm.get('toDate')?.value,
            );
        }
    }
    handleFilterChange(option: SelectOptionOutput) {
        this.facade.handleFilterChange(option);
    }

    clearDatePicker() {
        this.dateSearchForm.setValue({
            fromDate: null,
            toDate: null,
        });
    }
    handlePaginationChange(page: number) {
        this.facade.handlePaginationChange(page);
    }
    reload() {
        this.clearDatePicker();
        this.facade.reload();
    }
}
