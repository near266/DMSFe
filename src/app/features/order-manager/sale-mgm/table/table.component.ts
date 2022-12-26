import { AsyncPipe } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SaleHeader } from '../../models/headers';
import { SaleDetail } from '../../models/saleDetail';
import { SaleLogicService } from '../../services/saleLogic.service';

@Component({
    selector: 'app-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit, AfterViewInit {
    roleMain: string = 'member';
    saleHeader: string[] = SaleHeader;
    defaultBody: any = {
        sortField: 'CreatedDate',
        isAscending: false,
        page: 1,
        pageSize: 30,
        archived: false, // mặc định lấy những đơn k lưu trữ
    };
    // body có thể ghi đè để search filter
    body: any = {
        sortField: 'CreatedDate',
        isAscending: false,
        page: 1,
        pageSize: 30,
        archived: false,
    };
    page: number = 1;
    listIdSelected: string[] = [];
    createdDateDown = false;
    createdDateUp = false;

    total$: Observable<number> = this.saleLogicService.total$;
    isLoading$: Observable<boolean> = this.saleLogicService.isLoading$;
    listData$: Observable<any> = this.saleLogicService.listData$;

    constructor(private saleLogicService: SaleLogicService, private asyncPipe: AsyncPipe) {}

    ngOnInit(): void {
        this.roleMain = localStorage.getItem('roleMain')!;
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.search(this.defaultBody, []);
        }, 0);
    }

    search(body: any, listIdSelected: string[]) {
        this.saleLogicService.searchAndFormatData(body, listIdSelected);
    }

    handleChangePage(e: any) {
        this.page = e;
        this.body.page = e;
        this.search(this.body, this.listIdSelected);
    }

    handleEmitListIdSelected(listIdSelected: string[]) {
        this.listIdSelected = listIdSelected;
    }

    handleEmitId(id: string) {
        this.saleLogicService.navigateToDetail(id);
    }

    handleFilterDate(e: any) {
        this.page = 1;
        this.body = this.saleLogicService.filterDate(this.body, this.listIdSelected, e);
    }

    filterDateWithTime(type: number) {
        this.body.dateFilter = type;
        this.search(this.body, this.listIdSelected);
    }

    handleEmitBody(body: any) {
        this.body = body;
        this.page = 1;
        this.search(this.body, this.listIdSelected);
    }

    refresh() {
        this.page = 1;
        this.body.page = 1;
        this.search(this.body, this.listIdSelected);
    }

    export() {
        this.saleLogicService.export(this.listIdSelected);
    }

    exportWithFilter() {
        this.saleLogicService.exportWithFilter(this.body, this.asyncPipe.transform(this.total$)!);
    }

    print() {
        this.saleLogicService.print(this.listIdSelected);
    }
    printWithFilter() {
        this.saleLogicService.printWithFilter(this.body, this.asyncPipe.transform(this.total$)!);
    }

    printExcel() {
        this.saleLogicService.printExcel(this.listIdSelected)
    }
    printExcelWithFilter() {
        this.saleLogicService.printExcelWithFilter(this.body, this.asyncPipe.transform(this.total$)!);
    }

    sortByCreatedDate(type: any) {
        if (type === 'up') {
            this.createdDateUp = true;
            this.createdDateDown = false;
            this.body.isAscending = true;
        } else if (type === 'down') {
            this.createdDateDown = true;
            this.createdDateUp = false;
            this.body.isAscending = false;
        }
        this.search(this.body, this.listIdSelected);
    }

    archiveOrders() {
        this.saleLogicService.archiveOrders(this.listIdSelected, null);
        this.saleLogicService.isSucessArchived$.subscribe((data: boolean) => {
            if (data) {
                this.listIdSelected = [];
                this.search(this.defaultBody, []);
            } else {
            }
        });
    }
}
