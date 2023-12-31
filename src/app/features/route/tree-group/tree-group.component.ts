import { Component, Input, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { IActionMapping, ITreeOptions, TreeComponent, TreeNode, TreeNodeComponent, TREE_ACTIONS} from '@circlon/angular-tree-component';
import { Response } from 'src/app/core/model/Response';
import { EmployeeService } from 'src/app/core/services/employee.service';
import { AddAccountantComponent } from '../../user-manage/user-tree/add-accountant/add-accountant.component';
import { AddEmployeeComponent } from '../../user-manage/user-tree/add-employee/add-employee.component';
import { AddManagerComponent } from '../../user-manage/user-tree/add-manager/add-manager.component';
import { AddSalesTeamComponent } from '../../user-manage/user-tree/add-sales-team/add-sales-team.component';
import { AddUnitComponent } from '../../user-manage/user-tree/add-unit/add-unit.component';

@Component({
  selector: 'app-tree-group',
  templateUrl: './tree-group.component.html',
  styleUrls: ['./tree-group.component.scss']
})
export class TreeGroupComponent implements OnInit {

  nodes: any[] = [];
    action: IActionMapping;
    options: ITreeOptions;
    @ViewChild(TreeComponent) private tree: TreeComponent;


    idAndName:any = {
      id: "",
      name: ""
    }

    menubar_unit = [
      'Thêm quản lý',
      'Thêm kế toán',
      'Thêm nhóm bán hàng',
      'Thêm đơn vị con'
    ];

    menubar_group = [
      'Thêm quản lý',
      'Thêm kế toán',
      'Thêm nhân viên'
    ];

    array_index: any[] = [];

    settings: any = {};
    total: number;
    constructor(private employeeService: EmployeeService, private dialog: MatDialog) {}
    @Output() getIdName = new EventEmitter<any>();

    ngOnInit(): void {
      this.init();
    }

    init() {
      this.nodes.push({ id: 'root', level: -1, name: 'Tất cả', expand: false, children: [], menubar: ['Thêm nhóm bán hàng', 'Thêm đơn vị'], hasChildren: true });
      this.init_tree();
    }
    init_tree() {
      this.employeeService.getTreeEmployee().subscribe((tree) => {
        console.log(tree);
          this.addNodeToArray(tree, 'root');
          this.array_index[0].children.forEach((element: any) => {
            let node = {
              id: element.id,
              level: element.level,
              name: element.name,
              code: element.code,
              expand: element.expand,
              type: element.type,
              menubar: element.menubar,
              hasChildren: element.hasChildren
            };
            this.nodes[0].children.push(node);
          });

          this.action = {
            mouse: {
              contextMenu: (tree, node, $event) => {
                node.data.expand = !node.data.expand;
              },
              click: (tree, node, $event) => {
                node.data.expand = false;
                this.idAndName = {
                  id: node.id,
                  name: node.data.name
                };
                this.getIdName.emit(this.idAndName)

              },
              // checkboxClick: (tree, node, $event) => {
              //   node.data.expand = false;
              //   console.log(node.id);
              //   console.log(node.data.name);
              // }
            },
          };
          this.options = {
            useCheckbox: false,
            animateExpand: true,
            actionMapping: this.action,
            getChildren: this.getChildren.bind(this),
          };
      });
    }

    getChildren(node: any) {
      let newNodes: any;
      this.array_index.forEach(e => {
        if(node.data.id == e.id) {
          newNodes = e.children.map((c: any) => Object.assign({}, c));
          // console.log(e.children);
          // this.employeeService.SearchEmployeeInGroup(node.data.id, 1, 1000).subscribe((response: Response<any>) => {
          //   let res = response;
          //   res.data.forEach((element: any) => {
          //     e.children.push({
          //       id: element.employeeId,
          //       name: element.employee.employeeName,
          //       code: 'Nhân viên',
          //       expand: false,
          //       type: 2,
          //       menubar: [],
          //       hasChildren: false
          //     });
          //   });
          //   newNodes = e.children.map((c: any) => Object.assign({}, c));
          // });

        }
      });
      // newNodes = this.asyncChildren.map((c) => Object.assign({}, c));
      return new Promise((resolve, reject) => {
        setTimeout(() => resolve(newNodes), 1000);
      });
    }

    updateNode(node: any) {
      let newNodes: any;
      this.array_index.forEach(e => {
        if(node.data.id == e.id) {
          // console.log(e.children);
          e.children = [];
          this.employeeService.SearchEmployeeInGroup(node.data.id, 1, 1000).subscribe((response: Response<any>) => {
            let res = response;
            res.data.forEach((element: any) => {
              e.children.push({
                id: element.employeeId,
                name: element.employee.employeeName,
                code: 'Nhân viên',
                expand: false,
                type: 2,
                menubar: [],
                hasChildren: false
              });
            });
            newNodes = e.children.map((c: any) => Object.assign({}, c));
            this.tree.treeModel.update();
          });

        }
      });
    }

    addNodeToArray(tree: any[], parent: any) {
      let nodes: any[] = [];
      tree.forEach((element: any) => {
          let node = {
              id: element.item.id,
              level: element.item.levelOfNode,
              name: element.item.name,
              code: element.item.unitTreeGroup_Code,
              expand: false,
              type: element.item.type,
              menubar: this.menubar_group,
              hasChildren: true
          };
          if(element.children.length == 0) node.hasChildren = false;
          if(node.type == 0) node.menubar = this.menubar_unit;
          nodes.push(node);
      });
      this.array_index.push({
        id: parent,
        children: nodes
      });
      tree.forEach((element: any) => {
        this.addNodeToArray(element.children, element.item.id);
      });
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
                expand: false,
                type: element.item.type,
                menubar: this.menubar_group,
                hasChildren: true
            };
            if(node.children.length == 0) node.hasChildren = false;
            if(node.type == 0) node.menubar = this.menubar_unit;
            nodes.push(node);
        });
        return nodes;
    }

    //getTotalItemInTreeWithNoChildren
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
    Config(e: any) {
      e.preventDefault();

    }

    open_add_sales_team(id: string, node: any) {
      let dialogRef = this.dialog.open(AddSalesTeamComponent, {
        // height: '30vh',
        minWidth: '800px',
        data: id
      });
      dialogRef.afterClosed().subscribe( data => {
        if(data) {
          this.updateNode(node);

        }
      });
    }

    open_add_unit(id: string, node: any) {
      let dialogRef = this.dialog.open(AddUnitComponent, {
        // height: '30vh',
        minWidth: '800px',
        data: id
      });
      dialogRef.afterClosed().subscribe( data => {
        if(data) {
          this.updateNode(node);

        }
      });
    }

    open_add_manager(id: string, node: any) {
      let dialogRef = this.dialog.open(AddManagerComponent, {
        height: '100vh',
        minWidth: '1100px',
        data: id
      });
      dialogRef.afterClosed().subscribe( data => {
        if(data) {
          this.updateNode(node);
        }
      });
    }

    open_add_accountant(id: string, node: any) {
      let dialogRef = this.dialog.open(AddAccountantComponent, {
        height: '100vh',
        minWidth: '1100px',
        data: id
      });
      dialogRef.afterClosed().subscribe( data => {
        if(data) {
          this.updateNode(node);

        }
      });
    }

    open_add_employee(id: string, node: any) {
      let dialogRef = this.dialog.open(AddEmployeeComponent, {
        height: '100vh',
        minWidth: '1100px',
        data: id
      });
      dialogRef.afterClosed().subscribe( data => {
        if(data) {
          this.updateNode(node);
        }
      });
    }

    menuBar(keyword: string, node: any) {
      // if(node)
      console.log(node);

      switch(keyword) {
        case 'Thêm quản lý': {
          this.open_add_manager(node.data.id, node);
          return;
        }
        case 'Thêm kế toán': {
          this.open_add_accountant(node.data.id, node);
          return;
        }
        case 'Thêm nhóm bán hàng': {
          this.open_add_sales_team(node.data.id, node);
          return;
        }
        case 'Thêm nhân viên': {
          this.open_add_employee(node.data.id, node);
          return;
        }
        case 'Thêm đơn vị con': {
          this.open_add_unit(node.data.id, node);
          return;
        }
        case 'Thêm đơn vị': {
          this.open_add_unit(node.data.id, node);
          return;
        }
      }
    }

}
