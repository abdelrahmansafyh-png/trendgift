import AdminGate from "@/components/AdminGate";
import AdminDashboard from "@/components/AdminDashboard";

export default function AdminContactPage() {
  return <AdminGate><AdminDashboard initialTab="contact" /></AdminGate>;
}
