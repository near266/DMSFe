import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import returns from '../mocks/returns';
import { Return } from '../models/return';

@Injectable({
    providedIn: 'root',
})
export class ReturnsService {
    private readonly defaultPage = 1;
    private readonly defaultPageSize = 30;
    private readonly defaultReturns = returns;

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
    public totalReturns = this.defaultReturns.length;

    constructor() {}

    setCurrentPage(currentPage: number) {
        this.currentPage.next(currentPage);
        this.calculateStartAndEndPage();
    }

    calculateStartAndEndPage() {
        const currentPage = this.currentPage.value;
        const currentPageSize = this.currentPageSize.value;
        const start = (currentPage - 1) * currentPageSize + 1;
        //end is the length of defaultReturns if it is bigger than length of defaultReturns
        const end = Math.min(currentPage * currentPageSize + 1, this.defaultReturns.length);

        this.startAndEndIndex.next({ start, end });
    }
}
