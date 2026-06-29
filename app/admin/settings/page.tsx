import AdminGate from "@/components/AdminGate";
import AdminDashboard from "@/components/AdminDashboard";

export default function AdminSettingsPage() {
  return <AdminGate><AdminDashboard initialTab="settings" /></AdminGate>;
}
