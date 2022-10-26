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
      if(element.toLowerCase().includes(keywords.toLowerCase())) {
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
}
