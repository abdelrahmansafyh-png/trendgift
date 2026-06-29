import AdminGate from "@/components/AdminGate";
import AdminDashboard from "@/components/AdminDashboard";

export default function AdminHeroPage() {
  return <AdminGate><AdminDashboard initialTab="hero" /></AdminGate>;
}
