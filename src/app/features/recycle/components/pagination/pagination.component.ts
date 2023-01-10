import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {

    @Output() pageCurrent$ = new EventEmitter<number>();

    page: number = 1;
    constructor() {}

    ngOnInit(): void {}
    onTableDataChange(event: any) {
        this.page = event;
        this.pageCurrent$.emit(this.page);
    }

}
