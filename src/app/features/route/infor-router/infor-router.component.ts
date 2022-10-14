import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { DataService } from 'src/app/core/services/data.service';

@Component({
  selector: 'app-infor-router',
  templateUrl: './infor-router.component.html',
  styleUrls: ['./infor-router.component.scss']
})
export class InforRouterComponent implements OnInit {

  constructor(    
    private dataService: DataService,
    public datePipe: DatePipe
  ) { }
  @Input() status: any

  ngOnInit(): void {
  }

}
