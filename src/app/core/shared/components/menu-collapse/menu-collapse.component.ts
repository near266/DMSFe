import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { Config } from 'src/app/core/model/Config';

@Component({
    selector: 'app-menu-collapse',
    templateUrl: './menu-collapse.component.html',
    styleUrls: ['./menu-collapse.component.scss'],
})
export class MenuCollapseComponent implements OnInit, AfterViewInit {
    @Input() Config = new Config();
    @Output() Selection = new EventEmitter<string>();
    isShowmenu = false;
    isSelect = false;
    selectedChildren!: string;
    constructor() {}

    ngOnInit(): void {}

    ngAfterViewInit(): void {
        let iconNode = document.getElementById(`icon-${this.Config.title}`);
        if (this.Config.icon) {
            iconNode!.innerHTML = this.Config.icon;
        }
    }
    select(menuChildren: string) {
        this.isSelect = true;
        this.isShowmenu = false;
        this.selectedChildren = menuChildren;
        this.Selection.emit(menuChildren);
    }

    cancelSelect() {
        this.isSelect = false;
        this.Selection.emit('');
    }

    stopPropagation(e: any) {
        e.stopPropagation();
    }
}
