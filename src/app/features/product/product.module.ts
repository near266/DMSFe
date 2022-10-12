import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductRoutingModule } from './product-routing.module';
import { ProductComponent } from './product.component';
import { SharedModule } from 'src/app/core/shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination'; // <-- import the module

import { ProductSidenavComponent } from './components/product-sidenav/product-sidenav.component';
import { ProductTableComponent } from './components/product-table/product-table.component';
import { ProductPaginationComponent } from './components/product-pagination/product-pagination.component';

@NgModule({
    declarations: [ProductComponent, ProductSidenavComponent, ProductTableComponent, ProductPaginationComponent],
    imports: [CommonModule, ProductRoutingModule, SharedModule, NgxPaginationModule],
})
export class ProductModule {}
