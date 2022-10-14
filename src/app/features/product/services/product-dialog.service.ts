import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, Observable } from 'rxjs';
import { AddProductDialogComponent } from '../components/add-product-dialog/add-product-dialog.component';
import { Product } from '../models/product';

@Injectable({
    providedIn: 'root',
})
export class ProductDialogService {
    private header: BehaviorSubject<string> = new BehaviorSubject<string>('');
    header$: Observable<string> = this.header.asObservable();
    openProductDialog(data: Product | null = null) {
        this.dialogService.open(AddProductDialogComponent, {
            width: '900px',
            height: '90vh',
            data,
        });
    }

    changeHeader(value: string) {
        this.header.next(value);
    }
    constructor(private dialogService: MatDialog) {}
}
