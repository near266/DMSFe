import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-infor',
  templateUrl: './infor.component.html',
  styleUrls: ['./infor.component.scss']
})
export class InforComponent implements OnInit {

  constructor() { }

  listimg: any = []

  ngOnInit(): void {
  }
  uploadFile($event: any) {
    let file = $event.target.files
    for (let i = 0; i < file.length; i++) {
      let reader = new FileReader()
      reader.readAsDataURL(file[i]);
      reader.onload = (_event) => {
        const img_obj = {
          data: reader.result,
          id: this.listimg[this.listimg.length - 1]?.id + 1 || this.listimg.length + 1,
          name: file[i].name
        }
        this.listimg.push(img_obj)
      }
    }
  }

}
