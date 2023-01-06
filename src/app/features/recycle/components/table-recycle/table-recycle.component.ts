import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ConfirmDialogService } from 'src/app/core/shared/services/confirm-dialog.service';

@Component({
  selector: 'app-table-recycle',
  templateUrl: './table-recycle.component.html',
  styleUrls: ['./table-recycle.component.scss']
})
export class TableRecycleComponent implements OnInit {

  constructor(public datePipe: DatePipe, private confirm: ConfirmDialogService) { }

  ngOnInit(): void {
  }

  restore() {

  }

  delete() {
    this.confirm.openDialog({message: 'Bạn có chắc chắn muốn xóa bản ghi này?',confirm: 'Xác nhận',cancel: 'Hủy'}).subscribe(data => {
        
    })
  }
}
