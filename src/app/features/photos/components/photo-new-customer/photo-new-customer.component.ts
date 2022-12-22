import { Component, OnInit } from '@angular/core';
import { LogicService } from '../../services/logic.service';

@Component({
  selector: 'app-photo-new-customer',
  templateUrl: './photo-new-customer.component.html',
  styleUrls: ['./photo-new-customer.component.scss']
})
export class PhotoNewCustomerComponent implements OnInit {

  constructor(
    private logic: LogicService
  ) { }

  ngOnInit(): void {
    this.logic.getListPhoto();
  }

}
