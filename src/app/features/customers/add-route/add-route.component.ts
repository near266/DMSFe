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
      this.customerService.SearchAllRouteByCustomerId(this.id).subscribe( data => {
        this.response.data.forEach( (e: any) => {
          data.list.forEach((element: any) => {
            if(e.id != element.id) {
              this.data.push(e);
            }
          });
        });
      });
    });
  }

  ngOnInit(): void {
  }

  close() {
    this.dialogRef.close();
  }

  change(id: string) {
    if(this.list.indexOf(id) != -1) {
      this.list.splice(this.list.indexOf(id), 1);
    } else {
      this.list.push(id);
    }
  }

  submit() {
    const body = {
      routeid: [this.id],
      listCustomer: this.list
    };

    this.customerService.addCusToRoute(body).subscribe(data => {
      this.snackbar.openSnackbar('Thêm tuyến thành công', 2000, 'Đóng', 'center', 'bottom', true);
      this.dialogRef.close({event: true});
    }, (error) => {
      this.snackbar.openSnackbar('Thêm tuyến không thành công, vui lòng kiểm tra lại thông tin chỉnh sửa', 2000, 'Đóng', 'center', 'bottom', true);
    });
  }

}
