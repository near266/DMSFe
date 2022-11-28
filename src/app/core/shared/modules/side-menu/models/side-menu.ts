import { Observable, of } from 'rxjs';
import { SelectOption } from 'src/app/core/model/Select';

export enum MenuItemType {
    USER,
    SELECT,
    SEARCH,
    DATE,
}
export interface MenuItem<T> {
    type: MenuItemType;
    label: string;
    iconClass: string;
    filterType: string;
    data: MenuItemData<T> | null;
}

export interface SelectOptionOutput extends SelectOption {
    filterType: string;
}

export interface MenuItemData<T> {
    placeholder: string;
    values$: Observable<T[]>;
}

export const defaultMenuItems = [
    {
        type: MenuItemType.SELECT,
        label: 'Nhân viên đặt',
        iconClass: 'fa-solid fa-user',
        filterType: 'oderdate',
        data: {
            placeholder: 'Tìm kiếm nhân viên',
            values$: of([
                {
                    label: 'Nguyễn Văn A',
                    value: '1',
                },
                {
                    label: 'Nguyễn Văn B',
                    value: '2',
                },
                {
                    label: 'Nguyễn Văn C',
                    value: '3',
                },
                {
                    label: 'Nguyễn Văn D',
                    value: '4',
                },
            ]),
        },
    },
    {
        type: MenuItemType.SEARCH,
        label: 'Nhân viên đặt',
        iconClass: 'fa-solid fa-user',
        filterType: 'oderdate',

        data: {
            placeholder: 'Tìm kiếm nhân viên',
            values$: of([
                {
                    label: 'Nguyễn Văn A',
                    value: '1',
                },
                {
                    label: 'Nguyễn Văn B',
                    value: '2',
                },
                {
                    label: 'Nguyễn Văn C',
                    value: '3',
                },
                {
                    label: 'Nguyễn Văn D',
                    value: '4',
                },
            ]),
        },
    },
    {
        type: MenuItemType.DATE,
        label: 'Nhân viên đặt',
        iconClass: 'fa-solid fa-user',
        filterType: 'orderDate',
        data: null,
    },
    {
        type: MenuItemType.SEARCH,
        label: 'Nhân viên đặt',
        filterType: 'oderdate',

        iconClass: 'fa-solid fa-user',
        data: {
            placeholder: 'Tìm kiếm nhân viên',
            values$: of([
                {
                    label: 'Nguyễn Văn A',
                    value: '1',
                },
                {
                    label: 'Nguyễn Văn B',
                    value: '2',
                },
                {
                    label: 'Nguyễn Văn C',
                    value: '3',
                },
                {
                    label: 'Nguyễn Văn D',
                    value: '4',
                },
            ]),
        },
    },
    {
        type: MenuItemType.SEARCH,
        label: 'Nhân viên đặt',
        filterType: 'oderdate',

        iconClass: 'fa-solid fa-user',
        data: {
            placeholder: 'Tìm kiếm nhân viên',
            values$: of([
                {
                    label: 'Nguyễn Văn A',
                    value: '1',
                },
                {
                    label: 'Nguyễn Văn B',
                    value: '2',
                },
                {
                    label: 'Nguyễn Văn C',
                    value: '3',
                },
                {
                    label: 'Nguyễn Văn D',
                    value: '4',
                },
            ]),
        },
    },
];
