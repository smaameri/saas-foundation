"use client";

import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { useRouter, useSearchParams } from "next/navigation";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTablePagination } from "./data-table-pagination";

interface DataTableProps<TData> {
  columns: ColumnDef<TData, any>[];
  data: TData[];
  pageSize?: number;
}

export function DataTable<TData>({ columns, data, pageSize = 20 }: DataTableProps<TData>) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const sort = searchParams.get("sort") ?? "createdAt";
  const order = searchParams.get("order") ?? "asc";

  const sorting: SortingState = [{ id: sort, desc: order === "desc" }];

  const table = useReactTable({
    data,
    columns,
    manualSorting: true,
    state: { sorting },
    initialState: { pagination: { pageSize } },
    onSortingChange: (updater) => {
      const next = typeof updater === "function" ? updater(sorting) : updater;
      const params = new URLSearchParams(searchParams.toString());
      if (next.length > 0) {
        params.set("sort", next[0].id);
        params.set("order", next[0].desc ? "desc" : "asc");
      } else {
        params.delete("sort");
        params.delete("order");
      }
      router.replace(`?${params.toString()}`);
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

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
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
