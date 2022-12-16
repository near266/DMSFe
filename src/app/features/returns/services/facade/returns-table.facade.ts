import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
    BehaviorSubject,
    catchError,
    combineLatest,
    debounceTime,
    distinctUntilChanged,
    map,
    Observable,
    of,
    shareReplay,
    startWith,
    switchMap,
    tap,
} from 'rxjs';
import { Area } from 'src/app/core/model/Area';
import { CustomerType } from 'src/app/core/model/CustomerType';
import { Route } from 'src/app/core/model/Route';
import { SelectOption } from 'src/app/core/model/Select';
import { AreaService } from 'src/app/core/services/area.service';
import { CustomerGroupService } from 'src/app/core/services/customer-group.service';
import { CustomerTypeService } from 'src/app/core/services/customer-type.service';
import { RouteService } from 'src/app/core/services/route.service';
import { MenuItemType, sideMenuItemHelpers } from 'src/app/core/shared/modules/side-menu';
import { MenuItem, SelectOptionOutput } from 'src/app/core/shared/modules/side-menu/models/side-menu';
import { CustomerGroup } from 'src/app/features/order-manager/template-component/template-sidebar/template-sidebar.component';
import { ProductApiService } from 'src/app/features/product/apis/product.api.service';
import { Product } from 'src/app/features/product/models/product';
import { ReturnApiService } from '../../apis/return-api.service';
import { Employee, Return, ReturnResponse, Status } from '../../models/return';
import { Pagination, SidenavSettings } from '../../models/settings';

