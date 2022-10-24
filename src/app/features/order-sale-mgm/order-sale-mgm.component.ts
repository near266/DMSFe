import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PurchaseOrder } from 'src/app/core/model/PurchaseOrder';
import { SaleReceipt } from 'src/app/core/model/SaleReceipt';
import { SaleReceiptService } from 'src/app/core/services/saleReceipt.service';
import { DataService } from './services/data.service';

@Component({
    selector: 'app-order-sale-mgm',
    templateUrl: './order-sale-mgm.component.html',
    styleUrls: ['./order-sale-mgm.component.scss'],
})
export class OrderSaleMgmComponent implements OnInit {
    isShowSidebarToMargin = true;
    sideBarWidth!: string;
    type!: string;
    listReceiptOrder: any = [];
    totalCount: number;
    page: number = 1;
    pageSize: number = 30;
    total: number = 0;
    id: any = [];
    roleMain = 'member';

    searchAllBody = {
        sortField: 'CreatedDate',
        isAscending: false,
        page: this.page,
        pageSize: this.pageSize,
    };

    constructor(
        private activatedroute: ActivatedRoute,
        public datepipe: DatePipe,
        private saleReceiptService: SaleReceiptService,
        private router: Router,
        private dataService: DataService,
    ) {}

    ngOnInit(): void {
        this.roleMain = localStorage.getItem('roleMain')!;
        this.saleReceiptService.page.subscribe((data) => {
            this.page = data;
            this.search(this.searchAllBody);
        });
        this.dataService.searchText.subscribe((data) => {
            const body = {
                keyword: data,
                sortField: 'CreatedDate',
                isAscending: false,
                page: this.page,
                pageSize: this.pageSize,
            };
            this.search(body);
        });
    }

    ngAfterViewInit(): void {
        // this.saleReceiptService.search().subscribe((data) => {
        //     this.listReceiptOreder = data.data;
        // });
        this.search(this.searchAllBody);
    }

    search(body: any) {
        this.saleReceiptService.searchReceipt(body).subscribe((data) => {
            console.log(data);

            this.listReceiptOrder = data.data;
            this.total = data.totalCount;
            this.saleReceiptService.setTotal(this.total);
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

    ngOnDestroy(): void {}

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

    detail(id: string) {
        localStorage.setItem('receiptOrderId', id);
        this.router.navigate(['/ordersale/detail/viewEdit']);
    }

    chooseID(event: any, id: any) {
        console.log(event.checked);
        if (event.checked == true) {
            this.id.push(id);
        } else {
            this.id.splice(this.id.indexOf(id), 1);
        }
        console.log(this.id);
    }

    export() {
        let body = {
            filter: null,
            // null || {
            //   keyword: '',
            //     deliveryDate: '',
            //     orderEmployeeId: '',
            //     customerTypeId: '',
            //     customerGroupId: '',
            //     areaId: '',
            //     productKey: '',
            //     status: '',
            //     printStatus: null,
            //     paymentMethod: '',
            //     page: '',
            //     pageSize: '',
            //     sortField: '',
            //     isAscending: null,
            //     fromDate: '',
            //     toDate: '',
            //     dateFilter: '',
            // },
            listId: this.id,
            type: 2,
        };
        console.log(body);

        this.saleReceiptService.export(body).subscribe({
            next: (data) => {
                console.log(data);
            },
        });
        console.log('export');
        console.log(body);
    }
}
