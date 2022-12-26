import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { tableData } from '../../model/tableData';

@Component({
  selector: 'app-col-span-template-table',
  templateUrl: './col-span-template-table.component.html',
  styleUrls: ['./col-span-template-table.component.scss']
})
export class ColSpanTemplateTableComponent implements OnInit, OnChanges {
  @Input() data: any = [];
  @Input() headers: any = [];
  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
      console.log(this.data);
  }

  getCols(row: any) {
    return {
      display: 'grid',
      'grid-template-columns': `repeat(${row.length}, 1fr)`,
      'justify-items': 'center',
    };
  }
}
