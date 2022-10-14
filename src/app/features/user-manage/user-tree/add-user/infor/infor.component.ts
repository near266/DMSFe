import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/core/services/data.service';
import { EmployeeService } from 'src/app/core/services/employee.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';

@Component({
  selector: 'app-infor',
  templateUrl: './infor.component.html',
  styleUrls: ['./infor.component.scss']
})
export class InforComponent implements OnInit, OnDestroy {

  constructor(
    private dataService: DataService,
    public datePipe: DatePipe,
    private employeeService: EmployeeService,
    private snackbar: SnackbarService
  ) { }

  type: 'text'
  sub: Subscription
  img: any
  avt?: any = "../../../../../../assets/images/female.png"
  entranceDate = {
    date: 1,
    month: 1,
    year: 1,
    ISOS: new Date()
  }

  exitDate = {
    date: 1,
    month: 1,
    year: 1,
    ISOS: new Date()
  }
  @Input() status: any
  @Input() id: any
  @Output() event = new EventEmitter<any>();

  employee = new FormGroup({
    id: new FormControl(),
    status: new FormControl(true),
    email: new FormControl('', [Validators.required, Validators.email]),
    employeeCode: new FormControl('', Validators.required),
    employeeName: new FormControl('', Validators.required),
    password: new FormControl('', [Validators.required]),
    employeeTitle: new FormControl('', Validators.required),
    phone: new FormControl(),
    position: new FormControl(),
    department: new FormControl(),
    langKey: new FormControl(),
    address: new FormControl(),
    entranceDate: new FormControl(),
    exitDate: new FormControl(),
    gender: new FormControl(),
    avatar: new FormControl(this.avt),
    login: new FormControl(),
    authorities: new FormControl([
      "ROLE_USER"
    ]),
  })
  ngOnInit(): void {
    if (this.status == 'view' || this.status == 'edit') {
      let sub = this.employeeService.DetailEmployee(this.id).subscribe(data => {
        this.employee.patchValue({
          id: data.id,
          status: data.status,
          email: data.email,
          employeeCode: data.employeeCode,
          employeeName: data.employeeName,
          employeeTitle: data.employeeTitle,
          phone: data.phone,
          position: data.position,
          department: data.department,
          langKey: data.langKey,
          address: data.address,
          entranceDate: data.entranceDate,
          exitDate: data.exitDate,
          gender: data.gender,
          avatar: data.avatar,
        })

        this.employee.addControl('lastModifiedBy', new FormControl(data.lastModifiedBy))
        this.employee.addControl('lastModifiedDate', new FormControl(data.lastModifiedDate))
        this.employee.addControl('lastSeenDate', new FormControl(data.lastSeenDate))
        this.employee.addControl('lastSyncDate', new FormControl(data.lastSyncDate))
        this.employee.addControl('versionMobile', new FormControl(data.versionMobile))

        this.avt = data.avatar

        this.entranceDate.ISOS = new Date(this.employee.value.entranceDate)
        this.exitDate.ISOS = new Date(this.employee.value.exitDate)

        this.entranceDate.date = this.entranceDate.ISOS.getDate()
        this.entranceDate.month = this.entranceDate.ISOS.getMonth() + 1
        this.entranceDate.year = this.entranceDate.ISOS.getFullYear()

        this.exitDate.date = this.exitDate.ISOS.getDate()
        this.exitDate.month = this.exitDate.ISOS.getMonth() + 1
        this.exitDate.year = this.exitDate.ISOS.getFullYear()
      })
    }
    this.sub = this.dataService.employee.subscribe(data => {
      if (data == 'add' || data == 'update') {
        if (data == 'add') {
          if (this.employee.valid) {

            this.entranceDate.ISOS.setFullYear(this.entranceDate.year!, this.entranceDate.month! - 1, this.entranceDate.date!)
            this.entranceDate.ISOS.setHours(7, 0, 0, 0)
            this.employee.value.entranceDate = this.entranceDate.ISOS.toISOString()

            this.exitDate.ISOS.setFullYear(this.exitDate.year!, this.exitDate.month! - 1, this.exitDate.date!)
            this.exitDate.ISOS.setHours(7, 0, 0, 0)
            this.employee.value.exitDate = this.exitDate.ISOS.toISOString()

            this.employee.value.login = this.employee.value.email

            this.employeeService.AddEmployee(this.employee.value).subscribe(data => {
              this.snackbar.openSnackbar('Tạo thành công', 5000, 'Đóng', 'center', 'bottom', true);
            },
              () => {
                this.snackbar.openSnackbar('Có lỗi xảy ra', 3000, 'Đóng', 'center', 'bottom', false);
              })
          }
        }
        if (data == 'update') {
          this.employee.removeControl('password')
          this.employee.removeControl('login')
          this.employee.removeControl('authorities')
          if (this.employee.valid) {
            let sub = this.employeeService.UpdateEmployee(this.employee.value).subscribe(data => {
              this.snackbar.openSnackbar('Sửa thành công', 5000, 'Đóng', 'center', 'bottom', true);
              sub.unsubscribe()
            },
              () => {
                this.snackbar.openSnackbar('Có lỗi xảy ra', 3000, 'Đóng', 'center', 'bottom', false);
                sub.unsubscribe()
              })
          }
        }
      }
      if (data == 'delete') {
        let sub = this.employeeService.DeleteEmployee(this.employee.value.id).subscribe(data => {
          this.snackbar.openSnackbar('Đã xóa', 5000, 'Đóng', 'center', 'bottom', true);
          this.event.emit('delete')
          sub.unsubscribe()
        },
          () => {
            this.snackbar.openSnackbar('Có lỗi xảy ra', 3000, 'Đóng', 'center', 'bottom', false);
            sub.unsubscribe()
          })
      }
    })
  }

  uploadFile($event: any) {
    let file = $event.target.files
    let reader = new FileReader()
    reader.readAsDataURL(file[0]);
    reader.onload = (_event) => {
      const img_obj = {
        data: reader.result,
        id: 1,
        name: file[0].name
      }
      this.img = img_obj
      this.employee.value.avatar = img_obj.data
    }
  }

  deleteImage() {
    this.avt = "../../../../../../assets/images/female.png"
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe()
  }

}
