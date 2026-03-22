import { AdminSidebar } from "@/components/layout/admin-sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[calc(100vh-120px)]">
      <AdminSidebar />
      <div className="flex-1 bg-muted p-6 overflow-auto">{children}</div>
    </div>
  );
}
