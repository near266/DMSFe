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
    headers = tableHeader;
    constructor(private returnsService: ReturnsService) {}
    ngOnInit(): void {
        this.returnsService.getAllReturns().subscribe((data) => {
            this.returns = data;
        });
    }
    // openUpdateReturn(return: Return): void {
    //     this.returnDialogService.openReturnDialog(return);
    // }
}
