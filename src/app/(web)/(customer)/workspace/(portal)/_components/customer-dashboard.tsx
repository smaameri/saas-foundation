export function CustomerDashboard() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-lg border p-6">
        <h2 className="text-lg font-semibold">Getting started</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          This is the customer portal dashboard. You can use this area to highlight key metrics,
          quick links, or onboarding steps for your customers.
        </p>
      </div>
      <div className="rounded-lg border p-6">
        <h2 className="text-lg font-semibold">Recent activity</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Once the portal is wired up to real data, show the latest updates here so customers can
          see what changed at a glance.
        </p>
      </div>
    </div>
  );
}
