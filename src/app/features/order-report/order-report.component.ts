import { Component, OnInit } from '@angular/core';
import { ReportService } from 'src/app/core/services/report.service';

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

  ngOnInit(): void {
    this.init(this.page);
  }

  init(page:any){
    let body = {
      page: page,
      pageSize: 30
    }
    this._reportSer.OrderReport(body).subscribe({
      next: data => {
        console.log(data);

      }
    })
  }

}
