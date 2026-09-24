import type { Metadata } from "next";
import { AdminPanel } from "@/components/AdminPanel";

export const metadata: Metadata = {
  title: "Owner Dashboard",
  description:
    "Private fleet management dashboard for QHQ Motors — add, edit and export rental cars.",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <main className="flex min-h-screen flex-1 flex-col">
      <AdminPanel />
    </main>
  );
}
