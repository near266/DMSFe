import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'visit-pagination',
    templateUrl: './pagination.component.html',
    styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent implements OnInit {
    @Output() pageCurent$ = new EventEmitter<number>();

    constructor() {}

    ngOnInit(): void {}

    onTableDataChange(e: any) {
        this.pageCurent$.emit(e);
    }
}
