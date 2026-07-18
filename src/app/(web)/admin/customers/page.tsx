import { redirect } from "next/navigation";

export default function CustomersIndexPage() {
  redirect("/admin/customers/organizations");
}
