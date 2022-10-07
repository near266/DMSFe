import { Component, DoCheck, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-orders-mgm',
    templateUrl: './orders-mgm.component.html',
    styleUrls: ['./orders-mgm.component.scss'],
})
export class OrdersMgmComponent implements OnInit, DoCheck, OnDestroy {
    isShowSidebarToMargin = true;
    sideBarWidth!: string;
    type!: string;
    constructor(private activatedroute: ActivatedRoute) {}

    ngOnInit(): void {
        this.activatedroute.data.subscribe((data) => {
            this.type = data['type'];
        });
    }

    ngDoCheck(): void {
        let table = document.getElementById('table');
        table?.classList.add('width-vw-260');
        if (this.isShowSidebarToMargin) {
            table?.classList.remove('width-vw-60');
            table?.classList.add('width-vw-260');
        } else {
            table?.classList.add('width-vw-60');
            table?.classList.remove('width-vw-260');
        }
    }

    ngOnDestroy(): void {
        // console.log('Đã hủy')
    }

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
    }
}
