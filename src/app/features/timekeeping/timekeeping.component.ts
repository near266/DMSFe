import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Config } from 'src/app/core/model/Config';

@Component({
  selector: 'app-timekeeping',
  templateUrl: './timekeeping.component.html',
  styleUrls: ['./timekeeping.component.scss']
})
export class TimekeepingComponent implements OnInit, AfterViewInit {

  constructor(
    private datePipe: DatePipe,
    private title: Title,
  ) { }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {

  }

}
