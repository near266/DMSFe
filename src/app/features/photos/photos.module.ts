import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PhotosRoutingModule } from './photos-routing.module';
import { PhotosComponent } from './photos.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/core/shared/shared.module';
import { PhotoNewCustomerComponent } from './components/photo-new-customer/photo-new-customer.component';
import { DetailPhotoComponent } from './components/detail-photo/detail-photo.component';
import { ScrollingModule } from '@angular/cdk/scrolling';

@NgModule({
  declarations: [
    PhotosComponent,
    PhotoNewCustomerComponent,
    DetailPhotoComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    ScrollingModule,
    PhotosRoutingModule
  ],
})
export class PhotosModule { }
