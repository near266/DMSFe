import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PhotoNewCustomerComponent } from './components/photo-new-customer/photo-new-customer.component';
import { PhotosComponent } from './photos.component';

const routes: Routes = [
    {
        path: '',
        component: PhotosComponent,
        children: [
            {
                path: '',
                component: PhotoNewCustomerComponent
            }
        ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PhotosRoutingModule { }
