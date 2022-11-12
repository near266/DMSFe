import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Return, Status } from '../../models/return';
import { tableHeader } from '../../models/table.header';
import { ReturnsService } from '../../services/returns.service';

@Component({
    selector: 'app-returns-table',
    templateUrl: './returns-table.component.html',
    styleUrls: ['./returns-table.component.scss'],
})
export class ReturnsTableComponent implements OnInit {
    currentPage: number;
    returns: Return[] = [];
    Status = Status;
    totalItems: number;
    headers = tableHeader;
    _tableLoading$: Observable<boolean>;
    constructor(private returnsService: ReturnsService) {}
    ngOnInit(): void {
        this._tableLoading$ = this.returnsService.tableLoading$;
        this.returnsService.getInititalReturns();
        this.returnsService.currentPage$.subscribe((page) => {
            this.currentPage = page;
        });
        this.returnsService.totalReturns$.subscribe((total) => {
            this.totalItems = total;
        });
        this.returnsService.returns$.subscribe((data) => {
            console.log(data);

            this.returns = data;
        });
    }
    // openUpdateReturn(return: Return): void {
    //     this.returnDialogService.openReturnDialog(return);
    // }
}
