import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DataService } from 'src/app/core/services/data.service';

@Component({
  selector: 'app-infor',
  templateUrl: './infor.component.html',
  styleUrls: ['./infor.component.scss']
})
export class InforComponent implements OnInit {

  constructor(
    private dataService: DataService
  ) { }

  img: any
  avt?: any = "../../../../../../assets/images/female.png"
  entranceDate = {
    date: 1,
    month: 1,
    year: 1
  }

  exitDate = {
    date: 1,
    month: 1,
    year: 1
  }
  @Input() status: any

  employee = new FormGroup({
    employeeId: new FormControl(),
    status: new FormControl(true),
    email: new FormControl('', Validators.required),
    employeeCode: new FormControl('', Validators.required),
    employeeName: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
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
  })

  ngOnInit(): void {
    this.dataService.employee.subscribe(data => {
      if (data == 'add') {
        this.employee.value.entranceDate = new Date()
        this.employee.value.entranceDate.setFullYear(this.entranceDate.year!, this.entranceDate.month! - 1, this.entranceDate.date!)
        this.employee.value.entranceDate.setHours(7, 0, 0, 0)
        this.employee.value.entranceDate = this.employee.value.entranceDate.toISOString()
        this.employee.value.exitDate = new Date()
        this.employee.value.exitDate.setFullYear(this.exitDate.year!, this.exitDate.month! - 1, this.exitDate.date!)
        this.employee.value.exitDate.setHours(7, 0, 0, 0)
        this.employee.value.exitDate = this.employee.value.exitDate.toISOString()
        console.log(this.employee.value);
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

}
