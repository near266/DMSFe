import { Component, DoCheck, OnInit, OnDestroy, Inject, AfterViewInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { PurchaseOrder } from 'src/app/core/model/PurchaseOrder';
// import * as moment from 'moment';
import { DatePipe } from '@angular/common';
import { DataService } from './services/data.service';
import { PurchaseOrderService } from 'src/app/core/services/purchaseOrder.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import moment from 'moment';

@Component({
    selector: 'app-orders-mgm',
    templateUrl: './orders-mgm.component.html',
    styleUrls: ['./orders-mgm.component.scss'],
})
export class OrdersMgmComponent implements OnInit, DoCheck, OnDestroy, AfterViewInit {
    isShowSidebarToMargin = true;
    sideBarWidth!: string;
    type!: string;
    listOrder: any = [];
    totalCount: number;
    id:any = []
    page: number = 1;
    pageSize: number = 30;
    total: number = 0;
    body: any = {
        sortField: 'CreatedDate',
        isAscending: false,
        page: 1,
        pageSize: 30,
    };
    dateSearchForm: FormGroup;
    constructor(
        private activatedroute: ActivatedRoute,
        public datepipe: DatePipe,
        public router: Router,
        private purchaseOrderService: PurchaseOrderService,
        private dataService: DataService,
        private fb: FormBuilder,
        private purchaseSer: PurchaseOrderService,
    ) {}

    ngOnInit(): void {
        this.purchaseOrderService.page.subscribe((data) => {
            this.page = data;
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
        this.search(this.body);
    }

    search(body: any) {
        this.purchaseOrderService.search(body).subscribe((data) => {
            this.listOrder = data.data;
            this.total = data.totalCount;
            this.purchaseOrderService.setTotal(this.total);
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

    navigateToDetail(order: any) {
        localStorage.setItem('purchaseOrderId', order.id);
        this.router.navigate(['/orders/detailOrder/viewEdit']);
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

    chooseID(event: any, id: any) {
      console.log(event.checked);
      if (event.checked == true) {
          this.id.push(id);
      } else {
          this.id.splice(this.id.indexOf(id), 1);
      }
      console.log(this.id);
    }

    print() {
      let body;
      body = {
          filter: null,
          listId: this.id,
          type: 2,
      };
      console.log('Print');
      this.purchaseSer.print(body).subscribe({
          next: (data) => {
              var blob = new Blob([data], {
                  type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
              });
              const blobUrl = window.URL.createObjectURL(blob);
              window.open(blobUrl)
          },
      });
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
