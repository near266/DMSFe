import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserManageComponent } from './user-tree/user-manage.component';
import { Router, RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/core/shared/shared.module';
import { ComponentModule } from 'src/app/core/component/component.module';
import { AddUserComponent } from './user-tree/add-user/add-user.component';
import { DetailUserComponent } from './user-tree/detail-user/detail-user.component';
import { InforComponent } from './user-tree/add-user/infor/infor.component';
import { ConfigComponent } from './user-tree/add-user/config/config.component';
import { AppComponent } from './user-tree/add-user/app/app.component';

import { MenuComponent } from './user-tree/add-user/menu/menu.component';
import { UserTreeViewComponent } from './user-tree/user-tree-view/user-tree-view.component';
import { ResetPasswordComponent } from './user-tree/detail-user/reset-password/reset-password.component';
import { DeleteUserComponent } from './user-tree/detail-user/delete-user/delete-user.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { WarehousesComponent } from './warehouses/warehouses.component';
import { AddManagerComponent } from './user-tree/add-manager/add-manager.component';
import { AddAccountantComponent } from './user-tree/add-accountant/add-accountant.component';
import { AddSalesTeamComponent } from './user-tree/add-sales-team/add-sales-team.component';
import { AddEmployeeComponent } from './user-tree/add-employee/add-employee.component';
import { AddUnitComponent } from './user-tree/add-unit/add-unit.component';
import { MoveUserComponent } from './user-tree/move-user/move-user.component';
import { UnitsComponent } from './units/units.component';
import { AddnitComponent } from './units/addnit/addnit.component';
import { DetailUnitComponent } from './units/detail-unit/detail-unit.component';
import { DetailComponent } from './units/detail-unit/detail/detail.component';
import { FormlyModule } from '@ngx-formly/core';
import { FormlySelectModule } from '@ngx-formly/core/select';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { ProductFieldWrapper } from '../product/components/add-product-dialog/add-product-details/product-field-wrapper/product-field-wrapper.component';
import { ProductFieldInput, ProductFieldSelect } from '../product/components/add-product-dialog/add-product-details/product-field-type/product-field-type.component';
import { EditGroupComponent } from './user-tree/edit-group/edit-group.component';
import { BranchsComponent } from './branchs/branchs.component';
import { AddBrandComponent } from './branchs/add-brand/add-brand.component';
import { BrandComponent } from './branchs/brand/brand.component';
import { DetailBrandComponent } from './branchs/brand/detail-brand/detail-brand.component';
import { MajorsComponent } from './majors/majors.component';
import { AddMajorComponent } from './majors/add-major/add-major.component';
import { MajorComponent } from './majors/major/major.component';
import { DetailMajorComponent } from './majors/major/detail-major/detail-major.component';

const routes: Routes = [
    {
        path: 'tree',
        component: UserManageComponent,
    },
    {
        path: 'warehouses',
        component: WarehousesComponent,
    },
    {
        path: 'units',
        component: UnitsComponent,
    },
    {
        path: 'brand',
        component: BranchsComponent,
    },
    {
        path: 'major',
        component: MajorsComponent,
    },
];

@NgModule({
    declarations: [
        UserManageComponent,
        AddUserComponent,
        DetailUserComponent,
        InforComponent,
        ConfigComponent,
        AppComponent,
        MenuComponent,

        UserTreeViewComponent,
        ResetPasswordComponent,
        DeleteUserComponent,
        WarehousesComponent,
        AddManagerComponent,
        AddAccountantComponent,
        AddSalesTeamComponent,
        AddEmployeeComponent,
        AddUnitComponent,
        MoveUserComponent,
        UnitsComponent,
        EditGroupComponent,
        AddnitComponent,
        DetailUnitComponent,
        DetailComponent,
        BranchsComponent,
        AddBrandComponent,
        BrandComponent,
        DetailBrandComponent,
        MajorsComponent,
        AddMajorComponent,
        MajorComponent,
        DetailMajorComponent,
    ],
    imports: [
        CommonModule, RouterModule.forChild(routes), 
        SharedModule, 
        NgxPaginationModule,
        FormlyModule.forChild({
            wrappers: [
                { name: 'unit', component: ProductFieldWrapper },
                { name: 'brand', component: ProductFieldWrapper },
                { name: 'major', component: ProductFieldWrapper },
            ],
            types: [
                { name: 'unit-input', component: ProductFieldInput, wrappers: ['unit'] },
                { name: 'unit-select', component: ProductFieldSelect, wrappers: ['unit'] },
                { name: 'brand-input', component: ProductFieldInput, wrappers: ['brand'] },
                { name: 'brand-select', component: ProductFieldSelect, wrappers: ['brand'] },
                { name: 'major-input', component: ProductFieldInput, wrappers: ['major'] },
                { name: 'major-select', component: ProductFieldSelect, wrappers: ['major'] },
            ],
            validationMessages: [{ name: 'required', message: 'Trường này là bắt buộc' }],
        }),
        FormlySelectModule,
        FormlyMaterialModule,
    ],
    exports: [UserTreeViewComponent]
})
export class UserManageModule {}
