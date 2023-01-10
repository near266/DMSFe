import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
    selector: 'Template-pagination',
    templateUrl: './pagination.component.html',
    styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent implements OnInit {
    @Output() pageCurrent$ = new EventEmitter<number>();

    constructor() {}

    ngOnInit(): void {}

    onTableDataChange(event: any) {
        this.pageCurrent$.emit(event);
    }
}
