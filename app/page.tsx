import { HeroHeadline } from "@/components/hero/HeroHeadline";
import { Calculator } from "@/components/calculator/Calculator";
import { SiteFooter } from "@/components/footer/SiteFooter";

export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-[1200px] px-8 py-12 lg:px-8">
        <HeroHeadline />
        <Calculator />
      </div>
      <SiteFooter />
    </main>
  );
}
