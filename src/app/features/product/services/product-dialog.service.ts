import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, map, Observable, startWith, Subject, tap } from 'rxjs';
import { SelectOption } from 'src/app/core/model/Select';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { ProductApiService } from '../apis/product.api.service';
import { AddProductDialogComponent } from '../components/add-product-dialog/add-product-dialog.component';
import { Product, Supplier } from '../models/product';
import { ProductService } from './product.service';

@Injectable({
    providedIn: 'root',
})
export class ProductDialogService {
    private header: BehaviorSubject<string> = new BehaviorSubject<string>('');
    public header$: Observable<string> = this.header.asObservable();
    public submitForm$: Subject<boolean> = new Subject<boolean>();
    public toggleEdit$: Subject<boolean> = new Subject<boolean>();
    openProductDialog(data: Product | null = null) {
        this.dialogService.open(AddProductDialogComponent, {
            width: '70%',
            height: '95vh',
            data,
        });
    }
    changeHeader(value: string) {
        this.header.next(value);
    }

    constructor(
        private dialogService: MatDialog,
        private productApiService: ProductApiService,
        private productService: ProductService,
        private snackbar: SnackbarService,
    ) {}

    getAllSuppliers(): Observable<{ value: string | undefined; label: string | undefined }[]> {
        return this.productApiService.getAllSuppliers().pipe(
            map((res) => {
                return res.map((supplier) => {
                    return { value: supplier.id, label: supplier.supplierName };
                });
            }),
        );
    }
    getAllBrands(): Observable<SelectOption[]> {
        return this.productApiService.getAllBrands().pipe(
            map((res) => {
                return res.map((supplier) => {
                    return { value: supplier.id || null, label: supplier.brandName };
                });
            }),
            tap((res) => res.unshift({ value: null, label: 'Không có' })),
        );
    }
    getAllUnits(): Observable<SelectOption[]> {
        return this.productApiService.getAllUnits().pipe(
            map((res) => {
                return res.map((supplier) => {
                    return { value: supplier.id || null, label: supplier.unitName };
                });
            }),
            tap((res) => res.unshift({ value: null, label: 'Không có' })),
        );
    }
    getAllMajors(): Observable<{ value: string | undefined; label: string | undefined }[]> {
        return this.productApiService.getAllMajors().pipe(
            map((res) => {
                return res.map((supplier) => {
                    return { value: supplier.id, label: supplier.commodityName };
                });
            }),
        );
    }
    getAllWarehouses(): Observable<{ value: string | undefined; label: string | undefined }[]> {
        return this.productApiService.getAllWarehouses().pipe(
            map((res) => {
                return res.map((supplier) => {
                    return { value: supplier.id, label: supplier.warehouseName };
                });
            }),
        );
    }
    //same as above for units

    deleteProduct(id: string | undefined) {
        if (id) {
            return this.productApiService.archiveListProduct([id]).subscribe({
                next: () => {
                    this.dialogService.closeAll();
                    this.productService.getInititalProducts(1);
                },
                error: (err: HttpErrorResponse) => {
                    this.snackbar.openSnackbar('Có lỗi xảy ra', 2000, 'Đóng', 'center', 'bottom', false);
                },
                complete: () => {
                    this.snackbar.openSnackbar('Xóa sản phẩm thành công', 2000, 'Đóng', 'center', 'bottom', true);
                },
            });
        }
    }
}
