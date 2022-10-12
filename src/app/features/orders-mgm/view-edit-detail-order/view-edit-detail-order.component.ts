import { AfterViewInit, Component, OnInit, HostListener, DoCheck } from '@angular/core';
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
export class ViewEditDetailOrderComponent implements OnInit, AfterViewInit, DoCheck {
    type!: string;
    statusNow!: number;
    constructor(public activatedRoute: ActivatedRoute, private route: ActivatedRoute, public router: Router, private dataService: DataService) { }

    ngOnInit(): void {
        this.type = 'View';
        this.changeType('View');
        // this.dataService.status.subscribe(
        //     data => this.statusNow = data
        // )
        this.statusNow = parseInt(localStorage.getItem('status')!)
    }

    ngDoCheck(): void {

    }

    ngAfterViewInit(): void {
    }

    changeType(type: any) {
        this.type = type;
        this.dataService.changeType(this.type)
    }

    navigate(router: any) {
        let status: NavigationExtras = {
            queryParams: {
                "status": this.statusNow
            }
        }
        this.router.navigate(router, status)
    }
}
