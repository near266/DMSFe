import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { EmployeeInGroup } from 'src/app/core/model/Employee';
import { Response } from 'src/app/core/model/Response';
import { Employee } from 'src/app/core/model/Route';
import { EmployeeService } from 'src/app/core/services/employee.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { WarehousesService } from 'src/app/core/services/warehouses.service';
import { IBodySearch } from '../models/BodySearch';
import { UnitGroup } from '../models/unitGroup';
import { Warehouse } from '../models/warehouse';

@Injectable({
  providedIn: 'root'
})
export class LogicService {

  private readonly defaultWarehouses: Warehouse[] = [];
  private readonly defaultBodySearch: IBodySearch = {
    keyword: null,
    status: null
  }
  private readonly defaultListEmployee: EmployeeInGroup[] = [];
  private readonly defaultListUnitGroup: UnitGroup[] = [];
  private readonly defaultWarehouse: Warehouse = {
      id: '',
      warehouseName: '',
      warehouseCode: '',
      warehouseType: '',
      status: false,
      description: '',
      responsibleAccountant: '',
      createdBy: '',
      createdDate: '',
      lastModifiedBy: '',
      lastModifiedDate: ''
  };

  private unitGroup: BehaviorSubject<UnitGroup[]> = new BehaviorSubject<UnitGroup[]>(this.defaultListUnitGroup);
  private warehouses: BehaviorSubject<Warehouse[]> = new BehaviorSubject<Warehouse[]>(this.defaultWarehouses);
  private detailWarehouse: BehaviorSubject<Warehouse> = new BehaviorSubject<Warehouse>(this.defaultWarehouse);
  private totalCountWarehouse: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private employee: BehaviorSubject<EmployeeInGroup[]> = new BehaviorSubject<EmployeeInGroup[]>(this.defaultListEmployee);
  private accountant: BehaviorSubject<EmployeeInGroup[]> = new BehaviorSubject<EmployeeInGroup[]>(this.defaultListEmployee);
  public message: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public isUpdateSuccess: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public unitGroup$ = this.unitGroup.asObservable();
  public warehouses$ = this.warehouses.asObservable();
  public employee$ = this.employee.asObservable();
  public accountant$ = this.accountant.asObservable();
  public message$ = this.message.asObservable();
  public isUpdateSuccess$ = this.isUpdateSuccess.asObservable();
  public detailWarehouse$ = this.detailWarehouse.asObservable();
  public totalCountWarehouse$ = this.totalCountWarehouse.asObservable();

  public bodySearch: IBodySearch = this.defaultBodySearch;

  constructor(
    private employeeService: EmployeeService,
    private warehouse: WarehousesService,
    public snackbar: SnackbarService
    ) { }

  getAllWareHouse() {
    const body: IBodySearch = {
      keyword: null,
      status: null
    }
    this.bodySearch = body;
    let subscription = this.warehouse.search(body).subscribe((response: Warehouse[]) => {
      if(response) {
        this.warehouses.next(response);
        this.totalCountWarehouse.next(response.length);
      } else {
        this.snackbar.openSnackbar('Không thể tải danh sách kho hàng', 2000, 'Đóng', 'center', 'bottom', false);
      }
      subscription.unsubscribe();
    }, (error) => {
      this.snackbar.openSnackbar('Không thể tải danh sách kho hàng', 2000, 'Đóng', 'center', 'bottom', false);
      subscription.unsubscribe();
    });
  }

  searchWarehouse(body: IBodySearch) {
    if(body.keyword) {
      body.keyword = body.keyword.trim();
    }
    let subscription = this.warehouse.search(body).subscribe((response: Warehouse[]) => {
      if(response) {
        this.warehouses.next(response);
        this.totalCountWarehouse.next(response.length);
      } else {
        this.snackbar.openSnackbar('Không thể tải danh sách kho hàng', 2000, 'Đóng', 'center', 'bottom', false);
      }
      subscription.unsubscribe();
    }, (error) => {
      this.snackbar.openSnackbar('Không thể tải danh sách kho hàng', 2000, 'Đóng', 'center', 'bottom', false);
      subscription.unsubscribe();
    });
  }

  deleteWareHouse(list: string[]) {
    const body = {
      id: list
    };
    let sub = this.warehouse.deleteWareHouse(body).subscribe(data => {
      if(data) {
        if(data.message > 0) {
          this.snackbar.openSnackbar('Xóa kho hàng thành công', 2000, 'Đóng', 'center', 'bottom', true);
          this.searchWarehouse(this.bodySearch);
        } else {
          this.snackbar.openSnackbar('Xóa kho hàng thất bại', 2000, 'Đóng', 'center', 'bottom', false);
        }
      } else {
        this.snackbar.openSnackbar('Xóa kho hàng thất bại', 2000, 'Đóng', 'center', 'bottom', false);
      }
      sub.unsubscribe();
    }, (error) => {
      this.snackbar.openSnackbar('Xóa kho hàng thất bại', 2000, 'Đóng', 'center', 'bottom', false);
      sub.unsubscribe();
    });
  }

