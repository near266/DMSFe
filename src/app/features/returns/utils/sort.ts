// export const sortList = [
//     { title: 'Mã sản phẩm', type: 'SKU' },
//     { title: 'Tên sản phẩm', type: 'productName' },
//     { title: 'Số thứ tự', type: 'index' },
// ];

export const sortList = [
    {
        title: 'Sắp xếp',
        leftTitleIcon: 'fa-sort',
        listMenuPosition: [
            {
                title: 'Ngày tạo',
                leftIcon: 'fa-down-long text-[#0eaf8f]',
                value: { key: 'CreatedDate', isAsc: false },
            },
            {
                title: 'Ngày tạo',
                leftIcon: 'fa-up-long text-[#0eaf8f]',
                value: { key: 'CreatedDate', isAsc: true },
            },
            {
                title: 'Mã đơn trả',
                leftIcon: 'fa-down-long text-[#0eaf8f]',
                value: { key: 'ReturnCode', isAsc: false },
            },
            {
                title: 'Mã đơn trả',
                leftIcon: 'fa-up-long text-[#0eaf8f]',
                value: { key: 'ReturnCode', isAsc: true },
            },
        ],
    },
];

export const timeSortList = [
    {
        title: 'Lọc thời gian',
        leftTitleIcon: 'fa-sort',
        listMenuPosition: [
            {
                title: 'Ngày tạo',
                leftIcon: 'fa-down-long text-[#0eaf8f]',
                value: { key: 'CreatedDate', value: 1 },
            },
            {
                title: 'Ngày sửa',
                leftIcon: 'fa-up-long text-[#0eaf8f]',
                value: { key: 'ModifiedDate', value: 2 },
            },
            {
                title: 'Ngày trả hàng',
                leftIcon: 'fa-down-long text-[#0eaf8f]',
                value: { key: 'ReturnDate', value: 3 },
            },
            {
                title: 'Ngày đặt hàng',
                leftIcon: 'fa-up-long text-[#0eaf8f]',
                value: { key: 'OrderDate', value: 4 },
            },
        ],
    },
];
