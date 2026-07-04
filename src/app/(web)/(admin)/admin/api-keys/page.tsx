"use client";

import * as React from "react";
import {
  getCoreRowModel,
  getPaginationRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import { apiKeysApi } from "@/api/admin/apiKeysApi";
import type { ListApiKeysParams } from "@/app/api/admin/api-keys/schema";
import { ContentLayout } from "@/components/platform/content-layout";
import { columns } from "./columns";
import { ConnectedDataTable } from "./_components/connected-data-table";
import { CreateApiKeyModal } from "./_components/create-api-key-modal";

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
