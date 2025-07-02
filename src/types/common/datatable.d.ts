import { ReactNode } from "react";

// Data Table Column Type
export type DataColumnType<T> =
  | {
      heading: string;
      icon?: string | ReactNode;
      width?: number;
      minWidth?: number;
    } & (
      | {
          customSelector: (templateData: T, index: number) => ReactNode;
          selector?: never;
          sortable?: boolean;
          sortableKey?: keyof T;
        }
      | {
          customSelector?: never;
          selector: keyof T;
          sortable?: boolean;
          sortableKey?: never;
        }
    );

// Type for Props Type of DataTable
export type DataTablePropsType<T> = {
  columns: DataColumnType<T>[];
  data: T[];

  loading?: boolean;
  loadingComponent?: ReactNode;
  noDataComponent?: ReactNode;

  pagination?: boolean;
  defaultPerPage?: number;
  defaultPerPageOptions?: number[];
  defaultPage?: number;

  selectableRows?: boolean;
  handleSelectedRowsChange?: (data: T[]) => void;
  highlightOnHover?: boolean;
};
// Type for Datatable Pagination
export type DataTablePaginationType = {
  perPage: number;
  pageNumber: number;
  totalItems: number;
  totalPages: number;
};
export type DataTableSelectedRowsType = {
  ids: number[];
  rows: T[];
};
export type DataTableSortedColumnType = {
  name: keyof T | null;
  ascend: boolean;
};
