import { notFound } from "next/navigation";
import StoryRenderer from "@/components/story/StoryRenderer";
import { getPublicStoryBySlug } from "@/lib/story/cms";
import { getCmsData } from "@/lib/cms";

export default async function PublicCustomStoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [story, cms] = await Promise.all([getPublicStoryBySlug(slug), getCmsData()]);
  if (!story) return notFound();
  return <StoryRenderer story={story} whatsappPhone={cms.contactSettings.whatsapp || cms.settings.whatsapp} />;
}
