import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PurchaseOrder } from 'src/app/core/model/PurchaseOrder';
import { SaleReceipt } from 'src/app/core/model/SaleReceipt';
import { SaleReceiptService } from 'src/app/core/services/saleReceipt.service';
import { DataService } from './services/data.service';
import printJS from 'print-js';
import { DomSanitizer } from '@angular/platform-browser';
import { FormBuilder, FormGroup } from '@angular/forms';
import moment from 'moment';
import { jsPDF } from 'jspdf';

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
    formFilterReceive: any;
    printThis: any;
    dateSearchForm: FormGroup;

    body: any = {
        sortField: 'CreatedDate',
        isAscending: false,
        page: 1,
        pageSize: 30,
    };

    constructor(
        public datepipe: DatePipe,
        private saleReceiptService: SaleReceiptService,
        private router: Router,
        private dataService: DataService,
        private fb: FormBuilder,
    ) {}

    ngOnInit(): void {
        this.roleMain = localStorage.getItem('roleMain')!;
        this.saleReceiptService.page.subscribe((data) => {
            this.page = data;
            this.body.page = this.page;
            this.search(this.body);
        });
        this.dataService.searchText.subscribe((data) => {
            // lấy text
            this.body.keyword = data;
            // set lại page
            this.page = 1;
            this.body.page = 1;
            this.search(this.body);
        });
        // create dateSearchForm
        this.dateSearchForm = this.fb.group({
            fromDate: [null],
            toDate: [null],
        });
    }

    ngAfterViewInit(): void {
        // this.saleReceiptService.search().subscribe((data) => {
        //     this.listReceiptOreder = data.data;
        // });
        this.search(this.body);
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

    receiveFilter(event: any) {
        console.log(event);
        this.formFilterReceive = event;
    }

    export() {
        let body;
        body = {
            filter: null,
            listId: this.id,
            type: 2,
        };

        console.log(body);
        this.saleReceiptService.export(body).subscribe({
            next: (data) => {
                const blob = new Blob([data], {
                    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                });
                const url = window.URL.createObjectURL(blob);
                window.open(url);
            },
        });
    }
    exportWithFilter() {
        let body = {
            filter: this.formFilterReceive,
            listId: null,
            type: 1,
        };
        console.log('ExportWithFilter', body);
        this.saleReceiptService.export(body).subscribe({
            next: (data) => {
                const blob = new Blob([data], {
                    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                });
                const url = window.URL.createObjectURL(blob);
                window.open(url);
            },
        });
    }
    print() {
        let body;
        body = {
            filter: null,
            listId: this.id,
            type: 2,
        };
        console.log('Print');
        this.saleReceiptService.export(body).subscribe({
            next: (data) => {
                var blob = new Blob([data], {
                    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                });
                const blobUrl = URL.createObjectURL(blob);
                const iframe = document.createElement('iframe');
                iframe.style.display = 'none';
                iframe.src = blobUrl;
                document.body.appendChild(iframe);
                iframe.contentWindow?.print();
            },
        });
    }
    filter(body: any) {
        this.search(body);
    }

    filterDate() {
        if (this.dateSearchForm.get('fromDate')?.value) {
            this.body.fromDate = moment(this.dateSearchForm.get('fromDate')?.value).format('YYYY-MM-DD');
        }
        if (this.dateSearchForm.get('toDate')?.value) {
            this.body.toDate = moment(this.dateSearchForm.get('toDate')?.value).format('YYYY-MM-DD');
        }
        // set lại page
        this.page = 1;
        this.body.page = 1;
        this.search(this.body);
    }

    clearDatePicker() {
        this.dateSearchForm.setValue({
            fromDate: null,
            toDate: null,
        });
        this.body.fromDate = null;
        this.body.toDate = null;
    }
}