  getAccountant(id: string) {
    this.accountant.next([]);
    if (id == 'root') {
        let sub = this.employeeService.GetAllEmployeePost('Kế toán', 1, 100).subscribe( (data: Response<Employee>) => {
            if(data) {
                let listEmployee: EmployeeInGroup[] = [];
                data.data.forEach( e => {
                    let newEmployees: EmployeeInGroup = new EmployeeInGroup;
                    newEmployees.employee = e;
                    listEmployee.push(newEmployees);
                });
                this.accountant.next(listEmployee);

            } else {
                this.snackbar.openSnackbar('Không thể tải danh sách kế toán', 2000, 'Đóng', 'center', 'bottom', false);
            }
            sub.unsubscribe();
        }, (error) => {
            this.snackbar.openSnackbar('Không thể tải danh sách kế toán', 2000, 'Đóng', 'center', 'bottom', false);
            sub.unsubscribe();
        });
    } else {
        let sub = this.employeeService.SearchEmployeeInGroupPost('Kế toán', id, 1, 100).subscribe( (data: Response<EmployeeInGroup>) => {
            if (data) {
                this.accountant.next(data.data);
                console.log(this.accountant);
            } else {
                this.snackbar.openSnackbar('Không thể tải danh sách kế toán', 2000, 'Đóng', 'center', 'bottom', false);
            }
            sub.unsubscribe();
        }, (error) => {
            this.snackbar.openSnackbar('Không thể tải danh sách kế toán', 2000, 'Đóng', 'center', 'bottom', false);
            sub.unsubscribe();
        });
    }
  }

  getEmployee(id: string) {
    this.employee.next([]);
    if (id == 'root') {
        let sub = this.employeeService.GetAllEmployeePost('Nhân viên', 1, 100).subscribe( (data: Response<Employee>) => {
            if(data) {
                let listEmployee: EmployeeInGroup[] = [];
                data.data.forEach( e => {
                    let newEmployees: EmployeeInGroup = new EmployeeInGroup;
                    newEmployees.employee = e;
                    listEmployee.push(newEmployees);
                });
                this.employee.next(listEmployee);
            } else {
                this.snackbar.openSnackbar('Không thể tải danh sách nhân viên', 2000, 'Đóng', 'center', 'bottom', false);
            }
            sub.unsubscribe();
        }, (error) => {
            this.snackbar.openSnackbar('Không thể tải danh sách nhân viên', 2000, 'Đóng', 'center', 'bottom', false);
            sub.unsubscribe();
        });
    } else {
        let sub = this.employeeService.SearchEmployeeInGroupPost('Nhân viên', id, 1, 100).subscribe( (data: Response<EmployeeInGroup>) => {
            if (data) {
                this.employee.next(data.data);
            } else {
                this.snackbar.openSnackbar('Không thể tải danh sách nhân viên', 2000, 'Đóng', 'center', 'bottom', false);
            }
            sub.unsubscribe();
        }, (error) => {
            this.snackbar.openSnackbar('Không thể tải danh sách nhân viên', 2000, 'Đóng', 'center', 'bottom', false);
            sub.unsubscribe();
        });
    }
  }

  getUnitGroup() {
    this.unitGroup.next([]);
    let sub = this.employeeService.GetAllGroupByType(1).subscribe( data => {
        if(data) {
            this.unitGroup.next(data);
        } else {
            this.snackbar.openSnackbar('Không thể tìm danh sách nhóm', 2000, 'Đóng', 'center', 'bottom', false);
        }
        sub.unsubscribe();
    }, (error) => {
        this.snackbar.openSnackbar('Không thể tìm danh sách nhóm', 2000, 'Đóng', 'center', 'bottom', false);
        sub.unsubscribe();
    });
  }

  addWarehouse(body: any) {
    let sub = this.warehouse.addWareHouse(body).subscribe( data => {
        if(data && data.message == 1) {
            this.snackbar.openSnackbar('Thêm kho hàng thành công', 2000, 'Đóng', 'center', 'bottom', true);
            this.message.next(true);
        } else {
            this.snackbar.openSnackbar('Thêm kho hàng thất bại', 2000, 'Đóng', 'center', 'bottom', false);
            this.message.next(false);
        }
        sub.unsubscribe();
    }, (error) => {
        this.snackbar.openSnackbar('Thêm kho hàng thất bại', 2000, 'Đóng', 'center', 'bottom', false);
        this.message.next(false);
        sub.unsubscribe();
    });
  }

  updateWarehouse(body: any) {
    let sub = this.warehouse.updateWareHouse(body).subscribe( data => {
        if(data && data.message == 1) {
            this.snackbar.openSnackbar('Cập nhật kho hàng thành công', 2000, 'Đóng', 'center', 'bottom', true);
            this.isUpdateSuccess.next(true);
        } else {
            this.snackbar.openSnackbar('Cập nhật kho hàng thất bại', 2000, 'Đóng', 'center', 'bottom', false);
            this.isUpdateSuccess.next(false);
        }
        sub.unsubscribe();
    }, (error) => {
        this.snackbar.openSnackbar('Cập nhật kho hàng thất bại', 2000, 'Đóng', 'center', 'bottom', false);
        this.isUpdateSuccess.next(false);
        sub.unsubscribe();
    });
  }

  getWarehouse(id: string) {
    let sub = this.warehouse.getWareHouseById(id).subscribe(data => {
        if(data) {
            this.detailWarehouse.next(data);
        } else {
            this.snackbar.openSnackbar('Không tìm thấy thông tin kho hàng', 2000, 'Đóng', 'center', 'bottom', false);
        }
        sub.unsubscribe();
    }, (error) => {
        this.snackbar.openSnackbar('Không tìm thấy thông tin kho hàng', 2000, 'Đóng', 'center', 'bottom', false);
        sub.unsubscribe();
    });
  }
}
