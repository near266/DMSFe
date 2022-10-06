import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
    isShowSidebar = true;
    statusMenu = false;
    constructor() {}

    ngOnInit(): void {}

    toggleShowSidebar() {
        this.isShowSidebar = !this.isShowSidebar;
    }
}
