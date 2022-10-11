import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewEditDetailRoutingModule } from './view-edit-detail-routing.module';
import { SharedModule } from 'src/app/core/shared/shared.module';
import { DetailOrderComponent } from './detail-order/detail-order.component';
import { DataService } from 'src/app/core/services/data.service';

@NgModule({
  declarations: [
    DetailOrderComponent
  ],
  imports: [CommonModule, ViewEditDetailRoutingModule, SharedModule],
})
export class ViewEditDetailOrderModule { }
