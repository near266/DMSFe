import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Title } from '@angular/platform-browser';
import { Response } from 'src/app/core/model/Response';
import { Route } from 'src/app/core/model/Route';
import { RouteService } from 'src/app/core/services/route.service';
import { AddRouterComponent } from './add-router/add-router.component';

@Component({
    selector: 'app-route',
    templateUrl: './route.component.html',
    styleUrls: ['./route.component.scss'],
})
export class RouteComponent implements OnInit, AfterViewInit {

  page = 1;
  totalCount = 0;
  response: Response<Route> = {
    data: [],
    totalCount: 0
  };
  isRole:any = localStorage.getItem('role')

  constructor(private title: Title, private dialog: MatDialog, private routeService: RouteService, public datePipe: DatePipe) {}


  // MatPaginator Inputs
  length:number;
  pageSize = 30;

  // pageSizeOptions: number[] = [5, 10, 25, 100];

  // MatPaginator Output
  pageEvent: PageEvent;
  // firstPageLabel = $localize`First page`;
  // itemsPerPageLabel = $localize`Items per page:`;
  // lastPageLabel = $localize`Last page`;

  // You can set labels to an arbitrary string too, or dynamically compute
  // it through other third-party internationalization libraries.
  nextPageLabel = 'Next page';
  previousPageLabel = 'Previous page';


  ngOnInit(): void {
    this.title.setTitle('Quản lý tuyến');
    this.checkIsRole();
  }
  ngAfterViewInit(): void {
    this.init(this.page);
  }

  init(page:any) {
    this.routeService.SearchAllRoute(page, this.pageSize).subscribe( data => {
      // console.log(data);
      this.length = data.totalCount
      this.response = data;
    });
  }

  closeSideBar() {
      this.class = {
          left: 'w-5',
          right: 'w-full',
          statusbar: false,
      };
  }

  openSideBar() {
      this.class = {
          left: 'w-1/5',
          right: 'w-4/5',
          statusbar: true,
      };
  }

  class = {
      left: 'w-1/5',
      right: 'w-4/5',
      statusbar: true,
  };

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
                              tree: null,
                          },
                      ],
                  },
                  {
                      level: 3,

                      name: 'level3+2',
                      tree: [
                          {
                              level: 4,
                              name: 'level4',
                              tree: null,
                          },
                      ],
                  },
                  {
                      level: 3,
                      name: 'level3+3',
                      tree: [
                          {
                              level: 4,
                              name: 'level4',
                              tree: null,
                          },
                      ],
                  },
              ],
          },
          {
              level: 2,
              name: 'level2.2',
              tree: [
                  {
                      level: 3,
                      name: 'level3.2',
                      tree: [
                          {
                              level: 4,
                              name: 'level4.2',
                              tree: null,
                          },
                      ],
                  },
              ],
          },
      ],
  };

  listMenuObj = [
      {
          title: 'Lọc',
          leftTitleIcon: 'fa-filter',
          listMenuPosition: [
              { title: 'Tất cả', leftIcon: 'fa-check text-emerald-500', value: 'all' },
              { title: 'Tuyến hoạt động', leftIcon: 'fa-shuffle text-emerald-500', value: 'emp' },
              { title: 'Tuyến không hoạt động', leftIcon: 'fa-trash text-emerald-500', value: 'emp-basic' },
          ],
      },
      {
          title: 'Lọc ngày',
          leftTitleIcon: 'fa-filter',
          listMenuPosition: [
              { title: 'Tất cả', leftIcon: 'fa-check text-emerald-500', value: 'all' },
              { title: 'Không giới hạn', leftIcon: 'fa-shuffle text-emerald-500', value: 'emp' },
              { title: 'Thứ 2', leftIcon: 'fa-shuffle text-emerald-500', value: 'emp' },
              { title: 'Thứ 3', leftIcon: 'fa-shuffle text-emerald-500', value: 'emp' },
              { title: 'Thứ 4', leftIcon: 'fa-shuffle text-emerald-500', value: 'emp' },
              { title: 'Thứ 5', leftIcon: 'fa-shuffle text-emerald-500', value: 'emp' },
              { title: 'Thứ 6', leftIcon: 'fa-shuffle text-emerald-500', value: 'emp' },
              { title: 'Thứ 7', leftIcon: 'fa-shuffle text-emerald-500', value: 'emp' },
              { title: 'Chủ nhật', leftIcon: 'fa-shuffle text-emerald-500', value: 'emp' },
          ],
      },
      {
          title: 'Sắp xếp',
          leftTitleIcon: 'fa-sort-alpha-asc',
          listMenuPosition: [
              { title: 'Tên tuyến', leftIcon: 'fa-arrow-up text-emerald-500', value: 'all' },
              { title: 'Mã tuyến', leftIcon: 'fa-arrow-down text-emerald-500', value: 'all' },
              { title: 'Mã tuyến', leftIcon: 'fa-arrow-up text-emerald-500', value: 'all' },
          ],
      },
  ];
  listMenuObj2 = [
      {
          title: 'Xuất dữ liệu',
          leftTitleIcon: 'fa-download',
          listMenuPosition: [
              { title: 'Được chọn', leftIcon: 'fa-check text-emerald-500', value: 'all' },
              { title: 'Theo điều kiện tuần', leftIcon: 'fa-filter text-emerald-500', value: 'act' },
          ],
      },
      {
          title: 'Quản trị',
          leftTitleIcon: 'fa-lock',
          listMenuPosition: [
              { title: 'Khóa nhiều', leftIcon: 'fa-lock text-emerald-500', value: 'all' },
              { title: 'Mở khóa nhiều', leftIcon: 'fa-unlock text-emerald-500', value: 'all' },
              { title: 'Xóa nhiều', leftIcon: 'fa-trash text-emerald-500', value: 'all' },
              { title: 'Nhật ký nhập dữ liệu', leftIcon: 'fa-clock-rotate-left text-emerald-500', value: 'all' },
          ],
      },
  ];
  Select(e: any) {
      console.log(e);
  }
  routes = [
      {
          id: 1,
          img: 'https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2021/5/26/913299/Ngan-Ha25.jpg',
          status: 'Hoạt động',
          email: 'zxcvbnm@gmail.com',
          code: 'NV_01',
          fullname: 'Hoàng Văn Tú',
          gender: 'Nam',
          pos: '',
          phone: '098765432',
          add: 'Hà Nội',
          ver: '3.2.1',
          lastModifed: '2022-01-01T12:01:01.234Z',
          lastAsync: '2022-01-01T12:01:01.234Z',
      },
  ];

  openAddRoute() {
    const dialogRef = this.dialog.open(AddRouterComponent, {
      height: '95vh',
      minWidth: '900px',data: {
        "type": "add"
      }
    });
  }


  openDetailRoute(id: any) {
    const dialogRef = this.dialog.open(AddRouterComponent, {
      height: '95vh',
      minWidth: '50%',
      data: {
        "id": id,
        "type": "update"
      }
    });
  }

  changePage(event: any){
    console.log(event);
    this.init((event.pageIndex + 1).toString())
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
  console.log(setPageSizeOptionsInput);
  console.log("A");

    if (setPageSizeOptionsInput) {
    //  this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }
  };
  checkIsRole(){
    if(this.isRole.includes('MANAGER') || this.isRole.includes('SALE_ADMIN')){
      return true;
    }else{
      return false;
    }
    return;
  }
}
