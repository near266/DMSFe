import { Component, Input, OnInit } from '@angular/core';
import { ITreeOptions } from '@circlon/angular-tree-component';
@Component({
  selector: 'app-user-tree-view',
  templateUrl: './user-tree-view.component.html',
  styleUrls: ['./user-tree-view.component.scss']
})
export class UserTreeViewComponent implements OnInit {
  @Input() nodes: any[] = [
    {
      id: 1,
      name: 'root1',
      children: [
        { id: 2, name: 'child1' },
        { id: 3, name: 'child2' }
      ]
    },
    {
      id: 4,
      name: 'root2',
      children: [
        { id: 5, name: 'child2.1' },
        {
          id: 6,
          name: 'child2.2',
          children: [
            { id: 7, name: 'subsub' }
          ]
        }
      ]
    }
  ];
  options: ITreeOptions = {
    useCheckbox: true,
  };
  settings: any = {}
  constructor() { }

  ngOnInit(): void {
  }

}
