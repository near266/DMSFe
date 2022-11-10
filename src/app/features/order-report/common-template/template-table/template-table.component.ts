import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { Config } from '../../models/config';
import { LogicService } from '../../services/logic.service';

@Component({
    selector: 'app-template-table',
    templateUrl: './template-table.component.html',
    styleUrls: ['./template-table.component.scss'],
})
export class TemplateTableComponent implements OnInit {
    @Input() headers: string[] = [];
    @Input() listData: Config;
    @Input() total: number = 0;
    @Output() pageChange$ = new EventEmitter<number>();
    @Output() emitId$ = new EventEmitter<string>();

    isLoading$: Observable<boolean> = this.logicService.isLoading$;

    pageSize: number = 30;
    page: number = 1;
    constructor(private logicService: LogicService) {}
    ngOnInit(): void {}
    handlePageChange(e: any) {
        this.page = e;
        this.pageChange$.emit(this.page);
    }

    emitTouch(index: any, indexOrder: number) {
        if (index === this.listData.emitTdOrder) {
            this.listData.listIds.forEach((id, i) => {
                if (i === indexOrder) {
                    this.emitId$.emit(id);
                }
            });
        }
    }
}
