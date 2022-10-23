import { Component, OnInit, AfterViewInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Response } from 'src/app/core/model/Response';
import { CustomerService } from 'src/app/core/services/customer.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';

@Component({
  selector: 'app-add-route',
  templateUrl: './add-route.component.html',
  styleUrls: ['./add-route.component.scss']
})
export class AddRouteComponent implements OnInit, AfterViewInit {

  response: Response<any> = {
    data: [],
    totalCount: 0
  }
  data: any[] = [];

  list: string[] = [];

  constructor(
    private customerService: CustomerService,
    public dialogRef: MatDialogRef<AddRouteComponent>,
    @Inject(MAT_DIALOG_DATA)public id: string,
    private snackbar: SnackbarService
  ) {}
  ngAfterViewInit(): void {
    this.customerService.getall(1, 10000).subscribe(data => {
      this.response = data;
      this.customerService.SearchAllRouteByCustomerId(this.id).subscribe( res => {
        this.response.data.forEach( (e: any) => {
          let check = true;
          res.list.forEach((element: any) => {
            if(e.id.includes(element.id)) {
              check = false;
            }
          });
          if(check == true) {
            this.data.push(e);
          }
        });
      });
    });
  }

  ngOnInit(): void {
  }

  close() {
    this.dialogRef.close({event: true});
  }

  change(id: string) {
    if(this.list.indexOf(id) != -1) {
      this.list.splice(this.list.indexOf(id), 1);
      this.delete(id);
    } else {
      this.list.push(id);
      this.submit(id);
    }
  }

  delete(id: string) {
    const body = {
      routeId: id,
      customerId: [this.id]
    };
    this.customerService.deleteCusFromRoute(body).subscribe(data => {
      this.snackbar.openSnackbar('Xóa tuyến thành công', 2000, 'Đóng', 'center', 'bottom', true);

    }, (error) => {
      this.snackbar.openSnackbar('Xóa tuyến không thành công', 2000, 'Đóng', 'center', 'bottom', true);
    });
  }

  submit(id: string) {
    const body = {
      routeid: id,
      listCustomer: [this.id]
    };

    this.customerService.addCusToRoute(body).subscribe(data => {
      this.snackbar.openSnackbar('Thêm tuyến thành công', 2000, 'Đóng', 'center', 'bottom', true);
    }, (error) => {
      this.snackbar.openSnackbar('Thêm tuyến không thành công', 2000, 'Đóng', 'center', 'bottom', true);
    });
  }

}
