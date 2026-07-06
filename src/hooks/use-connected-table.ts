import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import type { ColumnDef, PaginationState, SortingState } from "@tanstack/react-table";
import { getCoreRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table";
import type { ListParams } from "@/services/api/listParams";
import type { PaginationData } from "@/app/api/response";

export type { ListParams };

interface UseConnectedTableOptions<TData> {
  queryKey: unknown[];
  queryFn: (params: ListParams) => Promise<{ data: TData[]; pagination: PaginationData }>;
  columns: ColumnDef<TData>[];
  pageSize?: number;
}

function toListParams(sorting: SortingState, pagination: PaginationState): ListParams {
  const sort = sorting[0];
  return {
    sort: sort?.id,
    order: sort ? (sort.desc ? "desc" : "asc") : undefined,
    page: pagination.pageIndex + 1,
    perPage: pagination.pageSize,
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

  const params = toListParams(sorting, pagination);

  const queryResult = useQuery({
    queryKey: [...queryKey, params],
    queryFn: () => queryFn(params),
  });

  const table = useReactTable({
    data: queryResult.data?.data ?? [],
    columns,
    state: { sorting, pagination },
    onSortingChange: (updater) => {
      setSorting(updater);
      setPagination((p) => ({ ...p, pageIndex: 0 }));
    },
    onPaginationChange: setPagination,
    manualSorting: true,
    manualPagination: true,
    rowCount: queryResult.data?.pagination.total_results ?? 0,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return { table };
}
