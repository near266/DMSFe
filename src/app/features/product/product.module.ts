import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductRoutingModule } from './product-routing.module';
import { ProductComponent } from './product.component'
import { SharedModule } from 'src/app/core/shared/shared.module';
import { ProductSidenavComponent } from './components/product-sidenav/product-sidenav.component';


@NgModule({
  declarations: [
    ProductComponent,
    ProductSidenavComponent],
  imports: [
    CommonModule,
    ProductRoutingModule,
    SharedModule
  ]
})
export class ProductModule { }
