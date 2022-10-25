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
                title: 'Mã sản phẩm',
                leftIcon: 'fa-down-long text-[#0eaf8f]',
                value: { key: 'SKU', isAsc: true },
            },
            {
                title: 'Mã sản phẩm',
                leftIcon: 'fa-up-long text-[#0eaf8f]',
                value: { key: 'SKU', isAsc: false },
            },
            {
                title: 'Tên sản phẩm',
                leftIcon: 'fa-down-long text-[#0eaf8f]',
                value: { key: 'ProductName', isAsc: true },
            },
            {
                title: 'Tên sản phẩm',
                leftIcon: 'fa-up-long text-[#0eaf8f]',
                value: { key: 'ProductName', isAsc: false },
            },
            { title: 'Số thứ tự', leftIcon: 'fa-down-long text-[#0eaf8f]', value: { key: 'STT', isAsc: true } },
            { title: 'Số thứ tự', leftIcon: 'fa-up-long text-[#0eaf8f]', value: { key: 'STT', isAsc: false } },
        ],
    },
];
