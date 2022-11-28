import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-side-menu-user',
  templateUrl: './side-menu-user.component.html',
  styleUrls: ['./side-menu-user.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SideMenuUserComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
