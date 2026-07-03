import { ContentLayout } from "@/components/platform/content-layout";
import { CreateApiKeyModal } from "./_components/create-api-key-modal";
import { ApiKeysTable } from "./_components/api-keys-table";

export default function ApiKeysPage() {
  return (
    <ContentLayout
      title="API Keys"
      description="Manage API keys for programmatic access."
      actions={<CreateApiKeyModal />}
    >
      <ApiKeysTable />
    </ContentLayout>
  );
}
