import {
  memo,
  useEffect,
  useRef,
  useState,
  useTransition,
  type ReactNode,
} from "react";
import ChevronDoubleLeftIcon from "../../assets/ChevronDoubleLeftIcon";
import ChevronDoubleRightIcon from "../../assets/ChevronDoubleRightIcon";
import ChevronLeftIcon from "../../assets/ChevronLeftIcon";
import ChevronRightIcon from "../../assets/ChevronRightIcon";
import "../../css/common/datatable.css";
import type {
  DataTablePaginationType,
  DataTablePropsType,
  DataTableSelectedRowsType,
  DataTableSortedColumnType,
} from "../../types/common/datatable";
import { kindOf } from "../../utils/utility";

const defaultDataTableStyles = {
  tableWrapper: {
    borderRadius: "var(--tableWrapperRadius)",
    border: "1px solid var(--grayWhiteColor)",
    padding: "var(--tableWrapperPadding)",
    background: "var(--backgroundColor)",
  },
  tableHead: {
    background: "var(--tableHeadBg)",
    padding: "var(--tableHeadPadding)",
    color: "var(--tableHeadColor)",
    fill: "var(--tableHeadColor)",
    height: "var(--tableHeadHeight)",
  },
  tableRows: {
    background: "var(--tableRowBg)",
    padding: "var(--tableRowPadding)",
    border: "1px solid var(--grayWhiteColor)",
    height: "var(--tableRowHeight)",
  },
  tablePagination: {},
  headCell: {
    background: "var(--tableHeadBg)",
    padding: "var(--tableHeadPadding)",
  },
};

