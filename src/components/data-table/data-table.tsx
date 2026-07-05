"use client";

import { useEffect, useState } from "react";
import { DataTablePagination } from "./data-table-pagination";
import {
  type ColumnDef,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type FetcherParams = { sort?: string; order?: string };

interface DataTableProps<TData> {
  columns: ColumnDef<TData, unknown>[];
  fetcher?: (params?: FetcherParams) => Promise<TData[]>;
  data?: TData[];
  emptyMessage?: string;
  pageSize?: number;
  refreshTrigger?: number;
}

export function DataTable<TData>({
  columns,
  fetcher,
  data: staticData,
  emptyMessage = "No results.",
  pageSize = 20,
  refreshTrigger,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [data, setData] = useState<TData[]>(staticData ?? []);

  useEffect(() => {
    if (!fetcher) return;
    const sort = sorting[0]?.id ?? "createdAt";
    const order = sorting[0]?.desc ? "desc" : "asc";
    fetcher({ sort, order }).then(setData);
  }, [fetcher, sorting, refreshTrigger]);

  const table = useReactTable({
    data,
    columns,
    manualSorting: !!fetcher,
    state: { sorting },
    onSortingChange: setSorting,
    initialState: { pagination: { pageSize } },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (data.length === 0) {
    return <p className="text-sm text-muted-foreground">{emptyMessage}</p>;
  }

  return (
    <div>
      <div className="overflow-hidden rounded-lg border">
        <Table className="[&_td:first-child]:pl-6 [&_th:first-child]:pl-6">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
