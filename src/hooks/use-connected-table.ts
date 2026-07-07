import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import type {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { ListParams } from "@/services/api/listParams";
import type { PaginationData } from "@/app/api/response";

export type { ListParams };

interface UseConnectedTableOptions<TData> {
  queryKey: unknown[];
  queryFn: (params: ListParams) => Promise<{ data: TData[]; pagination: PaginationData }>;
  columns: ColumnDef<TData>[];
  pageSize?: number;
}

function toListParams(
  sorting: SortingState,
  pagination: PaginationState,
  columnFilters: ColumnFiltersState,
): ListParams {
  const sort = sorting[0];
  const filters = columnFilters.length
    ? Object.fromEntries(columnFilters.map((f) => [f.id, f.value as string[]]))
    : undefined;
  return {
    sort: sort?.id,
    order: sort ? (sort.desc ? "desc" : "asc") : undefined,
    page: pagination.pageIndex + 1,
    perPage: pagination.pageSize,
    filters,
  };
}

export function useConnectedTable<TData>({
  queryKey,
  queryFn,
  columns,
  pageSize = 10,
}: UseConnectedTableOptions<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState<PaginationState>({ pageIndex: 0, pageSize });
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

  const params = toListParams(sorting, pagination, columnFilters);

  const queryResult = useQuery({
    queryKey: [...queryKey, params],
    queryFn: () => queryFn(params),
  });

  const table = useReactTable({
    data: queryResult.data?.data ?? [],
    columns,
    state: { sorting, pagination, columnFilters },
    onSortingChange: (updater) => {
      setSorting(updater);
      setPagination((p) => ({ ...p, pageIndex: 0 }));
    },
    onPaginationChange: setPagination,
    onColumnFiltersChange: (updater) => {
      setColumnFilters(updater);
      setPagination((p) => ({ ...p, pageIndex: 0 }));
    },
    manualSorting: true,
    manualPagination: true,
    manualFiltering: true,
    rowCount: queryResult.data?.pagination.total_results ?? 0,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return { table };
}
