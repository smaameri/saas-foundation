"use client";

import type { Table as TanstackTable } from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { DataTablePagination } from "@/components/connected-data-table/pagination";
import { DataTableToolbar } from "@/components/connected-data-table/toolbar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type FilterOption = {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
};

type Filter = {
  columnId: string;
  title: string;
  options: FilterOption[];
};

interface DataTableProps<TData> {
  table: TanstackTable<TData>;
  searchPlaceholder?: string;
  showSearch?: boolean;
  showViewOptions?: boolean;
  filters?: Filter[];
}

export function DataTable<TData>({
  table,
  searchPlaceholder,
  showSearch,
  showViewOptions,
  filters,
}: DataTableProps<TData>) {
  return (
    <div className="@container/content flex flex-col gap-4">
      <DataTableToolbar
        table={table}
        searchPlaceholder={searchPlaceholder}
        showSearch={showSearch}
        showViewOptions={showViewOptions}
        filters={filters}
      />
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      className={cn(
                        "outline-none",
                        header.column.columnDef.meta?.className,
                        header.column.columnDef.meta?.thClassName,
                      )}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        cell.column.columnDef.meta?.className,
                        cell.column.columnDef.meta?.tdClassName,
                      )}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={table.getVisibleLeafColumns().length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} className="mt-4" />
    </div>
  );
}
