import { Component, OnInit } from '@angular/core';
import { CustomerService } from 'src/app/core/services/customer.service';

@Component({
  selector: 'app-add-cus-to-route',
  templateUrl: './add-cus-to-route.component.html',
  styleUrls: ['./add-cus-to-route.component.scss']
})
export class AddCusToRouteComponent implements OnInit {

  constructor(
    private customerSer: CustomerService
  ) { }

  ngOnInit(): void {
    this.init()
  }
  dataCus:any;

  init(){
    let body = {
      keyword: "",
      listRouteId: null,
      page: 1,
      pageSize: 30,
    }
    this.customerSer.search(body).subscribe({
      next: data => {
        console.log(data);
        this.dataCus = data;
      }
    })
  }

}
