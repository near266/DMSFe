import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewEditDetailRoutingModule } from './view-edit-detail-routing.module';
import { SharedModule } from 'src/app/core/shared/shared.module';
import { DataService } from 'src/app/core/services/data.service';

@NgModule({
    declarations: [],
    imports: [CommonModule, ViewEditDetailRoutingModule, SharedModule],
})
export class ViewEditDetailOrderModule {}
