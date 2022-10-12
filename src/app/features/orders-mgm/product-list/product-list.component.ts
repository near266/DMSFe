import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/core/services/data.service';

@Component({
    selector: 'app-product-list',
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit, OnDestroy {
    isSelectAll = false;
    subscription!: Subscription;
    from = '';

    constructor(private dataService: DataService, private router: Router,
        public dialogRef: MatDialogRef<ProductListComponent>) { }

    ngOnInit(): void {
        this.subscription = this.dataService.openProductFrom.subscribe((data: any) => {
            this.from = data;
        });
    }
    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
    stopPropagation(e: any) {
        e.stopPropagation();
    }
    navigateToClose() {
        if (this.from === 'create') {
            this.router.navigate(['/orders/createPerchaseOrder']);
        } else if (this.from === 'update') {
            this.router.navigate(['/orders/detailOrder/viewEdit']);
        }
    }
    closeDialog() {
        this.dialogRef.close();
    }
}
