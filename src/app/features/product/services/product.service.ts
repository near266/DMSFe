import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of, take, tap } from 'rxjs';
import { ProductApiService } from '../apis/product.api.service';
import { Product } from '../models/product';
import { FilterService } from './filter.service';
@Injectable({
    providedIn: 'root',
})
export class ProductService {
    private readonly defaultPage = 1;
    private readonly defaultPageSize = 30;
    private readonly defaultProducts = [];

    private isSucessUpdate: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    private listArchive: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
    private products: BehaviorSubject<Product[]> = new BehaviorSubject<Product[]>(this.defaultProducts);
    private currentPage: BehaviorSubject<number> = new BehaviorSubject<number>(this.defaultPage);
    private currentPageSize: BehaviorSubject<number> = new BehaviorSubject<number>(this.defaultPageSize);
    private startAndEndIndex: BehaviorSubject<{ start: number; end: number }> = new BehaviorSubject<{
        start: number;
        end: number;
    }>({ start: 1, end: this.defaultPageSize + 1 });
    private totalProducts: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    private tableLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public tableLoading$ = this.tableLoading.asObservable();
    public products$ = this.products.asObservable();
    public currentPage$ = this.currentPage.asObservable();
    public currentPageSize$ = this.currentPageSize.asObservable();
    public startAndEndIndex$ = this.startAndEndIndex.asObservable();
    public totalProducts$ = this.totalProducts.asObservable();
    public archivedProducts$ = this.listArchive.asObservable();
    public isSucess$ = this.isSucessUpdate.asObservable();

    constructor(private productApiService: ProductApiService, private filterService: FilterService) {}

    setListProductArchive(list: string[]) {
        this.listArchive.next(list);
    }
    setSucessUpdate(isUpdate: boolean) {
        this.isSucessUpdate.next(isUpdate);
    }
    setCurrentPage(currentPage: number) {
        this.tableLoading.next(true);
        this.getProductsByPage(currentPage).subscribe((data: any) => {
            this.products.next(data.data);
            this.tableLoading.next(false);
            this.totalProducts.next(data.totalCount);
            this.currentPage.next(currentPage);
            this.calculateStartAndEndPage();
        });
    }
    getInititalProducts(page: number = 1) {
        this.getProductsByPage(1)
            .pipe(take(1))
            .subscribe((res: any) => {
                this.products.next(res.data);
                this.totalProducts.next(res.totalCount || 0);
                this.calculateStartAndEndPage();
            });
    }
    getProductsByPage(page: number) {
        const type =
            this.filterService.currentFiler$.getValue() === ''
                ? 'CreatedDate'
                : this.filterService.currentFiler$.getValue();
        const ascending = this.filterService.isAscending$.getValue();
        const keyword = this.filterService.keyword$.getValue();
        const settings = {
            keyword,
            sortBy: {
                property: type,
                value: ascending,
            },
            page,
            pageSize: 30,
        };
        return this.productApiService.getAllProducts(settings);
    }

    calculateStartAndEndPage() {
        const currentPage = this.currentPage.getValue();
        const currentPageSize = this.currentPageSize.getValue();
        const start = (currentPage - 1) * currentPageSize + 1;
        //end is the length of defaultReturns if it is bigger than length of defaultReturns
        // console.log(currentPageSize, currentPage, start);

        const end = Math.min(currentPage * currentPageSize + 1, this.totalProducts?.getValue() || 0);

        this.startAndEndIndex.next({ start, end });
    }
}
