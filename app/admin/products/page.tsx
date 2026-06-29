import AdminGate from "@/components/AdminGate";
import AdminDashboard from "@/components/AdminDashboard";

export default function AdminProductsPage() {
  return <AdminGate><AdminDashboard initialTab="products" /></AdminGate>;
}
