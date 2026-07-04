"use client";

import * as React from "react";
import {
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import { apiKeysApi } from "@/api/admin/apiKeysApi";
import type { ApiKey } from "@/api/types/apiKey";
import type { ListApiKeysParams } from "@/app/api/admin/api-keys/schema";
import { ContentLayout } from "@/components/platform/content-layout";
import { ConnectedDataTable } from "./_components/connected-data-table";
import { CreateApiKeyModal } from "./_components/create-api-key-modal";
import { DeleteApiKeyButton } from "./_components/delete-api-key-button";

const columnHelper = createColumnHelper<ApiKey>();

const columns = [
  columnHelper.accessor("name", {
    header: "Name",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("start", {
    header: "Key",
    cell: (info) => info.getValue(),
    enableSorting: false,
  }),
  columnHelper.accessor("enabled", {
    header: "Enabled",
    cell: (info) => (info.getValue() ? "Yes" : "No"),
    enableSorting: false,
  }),
  columnHelper.accessor("expiresAt", {
    header: "Expires At",
    cell: (info) => info.getValue() ?? "Never",
  }),
  columnHelper.accessor("createdAt", {
    header: "Created At",
    cell: (info) => info.getValue(),
  }),
  columnHelper.display({
    id: "actions",
    cell: (info) => <DeleteApiKeyButton id={info.row.original.id} />,
  }),
];

export default function ApiKeysPage() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 });

  const { data } = useQuery({
    queryKey: ["admin", "api-keys", sorting, pagination],
    queryFn: () => {
      const sort = sorting[0];
      const params: ListApiKeysParams = {
        page: pagination.pageIndex + 1,
        perPage: pagination.pageSize,
        ...(sort ? { sort: sort.id as ListApiKeysParams["sort"], order: sort.desc ? "desc" : "asc" } : {}),
      };
      return apiKeysApi.listApiKeys(params);
    },
  });

  const table = useReactTable({
    data: data?.data ?? [],
    columns,
    state: { sorting, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    manualSorting: true,
    manualPagination: true,
    rowCount: data?.pagination.total_results ?? 0,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <ContentLayout
      title="API Keys"
      description="Manage API keys for programmatic access."
      actions={<CreateApiKeyModal />}
    >
      <ConnectedDataTable table={table} />
    </ContentLayout>
  );
}
