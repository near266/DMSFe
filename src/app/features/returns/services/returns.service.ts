import { Injectable } from '@angular/core';
import { table } from 'console';
import * as _ from 'lodash';
import { BehaviorSubject, map, pipe, take } from 'rxjs';
import { ReturnApiService } from '../apis/return-api.service';

import { Return } from '../models/return';
import { ReturnsFilterService } from './returns-filter.service';

@Injectable({
    providedIn: 'root',
})
export class ReturnsService {
    private readonly defaultPage = 1;
    private readonly defaultPageSize = 30;
    private readonly defaultReturns = [];
    private returns: BehaviorSubject<Return[]> = new BehaviorSubject<Return[]>(this.defaultReturns);
    private currentPage: BehaviorSubject<number> = new BehaviorSubject<number>(this.defaultPage);
    private currentPageSize: BehaviorSubject<number> = new BehaviorSubject<number>(this.defaultPageSize);
    private startAndEndIndex: BehaviorSubject<{ start: number; end: number }> = new BehaviorSubject<{
        start: number;
        end: number;
    }>({ start: 1, end: this.defaultPageSize + 1 });
    private tableLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public tableLoading$ = this.tableLoading.asObservable();
    public returns$ = this.returns.asObservable();
    public currentPage$ = this.currentPage.asObservable();
    public currentPageSize$ = this.currentPageSize.asObservable();
    public startAndEndIndex$ = this.startAndEndIndex.asObservable();
    public totalReturns$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

    constructor(private returnApiService: ReturnApiService, private filterService: ReturnsFilterService) {}

    getInititalReturns(page: number = 1) {
        this.tableLoading.next(true);
        this.getReturnsByPage(1)
            .pipe(take(1))
            .subscribe({
                next: (res) => {
                    if (this.currentPage.getValue() !== 1) {
                        this.setCurrentPage(1);
                    }
                    this.calculateStartAndEndPage();
                    if (res) {
                        this.returns.next(res);
                    } else {
                        this.returns.next([]);
                    }
                    this.tableLoading.next(false);
                },
                error: (error) => {
                    this.returns.next([]);
                    this.tableLoading.next(false);
                },
            });
    }
    getReturnsByPage(page: number) {
        const type =
            this.filterService.currentFiler$.getValue() === ''
                ? 'CreatedDate'
                : this.filterService.currentFiler$.getValue();
        const ascending = this.filterService.isAscending$.getValue();
        const keyword = this.filterService.keyword$.getValue();
        const fromDate =
            this.filterService.startDate$.getValue() === '' ? null : this.filterService.startDate$.getValue();
        const toDate = this.filterService.endDate$.getValue() === '' ? null : this.filterService.endDate$.getValue();
        const dateFilter = this.filterService.timeFilterType$.getValue();
        const settings = {
            pageSize: 30,
            page,
            keyword,
            fromDate,
            toDate,
            sortField: type,
            isAscending: ascending,
        };
        const result = _.omitBy(settings, _.isNil);

        return this.returnApiService.getAllReturns(result).pipe(
            map((response: any) => {
                this.totalReturns$.next(response.totalCount || 0);
                return response.data;
            }),
        );
    }

    setCurrentPage(currentPage: number) {
        this.getReturnsByPage(currentPage).subscribe((data) => {
            this.returns.next(data);
            this.currentPage.next(currentPage);
            this.calculateStartAndEndPage();
        });
    }
    resetAllFilter() {
        this.filterService.currentFiler$.next('');
        this.filterService.isAscending$.next(false);
        this.filterService.keyword$.next('');
        this.filterService.startDate$.next('');
        this.filterService.endDate$.next('');
        this.filterService.timeFilterType$.next(1);
    }

    calculateStartAndEndPage() {
        const currentPage = this.currentPage.getValue();
        const currentPageSize = this.currentPageSize.getValue();
        const start = (currentPage - 1) * currentPageSize + 1;
        //end is the length of defaultReturns if it is bigger than length of defaultReturns
        console.log(currentPageSize, currentPage, start);

        const end = Math.min(currentPage * currentPageSize + 1, this.totalReturns$?.getValue() || 0);

        this.startAndEndIndex.next({ start, end });
    }
}
