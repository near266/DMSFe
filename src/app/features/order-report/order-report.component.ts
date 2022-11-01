import { Component, OnInit } from '@angular/core';
import { Config } from 'src/app/core/model/Config';
import { ReportService } from 'src/app/core/services/report.service';
import { RootOrderReport } from './models/order-report';

@Component({
  selector: 'app-order-report',
  templateUrl: './order-report.component.html',
  styleUrls: ['./order-report.component.scss']
})
export class OrderReportComponent implements OnInit {

  constructor(
    private _reportSer: ReportService,
  ) { }

  page:any = 1;
  dataOrderReport: RootOrderReport = new RootOrderReport;

  ngOnInit(): void {
    this.init(this.page);
  }

  init(page:any){
    let body = {
      page: page,
      pageSize: 10
    }
    this._reportSer.OrderReport(body).subscribe({
      next: (data:any) => {
        console.log(data);
        this.dataOrderReport = data;
      }
    })
  }


  // todo menu
  statusMenu: Config = {
    icon: '<i class="fa-solid fa-user"></i>',
    title: 'Loại khách hàng',
    menuChildrens: ['Tất cả', 'Tiềm năng', 'Thân thiết', 'Vãng lai'],
};

  selectType(event:any){
    console.log(event);

  }

}
