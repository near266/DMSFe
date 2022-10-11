import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/core/shared/shared.module';
import { MainComponent } from './main.component';
import { ComponentModule } from '../../component/component.module';
import { MainRoutingModule } from './main.routing.module';



@NgModule({
    declarations: [MainComponent],
    imports: [MainRoutingModule, CommonModule, SharedModule, RouterModule, ComponentModule],
})
export class MainModule { }
