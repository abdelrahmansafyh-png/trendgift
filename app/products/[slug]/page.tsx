import { products } from "@/lib/data";
import { getCmsData } from "@/lib/cms";
import { notFound } from "next/navigation";
import ProductClient from "./ProductClient";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cms = await getCmsData();
  const product = cms.products.find((p) => p.slug === slug);
  if (!product) notFound();
  return <ProductClient product={product} settings={cms.settings} contactSettings={cms.contactSettings} />;
}
