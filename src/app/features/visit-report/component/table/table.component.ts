import { Component, OnInit } from '@angular/core';
import { Headers } from '../../model/header';

@Component({
  selector: 'visit-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  headers = Headers;
  constructor() { }

  ngOnInit(): void {
  }

}
