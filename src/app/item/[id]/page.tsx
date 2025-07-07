import { allItems } from "@/data/items";
import { Metadata } from "next";
import ItemDetailPageClient from "./ItemDetailPageClient";
export async function generateStaticParams() {
  return allItems.map((item) => ({
    id: item.id,
  }));
}
export const metadata: Metadata = {
  title: "Item Details | LoopIt",
  description:
    "View detailed information about this item and start a swap request.",
};
export default async function ItemDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ItemDetailPageClient itemId={id} />;
}
