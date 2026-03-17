"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IntroScreen, INTRO_KEY } from "@/components/onboarding/IntroScreen";
import { Analytics } from "@/lib/analytics";

export default function HomeClient() {
  const router = useRouter();
  const [showIntro, setShowIntro] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    try {
      const done = localStorage.getItem(INTRO_KEY);
      setChecked(true);
      if (done) {
        router.replace("/uptime");
        return;
      }
      setShowIntro(true);
      Analytics.introViewed();
    } catch {
      setChecked(true);
      setShowIntro(true);
      Analytics.introViewed();
    }
  }, [router]);

  const handleIntroDone = () => {
    Analytics.introDone();
    router.push("/uptime");
  };

  if (!checked) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0B1120",
        }}
      />
    );
  }

  if (!showIntro) {
    return null;
  }

  return <IntroScreen onDone={handleIntroDone} />;
}
