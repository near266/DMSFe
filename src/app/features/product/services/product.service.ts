import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { ProductApiService } from '../apis/product.api.service';
import products from '../mocks/product';
import { Product } from '../models/product';
@Injectable({
    providedIn: 'root',
})
export class ProductService {
    private readonly defaultPage = 1;
    private readonly defaultPageSize = 30;
    private readonly defaultProducts = [];

    private products: BehaviorSubject<Product[]> = new BehaviorSubject<Product[]>(this.defaultProducts);
    private currentPage: BehaviorSubject<number> = new BehaviorSubject<number>(this.defaultPage);
    private currentPageSize: BehaviorSubject<number> = new BehaviorSubject<number>(this.defaultPageSize);
    private startAndEndIndex: BehaviorSubject<{ start: number; end: number }> = new BehaviorSubject<{
        start: number;
        end: number;
    }>({ start: 1, end: this.defaultPageSize + 1 });
    private totalProducts: BehaviorSubject<number> = new BehaviorSubject<number>(0);

    public products$ = this.products.asObservable();
    public currentPage$ = this.currentPage.asObservable();
    public currentPageSize$ = this.currentPageSize.asObservable();
    public startAndEndIndex$ = this.startAndEndIndex.asObservable();
    public totalProducts$ = this.totalProducts.asObservable();

    constructor(private productApiService: ProductApiService) {}

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
    public getAllProducts() {
        const settings = {
            sortBy: {
                property: 'createdDate',
                value: true,
            },
            page: 1,
            pageSize: 30,
        };
        this.productApiService.getAllProducts(settings).subscribe((res: { data: Product[]; totalCount: number }) => {
            this.products.next(res.data);
            this.totalProducts.next(res.totalCount);
        });
    }
}
