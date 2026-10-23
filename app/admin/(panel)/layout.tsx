import AdminNav from "@/components/admin/AdminNav";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  const { n } = getDb().prepare("SELECT COUNT(*) AS n FROM submissions WHERE status = 'new'").get() as { n: number };
  return (
    <div className="md:flex">
      <AdminNav newCount={n} />
      <main className="min-w-0 flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
    </div>
  );
}
