import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { NgSelectModule } from '@ng-select/ng-select';
import { SideMenuDateComponent } from './components/side-menu-date/side-menu-date.component';
import { SideMenuSearchComponent } from './components/side-menu-search/side-menu-search.component';
import { SideMenuSelectComponent } from './components/side-menu-select/side-menu-select.component';
import { SideMenuUserComponent } from './components/side-menu-user/side-menu-user.component';
import { SideMenuComponent } from './side-menu.component';
import { SideMenuItemComponent } from './components/side-menu-item/side-menu-item.component';

@NgModule({
    declarations: [
        SideMenuComponent,
        SideMenuDateComponent,
        SideMenuSearchComponent,
        SideMenuSelectComponent,
        SideMenuUserComponent,
        SideMenuItemComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        MatButtonModule,
        MatDatepickerModule,
        MatIconModule,
        MatMenuModule,
        NgSelectModule,
    ],
    exports: [SideMenuComponent],
})
export class SideMenuModule {}
