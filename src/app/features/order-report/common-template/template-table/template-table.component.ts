import { Component, EventEmitter, Input, OnInit, Output, DoCheck } from '@angular/core';
import { Observable } from 'rxjs';
import { repeat } from 'rxjs-compat/operator/repeat';
import { Config } from '../../models/config';
import { stickyRows } from '../../models/stickyRow';
import { LogicService } from '../../services/logic.service';

@Component({
    selector: 'app-template-table',
    templateUrl: './template-table.component.html',
    styleUrls: ['./template-table.component.scss'],
})
export class TemplateTableComponent implements OnInit, DoCheck {
    @Input() headers: string[] = [];
    @Input() listData: Config;
    @Input() total: number = 0;
    @Output() pageChange$ = new EventEmitter<number>();
    @Output() emitId$ = new EventEmitter<string>();

    isLoading$: Observable<boolean> = this.logicService.isLoading$;
    stickyRowsAfterProcessing: any[] = [];

    pageSize: number = 30;
    page: number = 1;
    constructor(private logicService: LogicService) {}
    ngOnInit(): void {
        this.stickyRowsAfterProcessing = new Array(this.headers.length).fill('');
    }

    ngDoCheck(): void {
        if (this.listData) {
            this.getStickyRows();
        }
    }

    getStickyRows() {
        this.listData.stickyRows.forEach((stickyRow: stickyRows) => {
            let index = this.headers.indexOf(stickyRow.header!);
            if (index) {
                this.stickyRowsAfterProcessing[index] = stickyRow.content!;
            }
        });
    }

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