function DataTable<T>(props: DataTablePropsType<T>) {
  const {
    columns,
    data = [],

    selectableRows,
    handleSelectedRowsChange,
    highlightOnHover,

    pagination,
    defaultPerPage,
    defaultPerPageOptions,
    defaultPage,

    loading,
    loadingComponent,
    noDataComponent,
  } = props;
  const { tableHead, tableRows } = {
    ...defaultDataTableStyles,
  };

  // Pagination Options for handling pagination based on props passed
  const [paginationOptions, setPaginationOptions] =
    useState<DataTablePaginationType>({
      perPage: pagination
        ? defaultPerPage ?? defaultPerPageOptions
          ? defaultPerPageOptions?.[0] ?? 5
          : 10
        : data.length,
      pageNumber: defaultPage ?? 1,
      totalItems: data.length,
      totalPages: Math.ceil(
        data.length /
          (pagination
            ? defaultPerPage ?? defaultPerPageOptions
              ? defaultPerPageOptions?.[0] ?? 5
              : 10
            : data.length)
      ),
    });
  // Selected rowed state
  const [selectedRows, setSelectedRows] = useState<DataTableSelectedRowsType>({
    ids: [],
    rows: [],
  });
  const [tableData, setTableData] = useState<T[]>(data ?? []);
  const [sortedColumn, setSortedColumn] = useState<DataTableSortedColumnType>({
    name: null,
    ascend: true,
  });
  const startTransition = useTransition()[1];

  // Start Index and End Index for slicing the whole data based on pagination
  const paginationStartIndex =
    (paginationOptions.pageNumber - 1) * paginationOptions.perPage;
  const paginationEndIndex = Math.min(
    paginationOptions.pageNumber * paginationOptions.perPage,
    data.length
  );
  const isEmptyData = data.length === 0; // for checking is empty or not
  const defaultPerPageOptionsRef = useRef(defaultPerPageOptions);

  // Function for selecting all data at once
  const handleSelectedAllClick = () => {
    setSelectedRows((prev) => {
      const isSelected = prev.ids.length === data.length;
      if (
        handleSelectedRowsChange &&
        kindOf(handleSelectedRowsChange, "function")
      )
        handleSelectedRowsChange(isSelected ? [] : data);

      return {
        ids: isSelected ? [] : data.map((_, index) => index),
        rows: isSelected ? [] : data,
      };
    });
  };
  // Handling of single row data selected (vice-versa)
  const handleSelectedRowClick = (index: number) => {
    setSelectedRows((prev) => {
      let ids = prev.ids;
      if (ids.includes(index)) {
        ids = ids.filter((i) => i !== index);
      } else ids = [...ids, index];
      const rows = data.filter((_, i) => ids.includes(i));

      if (
        handleSelectedRowsChange &&
        kindOf(handleSelectedRowsChange, "function")
      )
        handleSelectedRowsChange(rows);
      return {
        ids,
        rows,
      };
    });
  };
  // Function for change per page options
  const handlePerPageChange = (value: number) => {
    const { perPage, pageNumber, totalItems } = paginationOptions;
    const totalPages = Math.ceil(totalItems / perPage);
    setPaginationOptions((prev) => ({
      ...prev,
      perPage: value,
      pageNumber: Math.min(totalPages, pageNumber),
      totalPages: Math.ceil(
        data.length /
          (pagination
            ? defaultPerPage ?? defaultPerPageOptions
              ? defaultPerPageOptions?.[0] ?? 5
              : 10
            : data.length)
      ),
    }));
  };
  // Function for change page
  const handlePageChange = (value: number) => {
    setPaginationOptions((prev) => ({ ...prev, pageNumber: value }));
  };
  // Function for sorting the column based on type (like at-first ascending then descending then toggling)
  const handleHeaderClick = (name: keyof T | undefined) => {
    if (!name || loading || isEmptyData) return;
    let ascending = true;
    if (sortedColumn.name === name) {
      ascending = !sortedColumn.ascend;
    }

    startTransition(() => {
      setTableData((prev) =>
        prev.sort((a, b) => {
          if (ascending) {
            return a[name] > b[name] ? 1 : -1;
          } else {
            return a[name] < b[name] ? 1 : -1;
          }
        })
      );
      setSortedColumn({ name, ascend: ascending });
    });
  };

  useEffect(() => {
    const defaultPerPageOptions = defaultPerPageOptionsRef.current;
    if (loading || data.length === 0) {
      setTableData([]);
      setSortedColumn({ name: null, ascend: true });
      setPaginationOptions({
        perPage: pagination
          ? defaultPerPage ?? defaultPerPageOptions
            ? defaultPerPageOptions?.[0] ?? 5
            : 10
          : data.length,
        pageNumber: defaultPage ?? 1,
        totalItems: data.length,
        totalPages: Math.ceil(
          data.length /
            (pagination
              ? defaultPerPage ?? defaultPerPageOptions
                ? defaultPerPageOptions?.[0] ?? 5
                : 10
              : data.length)
        ),
      });
    }
    if (!loading && data.length > 0 && Array.isArray(data)) {
      setTableData(data);
      setPaginationOptions({
        perPage: pagination
          ? defaultPerPage ?? defaultPerPageOptions
            ? defaultPerPageOptions?.[0] ?? 5
            : 10
          : data.length,
        pageNumber: defaultPage ?? 1,
        totalItems: data.length,
        totalPages: Math.ceil(
          data.length /
            (pagination
              ? defaultPerPage ?? defaultPerPageOptions
                ? defaultPerPageOptions?.[0] ?? 5
                : 10
              : data.length)
        ),
      });
    }
  }, [loading, data, data.length, defaultPerPage, defaultPage, pagination]);

  return (
    <div className="dataTableContainer overflowStyle h-full overflow-auto">
      <div
        className="flex flex-col items-start h-full overflow-auto"
        style={{
          overflow: "auto",
        }}
      >
        {/* Table Head Cells */}
        <div
          className="tableHeadCells | flex gap-0 w-full"
          style={{
            borderBottom: tableRows.border,
          }}
        >
          {selectableRows && !isEmptyData && (
            <div
              className="headCell | flex justify-start"
              style={{
                minWidth: 20,
                padding: tableHead.padding,
                background: tableHead.background,
                height: tableHead.height,
              }}
            >
              <input
                type="checkbox"
                checked={selectedRows.ids.length === data.length}
                onChange={handleSelectedAllClick}
              />
            </div>
          )}
          {columns.map((column, index) => {
            return (
              <div
                key={column.heading + index}
                className="headCell | flex justify-between cursor-pointer gap-3"
                style={{
                  flex: "1 0 0",
                  ...(column.width || column.minWidth
                    ? {
                        minWidth: column.minWidth ?? column.width,
                        width: column.width,
                        maxWidth: column.width,
                      }
                    : { minWidth: 80 }),
                  ...(column.sortable && column.selector
                    ? {
                        cursor: "pointer",
                      }
                    : {}),
                  padding: tableHead.padding,
                  background: tableHead.background,
                  height: tableHead.height,
                }}
                {...(column.sortable
                  ? {
                      onClick: () =>
                        handleHeaderClick(
                          column.selector ?? column.sortableKey
                        ),
                    }
                  : {})}
              >
                <div className="flex gap-3">
                  {column.icon && column.icon}
                  <p className="">{column.heading}</p>
                </div>
                <span
                  style={{
                    fontSize: "var(--fs10)",
                    fontWeight: 500,
                  }}
                >
                  {(sortedColumn.name === column.selector ||
                    sortedColumn.name === column.sortableKey) &&
                    sortedColumn.ascend !== null &&
                    (sortedColumn.ascend ? "A" : "D")}
                </span>
              </div>
            );
          })}
        </div>
        {/* Table Body Row Cells */}
        <div className="tableRowsCell | flex flex-col justify-start items-start gap-0 w-full grow overflow-auto">
          {loading
            ? loadingComponent ?? <p>Loading Data...</p>
            : isEmptyData
            ? noDataComponent ?? <p>No Data Found</p>
            : tableData
                .slice(paginationStartIndex, paginationEndIndex)
                .map((row, rowIndex) => (
                  <div
                    key={rowIndex}
                    className={
                      "tableRow | w-full flex" +
                      (highlightOnHover ? " highlight" : "")
                    }
                    style={{
                      alignContent: "stretch",
                      height: "auto",
                      background: tableRows.background,
                    }}
                  >
                    {selectableRows && !isEmptyData && (
                      <div
                        className="rowCell | flex justify-start gap-3"
                        style={{
                          minWidth: 36,
                          padding: tableRows.padding,
                          borderTop: tableRows.border,
                          ...(rowIndex === data.length - 1
                            ? {
                                borderBottom: tableRows.border,
                              }
                            : {}),
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={selectedRows.ids.includes(
                            rowIndex + paginationStartIndex
                          )}
                          onChange={() =>
                            handleSelectedRowClick(
                              rowIndex + paginationStartIndex
                            )
                          }
                        />
                      </div>
                    )}
                    {columns.map((column) => (
                      <div
                        key={column.heading}
                        className="rowCell | cursor-pointer flex justify-start items-center gap-3"
                        style={{
                          flex: "1 0 0",
                          padding: tableRows.padding,
                          borderTop: tableRows.border,
                          minHeight: tableRows.height ?? "5rem",
                          ...(column.width || column.minWidth
                            ? {
                                minWidth: column.minWidth ?? column.width,
                                width: column.width,
                                maxWidth: column.width,
                              }
                            : { minWidth: 80 }),
                          ...(rowIndex === data.length - 1
                            ? {
                                borderBottom: tableRows.border,
                              }
                            : {}),
                          overflow: "hidden",
                        }}
                      >
                        {column.selector ? (
                          <p style={{ alignSelf: "center" }}>
                            {(row[column.selector] as ReactNode) ?? "-"}
                          </p>
                        ) : column.customSelector &&
                          kindOf(column.customSelector, "function") ? (
                          column.customSelector(row, rowIndex)
                        ) : (
                          <p>-</p>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
        </div>
        {/* Table Pagination component */}
        {!loading && pagination && !isEmptyData && (
          <div
            className="tablePagination | w-full flex justify-end items-center gap-10"
            style={{
              padding: "var(--tablePaginationPadding)",
            }}
          >
            <div className="flex gap-3">
              <select
                value={paginationOptions.perPage}
                onChange={(e) => {
                  handlePerPageChange(+e.target.value);
                }}
              >
                {(defaultPerPageOptions ?? [5, 10, 20, 30, 40, 50]).map(
                  (pageOptions) => (
                    <option key={pageOptions} value={pageOptions}>
                      {pageOptions}
                    </option>
                  )
                )}
              </select>
            </div>
            <p>
              {paginationStartIndex + 1}-{paginationEndIndex} of {data.length}
            </p>
            <div className="flex gap-3">
              <button
                disabled={paginationOptions.pageNumber === 1}
                onClick={() => handlePageChange(1)}
              >
                <ChevronDoubleLeftIcon />
              </button>
              <button
                disabled={paginationOptions.pageNumber === 1}
                onClick={() =>
                  handlePageChange(paginationOptions.pageNumber - 1)
                }
              >
                <ChevronLeftIcon />
              </button>
              <button
                disabled={
                  paginationOptions.pageNumber === paginationOptions.totalPages
                }
                onClick={() =>
                  handlePageChange(paginationOptions.pageNumber + 1)
                }
              >
                <ChevronRightIcon />
              </button>
              <button
                disabled={
                  paginationOptions.pageNumber === paginationOptions.totalPages
                }
                onClick={() => handlePageChange(paginationOptions.totalPages)}
              >
                <ChevronDoubleRightIcon />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(DataTable) as typeof DataTable;
