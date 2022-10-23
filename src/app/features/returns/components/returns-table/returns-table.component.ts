import { Component, OnInit } from '@angular/core';
import { Return } from '../../models/return';
import { tableHeader } from '../../models/table.header';
import { ReturnsService } from '../../services/returns.service';
import { Status } from '../../models/return';

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
    constructor(private returnsService: ReturnsService) {}
    ngOnInit(): void {
        this.returnsService.getInititalReturns();
        this.returnsService.currentPage$.subscribe((page) => {
            this.currentPage = page;
        });
        this.returnsService.totalReturns$.subscribe((total) => {
            this.totalItems = total;
        });
        this.returnsService.returns$.subscribe((data) => {
            this.returns = data;
        });
    }
    // openUpdateReturn(return: Return): void {
    //     this.returnDialogService.openReturnDialog(return);
    // }
}
