import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PhotosRoutingModule } from './photos-routing.module';
import { PhotosComponent } from './photos.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/core/shared/shared.module';
import { PhotoNewCustomerComponent } from './components/photo-new-customer/photo-new-customer.component';


@NgModule({
  declarations: [
    PhotosComponent,
    PhotoNewCustomerComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    PhotosRoutingModule
  ]
})
export class PhotosModule { }
