import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/core/services/data.service';
import { EmployeeService } from 'src/app/core/services/employee.service';
import { ImagesService } from 'src/app/core/services/images.service';
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
    private snackbar: SnackbarService,
    private imageService: ImagesService
  ) { }

  type: 'text'
  sub: Subscription
  img: any
  avt?: any = "../../../../../../assets/images/female.png"
  entranceDate = {
    date: 1,
    month: 1,
    year: 2021,
    ISOS: new Date()
  }

  exitDate = {
    date: 1,
    month: 1,
    year: 2022,
    ISOS: new Date()
  }
  @Input() status: any
  @Input() id: any
  @Output() event = new EventEmitter<any>();

  employee = new FormGroup({
    id: new FormControl(),
    status: new FormControl(true),
    email: new FormControl('', [Validators.required, Validators.email, Validators.minLength(5)]),
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
      "MEMBER"
    ]),
  })
  ngOnInit(): void {
    if (this.status == 'view' || this.status == 'edit') {
      let sub1 = this.employeeService.DetailEmployee(this.id).subscribe(data => {
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
          avatar: data.avatar
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
        sub1.unsubscribe()
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

            this.employee.controls['login'].setValue(this.employee.controls['email'].value);

            switch(this.employee.controls['employeeTitle'].value) {
              case 'Nhân viên': {
                this.employee.controls['authorities'].setValue(["MEMBER"]);
                break;
              }
              case 'Nhân viên dùng gói Basic': {
                this.employee.controls['authorities'].setValue(["MEMBER"]);
                break;
              }
              case 'Kế toán': {
                this.employee.controls['authorities'].setValue(["ACCOUNTANT", "MEMBER"]);
                break;
              }
              case 'Giám sát': {
                this.employee.controls['authorities'].setValue(["MANAGER", "ACCOUNTANT", "MEMBER"]);
                break;
              }
              case 'Chủ sở hữu': {
                this.employee.controls['authorities'].setValue(["SALE_ADMIN" ,"MANAGER", "ACCOUNTANT", "MEMBER"]);
                break;
              }
            }

            let sub5 = this.employeeService.AddEmployee(this.employee.value).subscribe(data => {
              this.snackbar.openSnackbar('Tạo thành công', 5000, 'Đóng', 'center', 'bottom', true);
              this.dataService.changeEmployee('success')
              sub5.unsubscribe()
            },
              (error) => {
                this.snackbar.openSnackbar('Có lỗi xảy ra', 3000, 'Đóng', 'center', 'bottom', false);
                this.dataService.changeEmployee('failed')
                sub5.unsubscribe()
              })
          }
          this.dataService.changeEmployee('')
        }
        if (data == 'update') {
          this.employee.removeControl('password')
          // this.employee.removeControl('login')
          // this.employee.removeControl('authorities')
          // this.employee.controls['password'].setValue('Abc@1234');
          this.employee.controls['login'].setValue(this.employee.controls['email'].value);

          switch(this.employee.controls['employeeTitle'].value) {
            case 'Nhân viên': {
              this.employee.controls['authorities'].setValue(["MEMBER"]);
              break;
            }
            case 'Nhân viên dùng gói Basic': {
              this.employee.controls['authorities'].setValue(["MEMBER"]);
              break;
            }
            case 'Kế toán': {
              this.employee.controls['authorities'].setValue(["ACCOUNTANT", "MEMBER"]);
              break;
            }
            case 'Giám sát': {
              this.employee.controls['authorities'].setValue(["MANAGER", "ACCOUNTANT", "MEMBER"]);
              break;
            }
            case 'Chủ sở hữu': {
              this.employee.controls['authorities'].setValue(["SALE_ADMIN" ,"MANAGER", "ACCOUNTANT", "MEMBER"]);
              break;
            }
          }
          if (this.employee.valid) {
            let sub3 = this.employeeService.UpdateUser(this.employee.value).subscribe(data => {
              this.snackbar.openSnackbar('Sửa thành công', 5000, 'Đóng', 'center', 'bottom', true);
              this.dataService.changeEmployee('success')
              sub3.unsubscribe()
            },
              () => {
                this.snackbar.openSnackbar('Có lỗi xảy ra', 3000, 'Đóng', 'center', 'bottom', false);
                this.dataService.changeEmployee('failed')
                sub3.unsubscribe()
              })
          }
          this.dataService.changeEmployee('')
        }
      }
      if (data == 'delete') {
        // let sub4 = this.employeeService.ArchiveEmployee(this.employee.value.id, this.employee.value.lastModifiedBy, this.employee.value.lastModifiedDate).subscribe(data => {
        //   this.snackbar.openSnackbar('Đã xóa', 5000, 'Đóng', 'center', 'bottom', true);
        //   this.event.emit('delete')
        //   this.dataService.changeEmployee('success')
        //   sub4.unsubscribe()
        // },
        //   () => {
        //     this.snackbar.openSnackbar('Có lỗi xảy ra', 3000, 'Đóng', 'center', 'bottom', false);
        //     this.event.emit('delete')
        //     this.dataService.changeEmployee('failed')
        //     sub4.unsubscribe()
        //   })
      }
    })
  }

  uploadFile($event: any) {
    let file = $event.target.files;
    if (file.length == 1) {
      let upload = this.imageService.uploadImg(file).subscribe( data => {
        if (data) {
          this.employee.controls['avatar'].setValue(data[0]);
          this.avt = data[0];
        } else {
          this.snackbar.openSnackbar('Tải ảnh thất bại', 2000, 'Đóng', 'center', 'bottom', false);
        }
        upload.unsubscribe();
      }, (error) => {
        this.snackbar.openSnackbar('Tải ảnh thất bại', 2000, 'Đóng', 'center', 'bottom', false);
        upload.unsubscribe();
      })
    }
  }

  deleteImage() {
    this.avt = "../../../../../../assets/images/female.png"
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe()
  }

}
