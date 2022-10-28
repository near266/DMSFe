import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { Config } from 'src/app/core/model/Config';

@Component({
  selector: 'app-menu-collapse-search',
  templateUrl: './menu-collapse-search.component.html',
  styleUrls: ['./menu-collapse-search.component.scss']
})
export class MenuCollapseSearchComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() Config = new Config();
  @Output() Selection = new EventEmitter<string>();
  keyword = '';
  isShowmenu = false;
  isSelect = false;
  selectedChildren!: string;
  buffer_menu_item:string[] = [];
  constructor() {}
  ngOnChanges(changes: SimpleChanges): void {
    this.buffer_menu_item = this.Config.menuChildrens;
  }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
      let iconNode = document.getElementById(`icon-${this.Config.title}`);
      if (this.Config.icon) {
          iconNode!.innerHTML = this.Config.icon;
      }
  }
  select(menuChildren: string) {
      this.isSelect = true;
      this.isShowmenu = false;
      this.selectedChildren = menuChildren;
      this.Selection.emit(menuChildren);
  }
  search(keywords: string) {
    this.buffer_menu_item = [];
    this.Config.menuChildrens.forEach( (element) => {
      if(this.removeVietnameseTones(element.toLowerCase()).includes(this.removeVietnameseTones(keywords.toLowerCase()))) {
        this.buffer_menu_item.push(element);
      }
    });
    if(this.buffer_menu_item.length <= 0) {
      this.buffer_menu_item = this.Config.menuChildrens;
    }
  }

  cancelSelect() {
      this.isSelect = false;
      this.Selection.emit('');
  }

  stopPropagation(e: any) {
      e.stopPropagation();
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
