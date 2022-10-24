import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PurchaseOrder } from 'src/app/core/model/PurchaseOrder';
import { SaleReceipt } from 'src/app/core/model/SaleReceipt';
import { SaleReceiptService } from 'src/app/core/services/saleReceipt.service';

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
    id:any = [];

  formFilter: any;

    constructor(
        private activatedroute: ActivatedRoute,
        public datepipe: DatePipe,
        private saleReceiptService: SaleReceiptService,
        private router: Router,
    ) {}

    ngOnInit(): void {
        this.saleReceiptService.page.subscribe((data) => {
            this.page = data;
            this.search();
        });
    }

    ngAfterViewInit(): void {
        // this.saleReceiptService.search().subscribe((data) => {
        //     this.listReceiptOreder = data.data;
        // });
        this.search();
    }

    search() {
        let body = {
            sortField: 'CreatedDate',
            isAscending: false,
            page: this.page,
            pageSize: this.pageSize,
        };
        this.saleReceiptService.searchReceipt(body).subscribe((data) => {
          // console.log(data);

            this.listReceiptOrder = data?.data;
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

    chooseID(event:any,id:any){
      // console.log(event.checked);
      if(event.checked == true){
        this.id.push(id);
      }else{
        this.id.splice(this.id.indexOf(id),1)
      }
      // console.log(this.id);
    }

    formFilterChild(event:any){
      // console.log(event);
      this.formFilter = event
    }

    export(){
      let body;
      if(this.id.length == 0){
        body = {
          filter:this.formFilter,
          listId: null,
          type: 1,
        }
      }else{
        body = {
          // filter: {
          //   page: 1,
          //   pageSize: Number.MAX_VALUE,
          // },
          filter: null,
          listId: this.id,
          type: 2,
        }
      }
      // console.log(this.id);

      // console.log(body);
      this.saleReceiptService.export(body).subscribe({
        next: data => {
          // console.log(data);

          const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          const url= window.URL.createObjectURL(blob);
          window.open(url);
        }
      })
      // console.log("export");
    }
}
