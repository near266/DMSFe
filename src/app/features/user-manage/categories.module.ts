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
import { ChannelsComponent } from './channels/channels.component';
import { AddChannelComponent } from './channels/add-channel/add-channel.component';
import { ChannelComponent } from './channels/channel/channel.component';
import { DetailChannelComponent } from './channels/channel/detail-channel/detail-channel.component';
import { SuppliersComponent } from './suppliers/suppliers.component';
import { AddSupplierComponent } from './suppliers/add-supplier/add-supplier.component';
import { SupplierComponent } from './suppliers/supplier/supplier.component';
import { DetailSupplierComponent } from './suppliers/supplier/detail-supplier/detail-supplier.component';
import { CustomerGroupsComponent } from './customer-groups/customer-groups.component';
import { AddCustomerGroupsComponent } from './customer-groups/add-customer-groups/add-customer-groups.component';
import { CustomerGroupComponent } from './customer-groups/customer-group/customer-group.component';
import { DetailCustomerGroupComponent } from './customer-groups/customer-group/detail-customer-group/detail-customer-group.component';
import { CustomerTypesComponent } from './customer-types/customer-types.component';
import { CustomerTypeComponent } from './customer-types/customer-type/customer-type.component';
import { AddCustomerTypeComponent } from './customer-types/add-customer-type/add-customer-type.component';
import { DetailCustomerTypeComponent } from './customer-types/customer-type/detail-customer-type/detail-customer-type.component';
import { AddWarehouseComponent } from './warehouses/components/add-warehouse/add-warehouse.component';
import { UpdateWarehouseComponent } from './warehouses/components/update-warehouse/update-warehouse.component';
import { FormsComponent } from './warehouses/components/forms/forms.component';
import { AreasComponent } from './areas/areas.component';
import { AddAreaComponent } from './areas/add-area/add-area.component';
import { AreaComponent } from './areas/area/area.component';
import { DetailAreaComponent } from './areas/area/detail-area/detail-area.component';
import { FieldInput, FieldSelect } from './field-type/field-type.component';
import { AlbumsComponent } from './albums/albums.component';
import { AddAlbumComponent } from './albums/add-album/add-album.component';
import { AlbumComponent } from './albums/album/album.component';
import { DetailAlbumComponent } from './albums/album/detail-album/detail-album.component';
import { PaginationComponent } from './template-components/pagination/pagination.component';

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
        path: 'unit',
        component: UnitsComponent,
    },
    {
        path: 'brand',
        component: BranchsComponent,
    },
    {
        path: 'supplier',
        component: SuppliersComponent,
    },
    {
        path: 'major',
        component: MajorsComponent,
    },
    {
        path: 'customer-type',
        component: CustomerTypesComponent,
    },
    {
        path: 'customer-group',
        component: CustomerGroupsComponent,
    },
    {
        path: 'area',
        component: AreasComponent,
    },
    {
        path: 'channel',
        component: ChannelsComponent,
    },
    {
        path: 'album',
        component: AlbumsComponent,
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
        FieldInput,
        FieldSelect,

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
        ChannelsComponent,
        AddChannelComponent,
        ChannelComponent,
        DetailChannelComponent,
        SuppliersComponent,
        AddSupplierComponent,
        SupplierComponent,
        DetailSupplierComponent,
        CustomerGroupsComponent,
        AddCustomerGroupsComponent,
        CustomerGroupComponent,
        DetailCustomerGroupComponent,
        CustomerTypesComponent,
        CustomerTypeComponent,
        AddCustomerTypeComponent,
        DetailCustomerTypeComponent,
        AddWarehouseComponent,
        UpdateWarehouseComponent,
        FormsComponent,
        AreasComponent,
        AddAreaComponent,
        AreaComponent,
        DetailAreaComponent,
        AlbumsComponent,
        AddAlbumComponent,
        AlbumComponent,
        DetailAlbumComponent,
        PaginationComponent,
    ],
    imports: [
        CommonModule, RouterModule.forChild(routes), 
        SharedModule, 
        NgxPaginationModule,
        FormlyModule.forChild({
            wrappers: [
                { name: 'unit', component: ProductFieldWrapper },
                { name: 'brand', component: ProductFieldWrapper },
                { name: 'supplier', component: ProductFieldWrapper },
                { name: 'major', component: ProductFieldWrapper },
                { name: 'customerGroup', component: ProductFieldWrapper },
                { name: 'customerType', component: ProductFieldWrapper },
                { name: 'area', component: ProductFieldWrapper },
                { name: 'channel', component: ProductFieldWrapper },
                { name: 'album', component: ProductFieldWrapper },
            ],
            types: [
                { name: 'unit-input', component: FieldInput, wrappers: ['unit'] },
                { name: 'unit-select', component: FieldSelect, wrappers: ['unit'] },
                { name: 'brand-input', component: FieldInput, wrappers: ['brand'] },
                { name: 'brand-select', component: FieldSelect, wrappers: ['brand'] },
                { name: 'supplier-input', component: FieldInput, wrappers: ['supplier'] },
                { name: 'supplier-select', component: FieldSelect, wrappers: ['supplier'] },
                { name: 'major-input', component: FieldInput, wrappers: ['major'] },
                { name: 'major-select', component: FieldSelect, wrappers: ['major'] },
                { name: 'customerGroup-input', component: FieldInput, wrappers: ['customerGroup'] },
                { name: 'customerGroup-select', component: FieldSelect, wrappers: ['customerGroup'] },
                { name: 'customerType-input', component: FieldInput, wrappers: ['customerType'] },
                { name: 'customerType-select', component: FieldSelect, wrappers: ['customerType'] },
                { name: 'area-input', component: FieldInput, wrappers: ['area'] },
                { name: 'area-select', component: FieldSelect, wrappers: ['area'] },
                { name: 'channel-input', component: FieldInput, wrappers: ['channel'] },
                { name: 'channel-select', component: FieldSelect, wrappers: ['channel'] },
                { name: 'album-input', component: FieldInput, wrappers: ['album'] },
                { name: 'album-select', component: FieldSelect, wrappers: ['album'] },
            ],
            validationMessages: [{ name: 'required', message: 'Trường này là bắt buộc' }],
        }),
        FormlySelectModule,
        FormlyMaterialModule,
    ],
    exports: [UserTreeViewComponent]
})
export class UserManageModule {}
