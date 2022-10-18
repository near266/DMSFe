import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { IActionMapping, ITreeOptions, } from '@circlon/angular-tree-component';
import { EmployeeService } from 'src/app/core/services/employee.service';
import { AddAccountantComponent } from '../add-accountant/add-accountant.component';
import { AddEmployeeComponent } from '../add-employee/add-employee.component';
import { AddManagerComponent } from '../add-manager/add-manager.component';
import { AddSalesTeamComponent } from '../add-sales-team/add-sales-team.component';

@Component({
    selector: 'app-user-tree-view',
    templateUrl: './user-tree-view.component.html',
    styleUrls: ['./user-tree-view.component.scss'],
})
export class UserTreeViewComponent implements OnInit {
    nodes: any[] = [];
    action: IActionMapping;
    options: ITreeOptions;

    menubar_unit = [
      'Thêm quản lý',
      'Thêm kế toán',
      'Thêm nhóm khách hàng',
      'Thêm đơn vị con'
    ];

    menubar_group = [
      'Thêm quản lý',
      'Thêm kế toán',
      'Thêm nhân viên'
    ];

    settings: any = {};
    total: number;
    constructor(private employeeService: EmployeeService, private dialog: MatDialog) {}

    ngOnInit(): void {
      this.init();
    }
    init() {
      this.action = {
        mouse: {
          contextMenu: (tree, node, $event) => {
            node.data.expand = !node.data.expand;
          },
          click: (tree, node, $event) => {
            node.data.expand = !node.data.expand;
          },
        },
      };
      this.options = {
        useCheckbox: true,
        animateExpand: true,
        actionMapping: this.action
      };

      this.employeeService.getTreeEmployee().subscribe((tree) => {
          console.log(tree);
          const newTree = { id: 'root', level: -1, name: 'Tất cả', children: [{}], expand: false, menubar: ['Thêm nhóm bán hàng', 'Thêm đơn vị'] };
          newTree.children = this.convertTree(tree);
          this.nodes = [newTree];
          this.total = this.getTotalItemInTreeWithNoChildren(this.nodes);
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
                menubar: this.menubar_group
            };
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
      // this.menuTrigger.openMenu()
    }

    right_click(event: any) {
      console.log(event);

    }

    open_add_sales_team(id: string) {
      let dialogRef = this.dialog.open(AddSalesTeamComponent, {
        // height: '30vh',
        minWidth: '800px',
        data: id
      });
      dialogRef.afterClosed().subscribe( data => {
        if(data) {
          this.init();
        }
      });
    }

    open_add_manager(id: string) {
      let dialogRef = this.dialog.open(AddManagerComponent, {
        height: '100vh',
        minWidth: '1100px',
        data: id
      });
      dialogRef.afterClosed().subscribe( data => {
        if(data) {
          this.init();
        }
      });
    }

    open_add_accountant(id: string) {
      let dialogRef = this.dialog.open(AddAccountantComponent, {
        height: '100vh',
        minWidth: '1100px',
        data: id
      });
      dialogRef.afterClosed().subscribe( data => {
        if(data) {
          this.init();
        }
      });
    }

    open_add_employee(id: string) {
      let dialogRef = this.dialog.open(AddEmployeeComponent, {
        height: '100vh',
        minWidth: '1100px',
        data: id
      });
      dialogRef.afterClosed().subscribe( data => {
        if(data) {
          this.init();
        }
      });
    }

    menuBar(keyword: string, node: any) {
      // if(node)
      switch(keyword) {
        case 'Thêm quản lý': {
          this.open_add_manager(node.data.id);
          return;
        }
        case 'Thêm kế toán': {
          this.open_add_accountant(node.data.id);
          return;
        }
        case 'Thêm nhóm khách hàng': {
          this.open_add_sales_team(node.data.id);
          return;
        }
        case 'Thêm nhân viên': {
          this.open_add_employee(node.data.id);
          return;
        }
        case 'Thêm đơn vị con': {

          return;
        }
      }
    }
}
