//  TODO: re-defince
export interface Pagination {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    startIndex: number;
    endIndex: number;
    startPage: number;
    endPage: number;
    pages: number[];
}

export const defaultPagination: Pagination = {
    currentPage: 1,
    pageSize: 30,
    totalItems: 0,
    totalPages: 0,
    startIndex: 0,
    endIndex: 0,
    startPage: 0,
    endPage: 0,
    pages: [],
};
