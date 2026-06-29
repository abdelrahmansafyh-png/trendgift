import AdminGate from "@/components/AdminGate";
import StoryBuilderAdmin from "@/components/story/StoryBuilderAdmin";

export default function AdminStoryBuilderPage() {
  return <AdminGate><StoryBuilderAdmin /></AdminGate>;
}
