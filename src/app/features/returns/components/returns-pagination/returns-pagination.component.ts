import { Component, OnInit } from '@angular/core';
import { ReturnsService } from '../../services/returns.service';

@Component({
    selector: 'app-returns-pagination',
    templateUrl: './returns-pagination.component.html',
    styleUrls: ['./returns-pagination.component.scss'],
})
export class ReturnsPaginationComponent implements OnInit {
    startIndex: number;
    endIndex: number;
    totalReturns: number;
    constructor(private returnsService: ReturnsService) {}

    ngOnInit(): void {
        this.returnsService.totalReturns$.subscribe((res) => {
            this.totalReturns = res;
        });
        this.returnsService.startAndEndIndex$.subscribe((data: { start: number; end: number }) => {
            this.startIndex = data.start;
            this.endIndex = data.end;
        });
    }
    handlePageChange(page: number): void {
        this.returnsService.setCurrentPage(page);
    }
}
