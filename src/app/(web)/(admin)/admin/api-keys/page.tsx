"use client";

import * as React from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { apiKeysApi } from "@/api/admin/apiKeysApi";
import type { ApiKey } from "@/api/types/apiKey";
import { ContentLayout } from "@/components/platform/content-layout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const columnHelper = createColumnHelper<ApiKey>();

const columns = [
  columnHelper.accessor("name", {
    header: "Name",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("start", {
    header: "Key",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("enabled", {
    header: "Enabled",
    cell: (info) => (info.getValue() ? "Yes" : "No"),
  }),
  columnHelper.accessor("expiresAt", {
    header: "Expires At",
    cell: (info) => info.getValue() ?? "Never",
  }),
  columnHelper.accessor("createdAt", {
    header: "Created At",
    cell: (info) => info.getValue(),
  }),
];

export default function ApiKeysPage() {
  const [data, setData] = React.useState<ApiKey[]>([]);

  React.useEffect(() => {
    apiKeysApi.listApiKeys().then(setData);
  }, []);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <ContentLayout
      title="API Keys"
      description="Manage API keys for programmatic access."
    >
      <Table>
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
    </ContentLayout>
  );
}
