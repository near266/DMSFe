import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouteComponent } from './route.component';
import { SharedModule } from 'src/app/core/shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { RouteTreeViewComponent } from './route-tree-view/route-tree-view.component';
import { AddRouterComponent } from './add-router/add-router.component';
import { DetailRouterComponent } from './detail-router/detail-router.component';
import { InforRouterComponent } from './infor-router/infor-router.component';
import { LocationRouterComponent } from './location-router/location-router.component';
import { HistoryComponent } from './history/history.component';
import { UserManageModule } from '../user-manage/categories.module';
import { TreeGroupComponent } from './tree-group/tree-group.component';
import { AddCusToRouteComponent } from './components/add-cus-to-route/add-cus-to-route.component';
import { AddCusFromExcelComponent } from './components/add-cus-from-excel/add-cus-from-excel.component';

const routes: Routes = [
    {
        path: '',
        component: RouteComponent,
    },
];

@NgModule({
  declarations: [
    RouteComponent,
    RouteTreeViewComponent,
    AddRouterComponent,
    DetailRouterComponent,
    InforRouterComponent,
    LocationRouterComponent,
    HistoryComponent,
    TreeGroupComponent,
    AddCusToRouteComponent,
    AddCusFromExcelComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    // UserManageModule,
    RouterModule.forChild(routes)
  ]
})
export class RouteModule {}