@Injectable()
export class ReturnsTableFacade {
    private PAGE_SIZE = 30;
    private DEFAULT_SETTINGS = {
        sortField: 'createdDate',
        isAscending: false,
    };
    private MENU_ITEMS = [
        sideMenuItemHelpers('Nhân viên đặt', MenuItemType.SEARCH, 'orderEmployee', 'fa-solid fa-user-secret', {
            placeholder: 'Chọn nhân viên đặt',
            values$: this.returnApiService.getEmployees().pipe(
                map((res) => res.data),
                map((result) =>
                    result.map((item: Employee) => {
                        return {
                            label: item.employeeName + ' - ' + item.employeeCode,
                            value: item.id,
                        } as SelectOption;
                    }),
                ),
            ),
        }),
        sideMenuItemHelpers('Viếng thăm', MenuItemType.SELECT, 'visit', 'fa-solid fa-home', {
            placeholder: '',
            values$: of([
                {
                    label: 'Có viếng thăm',
                    value: true,
                },
                {
                    label: 'Không viếng thăm',
                    value: false,
                },
            ]),
        }),
        sideMenuItemHelpers('Trạng thái', MenuItemType.SELECT, 'status', 'fa-solid fa-flag', {
            placeholder: '',
            values$: of([
                {
                    label: 'Chờ phê duyệt',
                    value: Status.PENDING,
                },
                {
                    label: 'Đã nhập trả',
                    value: Status.IMPORTED,
                },
                {
                    label: 'Đã duyệt',
                    value: Status.APPROVED,
                },
            ]),
        }),
        sideMenuItemHelpers('Tuyến', MenuItemType.SEARCH, 'routeId', 'fa-solid fa-shuffle', {
            placeholder: 'Chọn tuyến',
            values$: this.routeService.SearchAllRoute(1, 100, '', '', '').pipe(
                distinctUntilChanged(),
                map((result) => result.data),
                map((result) =>
                    result.map((item: Route) => {
                        return {
                            label: item.routeName + ' - ' + item.routeCode,
                            value: item.id,
                        } as SelectOption;
                    }),
                ),
                tap((res) => {
                    console.log(res);
                }),
            ),
        }),
        sideMenuItemHelpers('Loại khách hàng', MenuItemType.SEARCH, 'customerTypeId', 'fa-solid fa-user', {
            placeholder: 'Chọn loại khách hàng',
            values$: this.customerTypeService.get_all().pipe(
                map((result) =>
                    result.map((item: CustomerType) => {
                        return {
                            label: item.customerTypeName + ' - ' + item.customerTypeCode,
                            value: item.id,
                        } as SelectOption;
                    }),
                ),
            ),
        }),
        sideMenuItemHelpers('Nhóm khách hàng', MenuItemType.SEARCH, 'customerGroupId', 'fa-solid fa-users', {
            placeholder: 'Chọn nhóm khách hàng',
            values$: this.customerGroupService.get_all().pipe(
                map((result) =>
                    result.map((item: CustomerGroup) => {
                        return {
                            label: item.customerGroupName + ' - ' + item.customerGroupCode,
                            value: item.id,
                        } as SelectOption;
                    }),
                ),
            ),
        }),
        sideMenuItemHelpers('Khu vực', MenuItemType.SEARCH, 'areaId', 'fa-solid fa-earth-americas', {
            placeholder: 'Chọn Khu vực',
            values$: this.areaService.get_all().pipe(
                map((result) =>
                    result.map((item: Area) => {
                        return {
                            label: item.areaName + ' - ' + item.areaCode,
                            value: item.id,
                        } as SelectOption;
                    }),
                ),
            ),
        }),
        sideMenuItemHelpers('Nguồn đơn', MenuItemType.SELECT, 'isApp', 'fa-solid fa-desktop', {
            placeholder: '',
            values$: of([
                {
                    label: 'Mobile',
                    value: true,
                },
                {
                    label: 'Website',
                    value: false,
                },
            ]),
        }),
        sideMenuItemHelpers('Sản phẩm', MenuItemType.SEARCH, 'productId', 'fa-solid fa-box', {
            placeholder: 'Chọn sản phẩm',
            values$: this.productApiService
                .getAllProducts({
                    keyword: '',
                    page: 1,
                    pageSize: 100,
                })
                .pipe(
                    map((res) => res.data),
                    map((result) =>
                        result.map((item: Product) => {
                            return {
                                label: item.productName + ' - ' + item.sku,
                                value: item.id,
                            } as SelectOption;
                        }),
                    ),
                ),
        }),
    ];
    private DEFAULT_PAGINATION = {
        page: 1,
        pageSize: this.PAGE_SIZE,
    };
    private settings: BehaviorSubject<SidenavSettings> = new BehaviorSubject<SidenavSettings>(this.DEFAULT_SETTINGS);
    private pagination: BehaviorSubject<Pagination> = new BehaviorSubject<Pagination>(this.DEFAULT_PAGINATION);
    private loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    private totalItems: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    private menuItems: BehaviorSubject<MenuItem<SelectOption>[]> = new BehaviorSubject<MenuItem<SelectOption>[]>(
        this.MENU_ITEMS,
    );
    private cachedSidenavSettings: BehaviorSubject<SelectOptionOutput[]> = new BehaviorSubject<SelectOptionOutput[]>(
        [],
    );
    cachedTextSearch: BehaviorSubject<string> = new BehaviorSubject<string>('');
    menuItems$: Observable<MenuItem<SelectOption>[]> = combineLatest([this.menuItems, this.cachedSidenavSettings]).pipe(
        map(([menuItems, cachedSidenavSettings]) => this.mapMenuItems(menuItems, cachedSidenavSettings)),
    );
    loading$: Observable<boolean> = this.loading.asObservable();
    totalItems$: Observable<number> = this.totalItems.asObservable();
    settings$: Observable<SidenavSettings> = this.settings.asObservable();
    pagination$: Observable<Pagination> = this.pagination.asObservable().pipe(
        shareReplay(1),
        distinctUntilChanged((previous: Pagination, current: Pagination) => {
            return previous.page === current.page;
        }),
        debounceTime(0),
    );

    constructor(
        private routeService: RouteService,
        private customerTypeService: CustomerTypeService,
        private customerGroupService: CustomerGroupService,
        private areaService: AreaService,
        private returnApiService: ReturnApiService,
        private productApiService: ProductApiService,
    ) {}

