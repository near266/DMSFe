import { AfterViewInit, Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { map } from 'rxjs';
import { DetailPurchaseOrder } from 'src/app/core/data/PurchaseOrderList';
import { PurchaseOrder, PurchaseOrderDetail } from 'src/app/core/model/PurchaseOrder';
import { DataService } from 'src/app/core/services/data.service';

@Component({
    selector: 'app-view-edit-detail-order',
    templateUrl: './view-edit-detail-order.component.html',
    styleUrls: ['./view-edit-detail-order.component.scss'],
})
export class ViewEditDetailOrderComponent implements OnInit, AfterViewInit {
    type!: string;
    detailOrder: PurchaseOrderDetail = DetailPurchaseOrder[0];
    constructor(public activatedRoute: ActivatedRoute, private route: ActivatedRoute, public router: Router, private dataService: DataService) { }

    ngOnInit(): void {
        this.type = 'View';
        this.changeType('View');
    }

    ngAfterViewInit(): void {
    }

    changeType(type: any) {
        this.type = type;
        this.dataService.changeType(this.type)
    }
    // navigate(router: any) {
    //     let type: NavigationExtras = {
    //         queryParams: {
    //             "type": this.type
    //         }
    //     }
    //     this.router.navigate(router, type)
    // }
}
