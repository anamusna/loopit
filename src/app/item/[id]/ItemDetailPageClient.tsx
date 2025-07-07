import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { ItemDetail } from "@/components/item/ItemDetail";
interface ItemDetailPageClientProps {
  itemId: string;
}
export default function ItemDetailPageClient({
  itemId,
}: ItemDetailPageClientProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="flex-1 mb-16 md:mb-24">
        <ItemDetail itemId={itemId} />
      </main>
      <Footer />
    </div>
  );
}
