"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IntroScreen, INTRO_KEY } from "@/components/onboarding/IntroScreen";
import { Analytics } from "@/lib/analytics";
import { PORTFOLIO_LIVE } from "@/lib/constants";

export default function HomeClient() {
  const router = useRouter();
  const [showIntro, setShowIntro] = useState(false);
  const [isReturnVisitor, setIsReturnVisitor] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    try {
      const done = localStorage.getItem(INTRO_KEY);
      const hasSeenIntro = Boolean(done);
      setIsReturnVisitor(hasSeenIntro);
      setChecked(true);
      setShowIntro(true);
      if (!hasSeenIntro) {
        Analytics.introViewed();
      }
    } catch {
      setChecked(true);
      setShowIntro(true);
      Analytics.introViewed();
    }
  }, []);

  const destination = PORTFOLIO_LIVE && isReturnVisitor ? "/portfolio" : "/uptime";

  const handleIntroDone = () => {
    Analytics.introDone();
    router.push(destination);
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

  return <IntroScreen onDone={handleIntroDone} isReturn={isReturnVisitor} />;
}
