import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { SharedModule } from '../shared/shared.module';
import { MenuCollapseComponent } from './common/menu-collapse/menu-collapse.component';

@NgModule({
    declarations: [HeaderComponent, SidebarComponent],
    imports: [CommonModule, SharedModule],
    exports: [HeaderComponent, SidebarComponent],
})
export class ComponentModule {}
