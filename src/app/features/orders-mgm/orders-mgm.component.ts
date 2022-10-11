import { Component, DoCheck, OnInit, OnDestroy, Inject } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { PurchaseOrderList } from 'src/app/core/data/PurchaseOrderList';
import { PurchaseOrder } from 'src/app/core/model/PurchaseOrder';
// import * as moment from 'moment';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-orders-mgm',
    templateUrl: './orders-mgm.component.html',
    styleUrls: ['./orders-mgm.component.scss'],
})
export class OrdersMgmComponent implements OnInit, DoCheck, OnDestroy {
    isShowSidebarToMargin = true;
    sideBarWidth!: string;
    type!: string;
    listOrder: PurchaseOrder[] = PurchaseOrderList;
    constructor(private activatedroute: ActivatedRoute, public datepipe: DatePipe, public router: Router) { }

    ngOnInit(): void { }

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

    // navigateToDetail(order: any) {
    //     let orderJson: NavigationExtras = {
    //         queryParams: {
    //             "order": JSON.stringify(order)
    //         }
    //     }
    //     this.router.navigate(['/orders/detailOrder/viewEdit'], orderJson)
    // }
}
