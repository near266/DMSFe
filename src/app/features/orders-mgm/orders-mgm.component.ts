import { Component, DoCheck, OnInit } from '@angular/core';

@Component({
    selector: 'app-orders-mgm',
    templateUrl: './orders-mgm.component.html',
    styleUrls: ['./orders-mgm.component.scss'],
})
export class OrdersMgmComponent implements OnInit, DoCheck {
    isShowSidebarToMargin = true;
    sideBarWidth!: string;
    constructor() {}

    ngOnInit(): void {}

    ngDoCheck(): void {}
    isShowSidebar(e: any) {
        this.isShowSidebarToMargin = e;
        let table = document.getElementById('table');
        if (this.isShowSidebarToMargin) {
            table?.classList.remove('width-vw-60');
            table?.classList.add('width-vw-260');
        } else {
            table?.classList.add('width-vw-60');
            table?.classList.remove('width-vw-260');
        }
        console.log(this.isShowSidebarToMargin);
    }
}
