import AdminGate from "@/components/AdminGate";
import AdminDashboard from "@/components/AdminDashboard";

export default function AdminCategoriesPage() {
  return <AdminGate><AdminDashboard initialTab="categories" /></AdminGate>;
}
