import { HeroHeadline } from "@/components/hero/HeroHeadline";
import { Calculator } from "@/components/calculator/Calculator";

export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-[1200px] px-8 py-12 lg:px-8">
        <HeroHeadline />
        <Calculator />
      </div>
    </main>
  );
}
