import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { combineLatest, Observable, tap } from 'rxjs';
import { Pagination } from '../../models/settings';
import { ReturnsService } from '../../services/returns.service';

@Component({
    selector: 'app-returns-pagination',
    templateUrl: './returns-pagination.component.html',
    styleUrls: ['./returns-pagination.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReturnsPaginationComponent {
    @Input() pagination$: Observable<Pagination>;
    vm$: Observable<{ totalReturns: number; start: number; end: number }>;
    @Input() totalReturns$: Observable<number>;
    @Output() pageChange: EventEmitter<number> = new EventEmitter();

    ngOnInit(): void {
        this.vm$ = combineLatest([this.pagination$, this.totalReturns$], (pagination, totalReturns) => {
            const { page, pageSize } = pagination;
            //calculate start and end using page,pagesize and totalreturns
            let start = (page - 1) * pageSize + 1;
            let end = page * pageSize;
            if (end > totalReturns) {
                end = totalReturns;
            }
            if (!totalReturns) {
                start = 0;
            }
            return { totalReturns, start, end };
        });
    }
    handlePageChange(page: number): void {
        this.pageChange.emit(page);
    }
}
