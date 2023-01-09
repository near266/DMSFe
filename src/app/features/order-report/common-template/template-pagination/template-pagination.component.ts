import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { LogicService } from '../../services/logic.service';

@Component({
    selector: 'app-template-pagination',
    templateUrl: './template-pagination.component.html',
    styleUrls: ['./template-pagination.component.scss'],
})
export class TemplatePaginationComponent implements OnInit {
    @Output() pageCurent$ = new EventEmitter<number>();

    constructor() {}

    ngOnInit(): void {}

    onTableDataChange(event: any) {
        this.pageCurent$.emit(event);
    }
}
