import { HeroHeadline } from "@/components/hero/HeroHeadline";
import { Calculator } from "@/components/calculator/Calculator";
import { SiteFooter } from "@/components/footer/SiteFooter";

export default function Home() {
  return (
    <main style={{ minHeight: "100vh", background: "#F0F4F8" }}>
      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "36px 48px 24px" }}>
        <HeroHeadline />
        <Calculator />
        <SiteFooter />
      </div>
    </main>
  );
}
