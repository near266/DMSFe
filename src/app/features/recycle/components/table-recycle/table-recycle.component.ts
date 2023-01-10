import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ConfirmDialogService } from 'src/app/core/shared/services/confirm-dialog.service';
import { IDataTable } from '../../models/IDataTable';
import { IListReturn } from '../../models/IListReturn';

@Component({
    selector: 'app-table-recycle',
    templateUrl: './table-recycle.component.html',
    styleUrls: ['./table-recycle.component.scss'],
})
export class TableRecycleComponent implements OnInit, OnChanges {
    @Input() data: IDataTable[] = [];
    @Input() totalCount: number = 0;
    @Input() signal: string = '';
    @Output() indexPage = new EventEmitter<number>();
    @Output() statusEvent = new EventEmitter<string>();
    @Output() pushListEvent = new EventEmitter<IListReturn>();

    page: number = 1;
    listId: string[] = [];
    listIndex: boolean[] = new Array(10);

    constructor(public datePipe: DatePipe, private confirm: ConfirmDialogService) {}
    ngOnChanges(changes: SimpleChanges): void {
        if (changes['signal'] && changes['signal'].currentValue && changes['signal'].currentValue != '') {
            switch (changes['signal'].currentValue) {
                case 'restore':
                    // this.statusEvent.emit('restore');
                    this.restore();
                    break;
                case 'delete':
                    // this.statusEvent.emit('delete');
                    this.delete();
                    break;
            }
        } else {
            if (this.listId.length > 0 && this.data.length > 0) {
                for (let i = 0; i < this.data.length; i++) {
                    if (this.listId.indexOf(this.data[i].id) > -1) {
                        this.listIndex[i] = true;
                    } else {
                        this.listIndex[i] = false;
                    }
                }
            }
        }
    }

    ngOnInit(): void {}

    trackByFn(index: number, item: any) {
        if (!item) return null;
        return item.id;
    }

    select(id: string) {
        if (this.listId.indexOf(id) > -1) {
            this.listId.splice(this.listId.indexOf(id), 1);
        } else {
            this.listId.push(id);
        }
    }

    restore() {
        this.confirm
            .openDialog({
                message: 'Bạn có chắc chắn muốn khôi phục cho những bản ghi này?',
                confirm: 'Xác nhận',
                cancel: 'Hủy',
            })
            .subscribe((data) => {
                if (data) {
                    this.statusEvent.emit('restore');
                    this.pushListEvent.emit({
                        type: 'restore',
                        list: this.listId
                    });
                }
            });
    }

    restoreOne(id: string) {
        this.confirm
            .openDialog({
                message: 'Bạn có chắc chắn muốn khôi phục cho bản ghi này?',
                confirm: 'Xác nhận',
                cancel: 'Hủy',
            })
            .subscribe((data) => {
                if (data) {
                    this.statusEvent.emit('restore');
                    this.pushListEvent.emit({
                        type: 'restore',
                        list: [id]
                    });
                }
            });
    }

    delete() {
        this.confirm
            .openDialog({ message: 'Bạn có chắc chắn muốn xóa những bản ghi này?', confirm: 'Xác nhận', cancel: 'Hủy' })
            .subscribe((data) => {
                if (data) {
                    this.statusEvent.emit('delete');
                    this.pushListEvent.emit({
                        type: 'delete',
                        list: this.listId
                    });
                }
            });
    }

    deleteOne(id: string) {
        this.confirm
            .openDialog({ message: 'Bạn có chắc chắn muốn xóa bản ghi này?', confirm: 'Xác nhận', cancel: 'Hủy' })
            .subscribe((data) => {
                if (data) {
                    this.statusEvent.emit('delete');
                    this.pushListEvent.emit({
                        type: 'delete',
                        list: [id]
                    });
                }
            });
    }

    handlePageChange(event: any) {
        this.page = event;
        this.indexPage.emit(this.page);
    }
}
