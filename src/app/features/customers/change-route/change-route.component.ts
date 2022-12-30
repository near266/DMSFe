import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CustomerService } from 'src/app/core/services/customer.service';
import { RolesService } from 'src/app/core/services/roles.service';
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

  listRole: string[] = [];

  constructor(
    private customerService: CustomerService,
    private dialog: MatDialog,
    private snackbar: SnackbarService,
    private rolesService: RolesService
  ) {}
  ngAfterViewInit(): void {
    this.customerService.SearchAllRouteByCustomerId(this.id).subscribe( data => {
      this.response = data;
    });
  }

  ngOnInit(): void {
    this.listRole = ('' + localStorage.getItem('role')).split(',');
  }

  open() {
    let dialogRef = this.dialog.open(AddRouteComponent, {
      minWidth: '400px',
      data: this.id,
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe(data => {
      if(data) {
        this.customerService.SearchAllRouteByCustomerId(this.id).subscribe( data => {
          this.response = data;
        });
      }
    })
  }

  requiredRoles(role: string){

    return this.rolesService.requiredRoles(role)
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
