"use client";

import { useState } from "react";
import { ContentLayout } from "@/components/platform/content-layout";
import { CreateApiKeyModal } from "./_components/create-api-key-modal";
import { ApiKeysTable } from "./_components/api-keys-table";

export default function ApiKeysPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  return (
    <ContentLayout
      title="API Keys"
      description="Manage API keys for programmatic access."
      actions={<CreateApiKeyModal onCreated={() => setRefreshTrigger((n) => n + 1)} />}
    >
      <ApiKeysTable
        refreshTrigger={refreshTrigger}
        onDeleted={() => setRefreshTrigger((n) => n + 1)}
      />
    </ContentLayout>
  );
}
