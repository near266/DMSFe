import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-infor',
  templateUrl: './infor.component.html',
  styleUrls: ['./infor.component.scss']
})
export class InforComponent implements OnInit {

  constructor() { }

  img: any
  avt?: any = "../../../../../../assets/images/female.png"

  @Input() status: any

  ngOnInit(): void {
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
      this.avt = img_obj.data
    }
  }

  deleteImage(){
    this.avt = "../../../../../../assets/images/female.png"
  }

}
