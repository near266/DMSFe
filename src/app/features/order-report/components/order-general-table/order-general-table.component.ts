import { Component, OnInit } from '@angular/core';
import { tableHeader } from '../../models/headerTableOrderGeneral';

@Component({
  selector: 'app-order-general-table',
  templateUrl: './order-general-table.component.html',
  styleUrls: ['./order-general-table.component.scss']
})
export class OrderGeneralTableComponent implements OnInit {

  constructor() { }
  headers = tableHeader;
  countHeader = [];
  totalCountNonSpan = []
  ngOnInit(): void {
    this.countHeader.length = 33;
    this.totalCountNonSpan.length = 13;
  }

}
