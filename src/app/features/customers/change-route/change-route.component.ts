import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CustomerService } from 'src/app/core/services/customer.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { AddRouteComponent } from '../add-route/add-route.component';

@Component({
  selector: 'app-change-route',
  templateUrl: './change-route.component.html',
  styleUrls: ['./change-route.component.scss']
})
export class ChangeRouteComponent implements OnInit, AfterViewInit {

  @Input() id: string;
  response: any = {
    list: []
  };

  constructor(
    private customerService: CustomerService,
    private dialog: MatDialog,
    private snackbar: SnackbarService
  ) {}
  ngAfterViewInit(): void {
    this.customerService.SearchAllRouteByCustomerId(this.id).subscribe( data => {
      this.response = data;
    });
  }

  ngOnInit(): void {

  }

  open() {
    let dialogRef = this.dialog.open(AddRouteComponent, {
      minWidth: '400px',
      data: this.id
    });
    dialogRef.afterClosed().subscribe(data => {
      if(data) {
        this.customerService.SearchAllRouteByCustomerId(this.id).subscribe( data => {
          this.response = data;
        });
      }
    })
  }

  delete(id: string) {
    const body = {
      routeId: id,
      customerId: [this.id]
    };
    this.customerService.deleteCusFromRoute(body).subscribe(data => {
      if(data) {
        this.snackbar.openSnackbar('Xóa tuyến thành công', 2000, 'Đóng', 'center', 'bottom', true);
        this.customerService.SearchAllRouteByCustomerId(this.id).subscribe( data => {
          this.response = data;
        });
      }
    }, (error) => {
      this.snackbar.openSnackbar('Xóa tuyến không thành công', 2000, 'Đóng', 'center', 'bottom', true);
    });
  }

}
