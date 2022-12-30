import { Component, OnInit, AfterViewInit, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { Response } from 'src/app/core/model/Response';
import { CustomerService } from 'src/app/core/services/customer.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';

@Component({
  selector: 'app-add-route',
  templateUrl: './add-route.component.html',
  styleUrls: ['./add-route.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddRouteComponent implements OnInit, AfterViewInit {

  response: Response<any> = {
    data: [],
    totalCount: 0
  }

  private routes: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public routes$ = this.routes.asObservable();

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
          if(res.list) {
            res.list.forEach((element: any) => {
              if(e.id.includes(element.id)) {
                check = false;
              }
            });
          }
          if(check == true) {
            this.data.push(e);
          }
        });
        this.routes.next(this.data);
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

  search(keyword: string) {
    if(keyword == '' || keyword == null) {
        this.routes.next(this.data);
        return;
    } else {
        let temp: any[] = [];
        this.data.forEach(element => {
            if(this.removeVietnameseTones(element.routeName.toLowerCase()).includes(this.removeVietnameseTones(keyword.toLowerCase()))) {
                temp.push(element);
            }
        });
        this.routes.next(temp);
        return;
    }
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

  trackByFn(index: number, item: any) {
    // if (!item) return null;
    return item.id;
  }

  removeVietnameseTones(str: any) {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
    str = str.replace(/đ/g, 'd');
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A');
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E');
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I');
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O');
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U');
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y');
    str = str.replace(/Đ/g, 'D');
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, '');
    str = str.replace(/\u02C6|\u0306|\u031B/g, '');
    str = str.replace(/ + /g, ' ');
    str = str.trim();
    str = str.replace(
      /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
      ' '
    );
    return str;
  }

}
