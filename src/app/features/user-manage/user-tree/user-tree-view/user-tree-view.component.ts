import { Component, Input, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { IActionMapping, ITreeOptions, TreeComponent, TreeNode, TreeNodeComponent, TREE_ACTIONS} from '@circlon/angular-tree-component';
import { Response } from 'src/app/core/model/Response';
import { EmployeeService } from 'src/app/core/services/employee.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { ConfirmDialogService } from 'src/app/core/shared/services/confirm-dialog.service';
import { AddAccountantComponent } from '../add-accountant/add-accountant.component';
import { AddEmployeeComponent } from '../add-employee/add-employee.component';
import { AddManagerComponent } from '../add-manager/add-manager.component';
import { AddSalesTeamComponent } from '../add-sales-team/add-sales-team.component';
import { AddUnitComponent } from '../add-unit/add-unit.component';

@Component({
    selector: 'app-user-tree-view',
    templateUrl: './user-tree-view.component.html',
    styleUrls: ['./user-tree-view.component.scss'],
})
export class UserTreeViewComponent implements OnInit {
    nodes: any[] = [];
    action: IActionMapping;
    options: ITreeOptions;
    currentNode: any;

    @ViewChild(TreeComponent) private tree: TreeComponent;
    @Output() newItemEvent = new EventEmitter<string>();

    menubar_unit = [
      'Thêm quản lý',
      'Thêm kế toán',
      'Thêm nhóm bán hàng',
      'Thêm đơn vị con',
      'Sửa nhóm',
      'Xóa nhóm'
    ];

    menubar_group = [
      'Thêm quản lý',
      'Thêm kế toán',
      'Thêm nhân viên',
      'Sửa nhóm',
      'Xóa nhóm'
    ];

    array_index: any[] = [];
    node_expand = '';
    settings: any = {};
    total: number;
    constructor(
      private employeeService: EmployeeService,
      private dialog: MatDialog,
      private modal: ConfirmDialogService,
      private snackbar: SnackbarService
      ) {}

    ngOnInit(): void {
      this.init();
    }

    init() {
      this.nodes.push({ id: 'root', level: -1, name: 'Tất cả', expand: false, children: [], menubar: ['Thêm nhóm bán hàng', 'Thêm đơn vị'], hasChildren: true });
      this.init_tree();
    }
    init_tree() {
      this.employeeService.getTreeEmployee().subscribe((tree) => {
          this.addNodeToArray(tree, 'root');
          this.array_index[0].children.forEach((element: any) => {
            let node = {
              id: element.id,
              level: element.level,
              name: element.name,
              code: element.code,
              parentId: element.parentId,
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
                if(node.treeModel.getNodeById(this.node_expand)) {
                  let n = node.treeModel.getNodeById(this.node_expand);
                  n.data.expand = false;
                  n.treeModel.update();
                }
                node.data.expand = !node.data.expand;
                this.node_expand = node.data.id;
              },
              click: (tree, node, $event) => {
                if(node.data.type != 2 && node.data.expand == false) {
                  this.newItemEvent.emit(node.data.id);
                  node.data.expand = false;
                } else {
                  node.data.expand = false;
                }
                if(node.treeModel.getNodeById(this.node_expand)) {
                  let n = node.treeModel.getNodeById(this.node_expand);
                  n.data.expand = false;
                  n.treeModel.update();
                }
                this.node_expand = node.data.id;
              }
            },
          };
          this.options = {
            useCheckbox: true,
            animateExpand: true,
            actionMapping: this.action,
            getChildren: this.getChildren.bind(this),
          };
          const expandRoot = this.tree.treeModel.getNodeById('root');
          expandRoot.expand();
          // this.total = this.getTotalItemInTreeWithNoChildren(this.nodes);
      });
    }

    getChildren(node: any) {
      let newNode: any;
      let children: any[] = [];
      this.employeeService.GetChildrenByParentId(node.data.id).subscribe((data: any[]) => {
        if(data) {
          data.forEach( element => {
            let nodes = {
              id: element.id,
              level: node.data.levelOfNode + 1,
              name: element.name,
              code: element.unitTreeGroup_Code,
              parentId: node.data.id,
              expand: false,
              type: element.type,
              menubar: this.menubar_group,
              hasChildren: true
            };
            if(nodes.type == 0) node.menubar = this.menubar_unit;
            children.push(nodes);
          });
        }
        this.employeeService.SearchEmployeeInGroup(node.data.id, 1, 1000).subscribe((response: Response<any>) => {
          let res = response;
          res.data.forEach((element: any) => {
            children.push({
              id: element.employee.id,
              name: element.employee.employeeName,
              code: 'Nhân viên',
              expand: false,
              type: 2,
              menubar: ['Di chuyển'],
              hasChildren: false
            });
          });
          newNode = children.map((c: any) => Object.assign({}, c));
        });
      });

      // newNodes = this.asyncChildren.map((c) => Object.assign({}, c));
      return new Promise((resolve, reject) => {
        setTimeout(() => resolve(newNode), 1000);
      });
    }

    updateNode(node: any) {
      let newNode = this.tree.treeModel.getNodeById(node.data.id);
      let children: any[] = [];
      this.employeeService.GetChildrenByParentId(node.data.id).subscribe((data: any[]) => {
        if(data) {
          data.forEach( element => {
            let nodes = {
              id: element.id,
              level: node.data.levelOfNode + 1,
              name: element.name,
              code: element.unitTreeGroup_Code,
              parentId: node.data.id,
              expand: false,
              type: element.type,
              menubar: this.menubar_group,
              hasChildren: true
            };
            if(nodes.type == 0) node.menubar = this.menubar_unit;
            children.push(nodes);
          });
        }
        this.employeeService.SearchEmployeeInGroup(node.data.id, 1, 1000).subscribe((response: Response<any>) => {
          let res = response;
          res.data.forEach((element: any) => {
            children.push({
              id: element.employee.id,
              name: element.employee.employeeName,
              code: 'Nhân viên',
              expand: false,
              type: 2,
              menubar: ['Di chuyển'],
              hasChildren: false
            });
          });
          newNode.data.children = children;
          newNode.treeModel.update();
        });
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
              parentId: parent,
              menubar: this.menubar_group,
              hasChildren: true
          };
          // if(element.children.length == 0) node.hasChildren = false;
          if(node.type == 0) node.menubar = this.menubar_unit;
          nodes.push(node);
      });
      this.array_index.push({
        id: parent,
        children: nodes
      });
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
          if(node.data.children) {
            this.updateNode(node);
          }
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
          if(node.data.children) {
            this.updateNode(node);
          }
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
          if(node.data.children) {
            this.updateNode(node);
          }
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
          if(node.data.children) {
            this.updateNode(node);
          }
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
          if(node.data.children) {
            this.updateNode(node);
          }
        }
      });
    }

    deleteGroup(node: any) {
      this.employeeService.deleteGroup(node.data.id).subscribe(data => {
        if(data) {
          this.snackbar.openSnackbar('Xóa nhóm thành công', 2000, 'Đóng', 'center', 'bottom', true);
          this.updateNode(this.tree.treeModel.getNodeById(node.data.parentId));
        } else {
          this.snackbar.openSnackbar('Xoá nhóm thất bại', 2000, 'Đóng', 'center', 'bottom', false);
        }
      }, (error) => {
        this.snackbar.openSnackbar('Xoá nhóm thất bại', 2000, 'Đóng', 'center', 'bottom', false);
      });
    }

    menuBar(keyword: string, node: any) {
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
        case 'Xóa nhóm': {
          let ref = this.modal.openDialog({message: 'Bạn có chắc chắn muốn xóa nhóm này?', confirm: 'Đồng ý', cancel: 'Hủy'});
          ref.subscribe(data => {
            if(data) {
              this.deleteGroup(node);
            }
          });
          return;
        }
      }
    }
}
