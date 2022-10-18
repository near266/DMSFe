import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, map, Observable, Subject } from 'rxjs';
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
            width: '730px',
            height: '90vh',
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
    getAllBrands(): Observable<{ value: string | undefined; label: string | undefined }[]> {
        return this.productApiService.getAllBrands().pipe(
            map((res) => {
                return res.map((supplier) => {
                    return { value: supplier.id, label: supplier.brandName };
                });
            }),
        );
    }
    getAllUnits(): Observable<{ value: string | undefined; label: string | undefined }[]> {
        return this.productApiService.getAllUnits().pipe(
            map((res) => {
                return res.map((supplier) => {
                    return { value: supplier.id, label: supplier.unitName };
                });
            }),
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
            return this.productApiService.deleteProduct(id).subscribe({
                next: () => {
                    this.dialogService.closeAll();
                    this.productService.getAllProducts();
                },
                error: (err: HttpErrorResponse) => {
                    console.log(err);
                },
            });
        }
    }
}
