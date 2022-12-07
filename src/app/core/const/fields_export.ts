export interface TypeExport {
  key: string;
  value: string;
}

export const CustomerFields: TypeExport[] = [
  {
    key: 'ID (_id)',
    value: 'Id'
  },
  {
    key: 'Khách hàng (khach_hang)',
    value: 'CustomerName'
  },
  {
    key: 'Mã khách hàng (ma_khach_hang)',
    value: 'CustomerCode'
  },
  // {
  //   key: '',
  //   value: 'CreatedDate'
  // },
  // {
  //   key: '',
  //   value: 'CreatedBy'
  // },
  // {
  //   key: '',
  //   value: 'LastModifiedDate'
  // },
  // {
  //   key: '',
  //   value: 'LastModifiedBy'
  // },
  // {
  //   key: '',
  //   value: 'Ngaythuthap'
  // },
  {
    key: 'Kinh độ (long)',
    value: 'Longitude'
  },
  {
    key: 'Vĩ độ (lat)',
    value: 'Latitude'
  },
  // {
  //   key: '',
  //   value: 'Status'
  // },
  // {
  //   key: '',
  //   value: 'CustomerGroupCode'
  // },
  {
    key: 'Nhóm khách hàng (nhom_khach_hang)',
    value: 'CustomerGroupName'
  },
  // {
  //   key: '',
  //   value: 'CustomerTypeCode'
  // },
  {
    key: 'Loại khách hàng (loai_khach_hang)',
    value: 'CustomerTypeName'
  },
  {
    key: 'Địa chỉ (dia_chi)',
    value: 'Address'
  },
  {
    key: 'Địa chỉ giao hàng (dia_chi_giao_hang)',
    value: 'DeliveryAddress'
  },
  // {
  //   key: '',
  //   value: 'AreaCode'
  // },
  {
    key: 'Khu vực (khu_vuc)',
    value: 'AreaName'
  },
  {
    key: 'Người liên hệ (nguoi_lien_he)',
    value: 'ContactName'
  },
  {
    key: 'Chức vụ (chuc_vu)',
    value: 'Position'
  },
  {
    key: 'SĐT (sdt)',
    value: 'Phone'
  },
  {
    key: 'Email (email)',
    value: 'Email'
  },
  {
    key: 'Hình ảnh (hinh_anh)',
    value: 'Avatar'
  },
  {
    key: 'Hạn mức công nợ (han_muc_cong_no)',
    value: 'DebtLimit'
  },
  {
    key: 'Mã nhóm tuyến (route_groupc)',
    value: 'GroupCode'
  },
  {
    key: 'Tên nhóm tuyến (route_group)',
    value: 'GroupName'
  },
  {
    key: 'Mã nhân viên (route_eecode)',
    value: 'EmployeeCode'
  },
  {
    key: 'Tên nhân viên tuyến (route_ee)',
    value: 'EmployeeName'
  },
  {
    key: 'Mã giám sát (route_sscode)',
    value: 'RouteCode'
  },
  {
    key: 'Tên giám sát (route_ss)',
    value: 'RouteName'
  },
  // {
  //   key: 'Thứ tuyến (route_day)',
  //   value: 'RouteDay'
  // },
  {
    key: 'Cấm sửa vị trí (lock_location)',
    value: 'IsUpdateLocation'
  },
  {
    key: 'Khóa (archive)',
    value: 'Archived'
  }
]