    getReturns(query: FormControl): Observable<Return[]> {
        const textSearch$ = query.valueChanges.pipe(
            debounceTime(300),
            distinctUntilChanged(),
            tap((value) => {
                this.cachedTextSearch.next(value);
                this.handlePaginationChange(1);
            }),
            startWith(this.cachedTextSearch.getValue()),
        );
        return combineLatest([textSearch$, this.settings$]).pipe(
            tap(() => {
                this.loading.next(true);
                this.handlePaginationChange(1);
            }),
            map(([textSearch, settings]) => ({
                keyword: textSearch,
                ...settings,
            })),
            switchMap((params: SidenavSettings) =>
                this.pagination$.pipe(
                    map((pagination) => ({
                        ...params,
                        ...pagination,
                    })),
                    switchMap((settings: SidenavSettings) =>
                        this.returnApiService.getAllReturns(settings).pipe(
                            catchError(() => {
                                return of({
                                    data: [],
                                    totalCount: 0,
                                });
                            }),
                            tap((res: ReturnResponse) => {
                                this.totalItems.next(res.totalCount);
                                this.loading.next(false);
                            }),
                            map((res: ReturnResponse) => res.data || []),
                        ),
                    ),
                ),
            ),
        );
    }
    handleFilterChange(option: SelectOptionOutput) {
        console.log(this.cachedSidenavSettings.getValue());
        if (option.value !== null) {
            this.settings.next(Object.assign({}, this.settings.getValue(), { [option.filterType]: option.value }));
            //add to cachedSidenavSettings, if value is the same, do nothing, else update
            const cachedSidenavSettings = this.cachedSidenavSettings.getValue();
            const index = cachedSidenavSettings.findIndex((item) => item.filterType === option.filterType);
            if (index === -1) {
                cachedSidenavSettings.push(option);
            }
            if (index !== -1 && cachedSidenavSettings[index].value !== option.value) {
                cachedSidenavSettings[index] = option;
            }
            this.cachedSidenavSettings.next(cachedSidenavSettings);
        } else {
            const { [option.filterType]: removed, ...rest } = this.settings.getValue();
            this.settings.next(rest);
            //remove from cachedSidenavSettings
            const cachedSidenavSettings = this.cachedSidenavSettings.getValue();
            const index = cachedSidenavSettings.findIndex((item) => item.filterType === option.filterType);
            if (index !== -1) {
                cachedSidenavSettings.splice(index, 1);
            }
            this.cachedSidenavSettings.next(cachedSidenavSettings);
        }
    }
    handleSortFieldChange(option: { key: string; isAsc: boolean }) {
        //checkIf sortField ans isAsc is the same as current value
        const current = this.settings.getValue();
        if (current['sortField'] === option.key && current['isAscending'] === option.isAsc) {
            return;
        }
        this.settings.next(
            Object.assign({}, this.settings.getValue(), { sortField: option.key, isAscending: option.isAsc }),
        );
    }
    handleDateChange(fromDate: Date | null, toDate: Date | null) {
        //not change if date is null
        if (fromDate === null || toDate === null) {
            return;
        }
        this.handlePaginationChange(1);
        this.settings.next(Object.assign({}, this.settings.getValue(), { fromDate, toDate }));
    }

    handlePaginationChange(currentPage: number) {
        this.pagination.next({
            page: currentPage,
            pageSize: this.PAGE_SIZE,
        });
    }
    reload() {
        this.handlePaginationChange(1);
        this.settings.next(this.DEFAULT_SETTINGS);
        //bind menuItems to itself
        // clone MENU_ITEMS
        this.cachedSidenavSettings.next([]);
    }
    mapMenuItems(menuItems: MenuItem<SelectOption>[], cachedOptions: SelectOptionOutput[]): MenuItem<SelectOption>[] {
        //if cachedOptions is not empty, return menuItem but default option is cachedOption, match by filterType
        if (cachedOptions.length === 0) {
            return menuItems;
        }
        const newMenuItems = menuItems.map((item) => {
            const cachedOption = cachedOptions.find((option) => option.filterType === item.filterType);
            if (cachedOption) {
                return {
                    ...item,
                    currentOption: {
                        label: cachedOption.label,
                        value: cachedOption.value,
                    },
                };
            }
            return item;
        });
        return newMenuItems;
    }
}
