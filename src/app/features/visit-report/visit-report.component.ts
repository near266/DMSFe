import { Component, OnInit } from '@angular/core';
import { Headers } from './model/header';
import { tableData } from './model/tableData';

@Component({
  selector: 'app-visit-report',
  templateUrl: './visit-report.component.html',
  styleUrls: ['./visit-report.component.scss']
})
export class VisitReportComponent implements OnInit {
  tableData: tableData = {
    headers: Headers,
    data: []
  }
  constructor() { }

  ngOnInit(): void {
  }

}
