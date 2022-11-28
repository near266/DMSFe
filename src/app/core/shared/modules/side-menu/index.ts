import { SideMenuModule } from './side-menu.module';
import { MenuItem, MenuItemData } from './models/side-menu';
import { MenuItemType } from './models/side-menu';
import { SelectOption } from 'src/app/core/model/Select';
export { SideMenuModule, MenuItem, MenuItemType };

export const sideMenuItemHelpers = (
    label: string,
    type: MenuItemType,
    filterType: string,
    iconClass: string = '',
    data: MenuItemData<SelectOption> | null = null,
) =>
    ({
        label,
        type,
        iconClass,
        filterType,
        data,
    } as MenuItem<SelectOption>);
