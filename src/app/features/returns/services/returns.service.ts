import { Injectable } from '@angular/core';
import { BehaviorSubject, map, pipe, take } from 'rxjs';
import { ReturnApiService } from '../apis/return-api.service';

import { Return } from '../models/return';

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

    public returns$ = this.returns.asObservable();
    public currentPage$ = this.currentPage.asObservable();
    public currentPageSize$ = this.currentPageSize.asObservable();
    public startAndEndIndex$ = this.startAndEndIndex.asObservable();
    public totalReturns$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

    constructor(private returnApiService: ReturnApiService) {}

    getInititalReturns(page: number = 1) {
        this.getReturnsByPage(1)
            .pipe(take(1))
            .subscribe((res) => {
                this.returns.next(res);
            });
    }
    getReturnsByPage(page: number) {
        return this.returnApiService.getAllReturns(page).pipe(
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
