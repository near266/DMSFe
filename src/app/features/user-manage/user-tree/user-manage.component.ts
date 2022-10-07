import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-user-manage',
  templateUrl: './user-manage.component.html',
  styleUrls: ['./user-manage.component.scss']
})
export class UserManageComponent implements OnInit {

  constructor(
    private title: Title
  ) { }

  item = {
    level: 1,
    name: 'level1',
    tree: [
      {
        level: 2,
        name: 'level2',
        tree: [
          {
            level: 3,
            name: 'level3',
            tree: [
              {
                level: 4,
                name: 'level4',
                tree: null
              }]
          },
          {
            level: 3,

            name: 'level3+2',
            tree: [
              {
                level: 4,
                name: 'level4',
                tree: null
              }]
          },
          {
            level: 3,
            name: 'level3+3',
            tree: [
              {
                level: 4,
                name: 'level4',
                tree: null
              }]
          }]
      },
      {
        level: 2,
        name: 'level2.2',
        tree: [{
          level: 3,
          name: 'level3.2',
          tree: [{
            level: 4,
            name: 'level4.2',
            tree: null
          }]
        }]
      }]
  }

  timedOutCloser: any

  ngOnInit(): void {
    this.title.setTitle('Cây đơn vị - DMS:Delap')
    console.log(this.item);
  }

  listMenuPosition = [
    { title: 'Tất cả', leftIcon: 'fa-check text-emerald-500', value: 'all' },
    { title: 'Nhân viên', leftIcon: 'fa-person text-emerald-500', value: 'emp' },
    { title: 'Nhân viên gói Basic', leftIcon: 'fa-person text-emerald-500', value: 'emp-basic' },
    { title: 'Kế toán', leftIcon: 'fa-dollar-sign text-red-500', value: 'ketoan'},
    { title: 'Giám sát', leftIcon: 'fa-user text-yellow-500', value: 'giamsat'},
    { title: 'Chủ sở hữu', leftIcon: 'fa-dollar-sign text-red-500', value: 'ketoan'},
  ]

  Select(value: any) {
    console.log(value);

  }

  mouseEnter(trigger: any) {
    if (this.timedOutCloser) {
      clearTimeout(this.timedOutCloser);
    }
    trigger.openMenu();
  }

  mouseLeave(trigger: any) {
    this.timedOutCloser = setTimeout(() => {
      trigger.closeMenu();
    }, 50);
  }

}
