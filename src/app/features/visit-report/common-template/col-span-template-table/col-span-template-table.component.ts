import { Component, Input, OnInit } from '@angular/core';
import { tableData } from '../../model/tableData';

@Component({
  selector: 'app-col-span-template-table',
  templateUrl: './col-span-template-table.component.html',
  styleUrls: ['./col-span-template-table.component.scss']
})
export class ColSpanTemplateTableComponent implements OnInit {
  @Input() tableData: tableData = new tableData();
  constructor() { }

  ngOnInit(): void {
  }

}
