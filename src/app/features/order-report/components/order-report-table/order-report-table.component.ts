import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RootOrderReport } from '../../models/order-report';

@Component({
  selector: 'app-order-report-table',
  templateUrl: './order-report-table.component.html',
  styleUrls: ['./order-report-table.component.scss']
})
export class OrderReportTableComponent implements OnInit {

  @Input() dataOrderReport:RootOrderReport = new RootOrderReport;

  constructor(
    private router: Router,
  ) { }
  arrayHeader = [
    'STT',
    'Mã nhân viên',
    'Tên nhân viên',
    'Phòng nhóm',
    'Nguồn',
    'Mã đơn đặt',
    'Ngày đơn đặt hàng',
    'Mã khách',
    'Tên khách',
    'Số lần bán',
    'Số lần trả',
    'Địa chỉ',
    'Khu vực',
    'Kênh',
    'Nhóm khách',
    'Loại khách',
    'Mã sản phẩm',
    'Tên sản phẩm',
    'Mã kho',
    'Tên kho',
    'Ghi chú sp',
    'Ngành hàng',
    'Nhãn hiệu',
    'Số lượng đặt',
    'Tên CTKM',
    'Số lượng KM',
    'ĐVT',
    'Đơn giá',
    'VAT',
    'Thành tiền (SL đặt x giá)',
    'Tiền VAT (từng SP)',
    'Chiết khấu(%) (từng SP)',
    'Tiền chiết khấu (từng SP)',
    'Thành tiền (tổng bill)',
    'Tiền VAT (tổng bill)',
    'Chiết khấu(%) (tổng bill)',
    'Tiền chiết khấu (tổng bill)',
    'Thanh toán',
    'Doanh thu (-VAT)',
    'Diễn giải',
    'Lô',
    'Hạn sử dụng'
  ]
  ngOnInit(): void {
    console.log(this.dataOrderReport);
  }
  navigateToDetail(order: any) {
    localStorage.setItem('purchaseOrderId', order.orderCode);
    // this.router.navigate(['/orders/detailOrder/viewEdit']);
    this.router.navigate(['/orders/detailOrder/view?edit'], { queryParams: { id: order.purchaseOrderId }, queryParamsHandling: null });
}

}
