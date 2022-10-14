import { Component, OnInit } from '@angular/core';
import { Return } from '../../models/return';
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
    headers = tableHeader;
    constructor(private returnsService: ReturnsService) {}
    ngOnInit(): void {
        this.returnsService.returns$.subscribe((data: Return[]) => {
            this.returns = data;
        });
        this.returnsService.currentPage$.subscribe((data: number) => {
            this.currentPage = data;
        });
    }
    // openUpdateReturn(return: Return): void {
    //     this.returnDialogService.openReturnDialog(return);
    // }
}
