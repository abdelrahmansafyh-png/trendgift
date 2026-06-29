import { notFound } from "next/navigation";
import StoryRenderer from "@/components/story/StoryRenderer";
import { getPublicStoryBySlug } from "@/lib/story/cms";

export default async function PublicCustomStoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const story = await getPublicStoryBySlug(slug);
  if (!story) return notFound();
  return <StoryRenderer story={story} />;
}
