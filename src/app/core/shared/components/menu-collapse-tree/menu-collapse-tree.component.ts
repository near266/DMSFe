import { Component, Input, OnInit } from '@angular/core';
import { ITreeOptions } from '@circlon/angular-tree-component';

@Component({
  selector: 'app-menu-collapse-tree',
  templateUrl: './menu-collapse-tree.component.html',
  styleUrls: ['./menu-collapse-tree.component.scss']
})
export class MenuCollapseTreeComponent implements OnInit {

  @Input() nodes: any[] = [
    {
      id: 'all',
      name: 'Tất cả',
      children: [
        {
          id: 2, name: 'child1',
          children: [
            { id: 4, name: 'child1' },
            {
              id: 5, name: 'child2',
              children: [
                {
                  id: 8, name: 'child1',
                  children: [
                    { id: 10, name: 'child1' },
                    { id: 11, name: 'child2' }
                  ]
                },
                {
                  id: 9, name: 'child2',
                  children: [
                    { id: 12, name: 'child1' },
                    { id: 13, name: 'child2' }
                  ]
                }
              ]
            },
            {
              id: 14, name: 'child2',
              children: [
                {
                  id: 15, name: 'child1',
                  children: [
                    { id: 16, name: 'child1' },
                    { id: 17, name: 'child2' }
                  ]
                },
                {
                  id: 19, name: 'child2',
                  children: [
                    { id: 18, name: 'child1' },
                    { id: 20, name: 'child2' }
                  ]
                }
              ]
            }
          ]
        },
        {
          id: 3, name: 'child2',
          children: [
            { id: 6, name: 'child1' },
            { id: 7, name: 'child2' }
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
  Config(e: any) {
    console.log(e);

  }

}
