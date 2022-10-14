import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouteComponent } from './route.component';
import { SharedModule } from 'src/app/core/shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { RouteTreeViewComponent } from './route-tree-view/route-tree-view.component';

const routes: Routes = [
    {
        path: '',
        component: RouteComponent,
    },
];

@NgModule({
    declarations: [RouteComponent, RouteTreeViewComponent],
    imports: [CommonModule, SharedModule, RouterModule.forChild(routes)],
})
export class RouteModule {}
