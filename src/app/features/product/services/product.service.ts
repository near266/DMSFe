import { Injectable } from '@angular/core';
import { BehaviorSubject, of, tap } from 'rxjs';
import products from '../mocks/product';
import { Product } from '../models/product';
@Injectable({
    providedIn: 'root',
})
export class ProductService {
    private readonly defaultPage = 1;
    private readonly defaultPageSize = 30;
    private readonly defaultProducts = products;

    private products: BehaviorSubject<Product[]> = new BehaviorSubject<Product[]>(this.defaultProducts);
    private currentPage: BehaviorSubject<number> = new BehaviorSubject<number>(this.defaultPage);
    private currentPageSize: BehaviorSubject<number> = new BehaviorSubject<number>(this.defaultPageSize);
    private startAndEndIndex: BehaviorSubject<{ start: number; end: number }> = new BehaviorSubject<{
        start: number;
        end: number;
    }>({ start: 1, end: this.defaultPageSize + 1 });

    public products$ = this.products.asObservable();
    public currentPage$ = this.currentPage.asObservable();
    public currentPageSize$ = this.currentPageSize.asObservable();
    public startAndEndIndex$ = this.startAndEndIndex.asObservable();
    public totalProducts = this.defaultProducts.length;

    constructor() {}

    setCurrentPage(currentPage: number) {
        this.currentPage.next(currentPage);
        this.calculateStartAndEndPage();
    }

    calculateStartAndEndPage() {
        const currentPage = this.currentPage.value;
        const currentPageSize = this.currentPageSize.value;
        const start = (currentPage - 1) * currentPageSize + 1;
        //end is the length of defaultProducts if it is bigger than length of defaultProducts
        const end = Math.min(currentPage * currentPageSize + 1, this.defaultProducts.length);

        this.startAndEndIndex.next({ start, end });
    }
    filterCurrentProducts(page: number) {
        this.currentPage.next(page);
        const currentPage = this.currentPage.value;
        const currentPageSize = this.currentPageSize.value;
        const start = (currentPage - 1) * currentPageSize;
        const end = currentPage * currentPageSize;
        const currentProducts = this.products.value.slice(start, end);
        this.products.next(currentProducts);
    }
}
