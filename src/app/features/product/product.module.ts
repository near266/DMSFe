import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductRoutingModule } from './product-routing.module';
import { ProductComponent } from './product.component';
import { SharedModule } from 'src/app/core/shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination'; // <-- import the module

import { ProductSidenavComponent } from './components/product-sidenav/product-sidenav.component';
import { ProductTableComponent } from './components/product-table/product-table.component';
import { ProductPaginationComponent } from './components/product-pagination/product-pagination.component';
import { AddProductDialogComponent } from './components/add-product-dialog/add-product-dialog.component';
import { EditProductDialogComponent } from './components/edit-product-dialog/edit-product-dialog.component';
import { AddProductDetailsComponent } from './components/add-product-dialog/add-product-details/add-product-details.component';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { FormlySelectModule } from '@ngx-formly/core/select';

import { ProductFieldWrapper } from './components/add-product-dialog/add-product-details/product-field-wrapper/product-field-wrapper.component';
import {
    ProductFieldInput,
    ProductFieldSelect,
} from './components/add-product-dialog/add-product-details/product-field-type/product-field-type.component';

@NgModule({
    declarations: [
        ProductComponent,
        ProductSidenavComponent,
        ProductTableComponent,
        ProductPaginationComponent,
        AddProductDialogComponent,
        EditProductDialogComponent,
        AddProductDetailsComponent,
        ProductFieldWrapper,
        ProductFieldInput,
        ProductFieldSelect,
    ],
    imports: [
        CommonModule,
        ProductRoutingModule,
        SharedModule,
        NgxPaginationModule,
        FormlyModule.forChild({
            wrappers: [{ name: 'product', component: ProductFieldWrapper }],
            types: [
                { name: 'product-input', component: ProductFieldInput, wrappers: ['product'] },
                { name: 'product-select', component: ProductFieldSelect, wrappers: ['product'] },
            ],
        }),
        FormlySelectModule,
        FormlyMaterialModule,
    ],
})
export class ProductModule {}
