import { HeroHeadline } from "@/components/hero/HeroHeadline";
import { Calculator } from "@/components/calculator/Calculator";
import { SiteFooter } from "@/components/footer/SiteFooter";

export default function Home() {
  return (
    <main style={{ minHeight: "100vh" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 32px" }}>
        <HeroHeadline />
        <Calculator />
        <SiteFooter />
      </div>
    </main>
  );
}
