import { Component, Input, OnInit, ViewChild, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { IActionMapping, ITreeOptions, TreeComponent, TreeNode, TreeNodeComponent, TREE_ACTIONS} from '@circlon/angular-tree-component';
import { Response } from 'src/app/core/model/Response';
import { EmployeeService } from 'src/app/core/services/employee.service';

@Component({
  selector: 'app-menu-collapse-tree-multiple',
  templateUrl: './menu-collapse-tree-multiple.component.html',
  styleUrls: ['./menu-collapse-tree-multiple.component.scss']
})
export class MenuCollapseTreeMultipleComponent implements OnInit, AfterViewInit {

  @ViewChild(TreeComponent) private tree: TreeComponent;
  @Output() newItemEvent = new EventEmitter<string>();

  nodes: any[] = [];
  action: IActionMapping;
  options: ITreeOptions;

  settings: any = {};
  total: number;

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.employeeService.getTreeEmployee().subscribe((tree) => {
      const newTree = { id: 'root', level: -1, name: 'Tất cả', children: [{}]};
      newTree.children = this.convertTree(tree);
      this.nodes = [newTree];
      this.total = this.getTotalItemInTreeWithNoChildren(this.nodes);
      this.action = {
        mouse: {
          click: (tree, node, $event) => {
            this.newItemEvent.emit(node.data.id);
          }
        },
      };
      this.options = {
        useCheckbox: true,
        animateExpand: false,
        actionMapping: this.action
      };
    });
  }

  ngAfterViewInit(): void {
    // this.tree.treeModel.subscribeToState((state: any) => {
    //   const selected = Object.assign({}, this.tree.treeModel.selectedLeafNodeIds);
    //   if(Object.keys(selected).length > 0){
    //     const listIdSelected: string[] = [];
    //     Object.keys(selected).forEach( element => {
    //       if (selected[element]) {
    //         listIdSelected.push(element);
    //       }
    //     });
    //     this.newItemEvent.emit(listIdSelected);
    //   }
    // });
  }

  convertTree(tree: any[]) {
      let nodes: any[] = [];
      tree.forEach((element: any) => {
          let node = {
              id: element.item.id,
              level: element.item.levelOfNode,
              name: element.item.name,
              code: element.item.unitTreeGroup_Code,
              children: this.convertTree(element.children),
              type: element.item.type,
              hasChildren: true
          };
          if(node.children.length == 0) node.hasChildren = false;
          nodes.push(node);
      });
      return nodes;
  }

  getTotalItemInTreeWithNoChildren(tree: any[]) {
    let total = 0;
    tree.forEach((element: any) => {
        if (element.children.length == 0) {
            total++;
        } else {
            total += this.getTotalItemInTreeWithNoChildren(element.children);
        }
    });
    return total;
  }
}
