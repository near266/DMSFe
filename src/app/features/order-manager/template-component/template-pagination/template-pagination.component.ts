import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { last } from 'rxjs-compat/operator/last';

@Component({
    selector: 'order-template-pagination',
    templateUrl: './template-pagination.component.html',
    styleUrls: ['./template-pagination.component.scss'],
})
export class TemplatePaginationComponent implements OnInit {
    @Output() pageCurrent$ = new EventEmitter<number>();

    page: number = 1;
    constructor() {}

    ngOnInit(): void {}
    onTableDataChange(event: any) {
        this.page = event;
        this.pageCurrent$.emit(this.page);
    }
}
