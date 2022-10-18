import { Component, Input, OnInit } from '@angular/core';
import { ITreeOptions } from '@circlon/angular-tree-component';
import { EmployeeService } from 'src/app/core/services/employee.service';

@Component({
  selector: 'app-menu-collapse-tree',
  templateUrl: './menu-collapse-tree.component.html',
  styleUrls: ['./menu-collapse-tree.component.scss']
})
export class MenuCollapseTreeComponent implements OnInit {

  nodes: any[] = [];
    options: ITreeOptions = {
        useCheckbox: true,
        animateExpand: true,
    };
    settings: any = {};
    total: number;
    constructor(private employeeService: EmployeeService) {}

    ngOnInit(): void {
        this.employeeService.getTreeEmployee().subscribe((tree) => {
            console.log(tree);
            const newTree = { id: 'root', level: -1, name: 'Tất cả', children: [{}] };
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
            };
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
        console.log(e);
    }

}
