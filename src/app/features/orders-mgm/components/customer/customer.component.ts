import { Component, OnInit, DoCheck, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/core/services/data.service';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit, DoCheck, OnDestroy {
  subscription!: Subscription;
  type: string = 'View';

  constructor(private dataservice: DataService) { }

  ngOnInit(): void {
    this.subscription = this.dataservice.type.subscribe((data: any) => {
      this.type = data;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngDoCheck(): void {

  }

}
