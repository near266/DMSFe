import { List } from './../../timekeeping/models/List';

import { Body } from './../../user-manage/user-tree/add-manager/add-manager.component';
import { VisitReportService } from 'src/app/core/services/visitReport.service';
import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { CRow } from 'src/app/core/shared/components/template-table-normal/template-table-normal.component';
import { DatePipe } from '@angular/common';
import { ListHistoryVisit, HistoryVisit } from '../history/models/customerHistory';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-history-visited',
  templateUrl: './history-visited.component.html',
  styleUrls: ['./history-visited.component.scss']
})
export class HistoryVisitedComponent implements OnInit, AfterViewInit {
  subscription: Subscription = new Subscription();
  @Input() id: string = '';

  headers = [

    'Mã NV',
    'Tên NV',
    'Ngày',
    'Thứ',
    'Checkin',
    'Checkout',
    'Số giờ',
    'Địa điểm checkin',
    'Hình ảnh',
    'Đúng tuyến',
    'Đơn hàng',
    'Ghi chú',

  ];
  Rows: CRow[] = [];

  constructor(private visitReportService: VisitReportService, private datePipe: DatePipe) {


  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.GetHistory();
  }
  GetHistory() {
    this.subscription.add(
      this.visitReportService.HistoryVisted({ id: this.id }).subscribe((res: HistoryVisit[]) => {

        this.formatData(res);
        console.log(this.formatData(res));
      }),
    );


  }
  formatData(data: HistoryVisit[]) {
    let fomat: CRow[] = [];
    data.forEach((detail: HistoryVisit) => {
      let row = new CRow();
      row = {
        listCol: [

          {
            text: detail.id,
            addClass: 'text-red-500',
          },
          {
            text: detail.employeeName,

          },
          {
            text: ` ${this.datePipe.transform(detail.dateCheckin)}`,

          },
          {
            text: ` Thứ ${detail.dayCheckIn + 1}`,

          },
          {
            text: detail.checkInTime,

          },
          {
            text: detail.checkOutTime,

          },
          {
            text: detail.timeCheckin,

          },
          {
            text: detail.addressCheckin,

          },
          {
            text: detail.imageCheckin == null ? 'không có ảnh ' : detail.imageCheckin,

          },
          {
            text: detail.isRoute == true ? 'Đúng tuyến' : 'Sai tuyến',

          },
          {
            text: detail.order == null ? 'không có sản phẩm nào' : detail.order,

          },
          {
            text: detail.note,

          },
        ],

      };
      fomat.push(row);
    });

    this.Rows = fomat;
  }



}
