export interface SidenavSettings {
    [key: string]: string | boolean | number | null | undefined;
}

export interface Pagination {
    page: number;
    pageSize: number;
}
