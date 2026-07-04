import * as React from "react";
import type {ColumnDef, PaginationState, SortingState} from "@tanstack/react-table";
import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {useQuery} from "@tanstack/react-query";
import type {PaginationData} from "@/app/api/response";

export interface ConnectedTableParams {
  sorting: SortingState;
  pagination: PaginationState;
}

interface UseConnectedTableOptions<TData> {
  queryKey: unknown[];
  queryFn: (params: ConnectedTableParams) => Promise<{ data: TData[]; pagination: PaginationData }>;
  columns: ColumnDef<TData>[];
  pageSize?: number;
}

export function useConnectedTable<TData>(
  {
    queryKey,
    queryFn,
    columns,
    pageSize = 10,
  }: UseConnectedTableOptions<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState<PaginationState>({pageIndex: 0, pageSize});

  const queryResult = useQuery({
    queryKey: [...queryKey, sorting, pagination],
    queryFn: () => queryFn({sorting, pagination}),
  });

  const table = useReactTable({
    data: queryResult.data?.data ?? [],
    columns,
    state: {sorting, pagination},
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    manualSorting: true,
    manualPagination: true,
    rowCount: queryResult.data?.pagination.total_results ?? 0,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return table;
}
