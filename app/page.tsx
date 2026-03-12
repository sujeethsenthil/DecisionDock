"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SplashScreen } from "@/components/onboarding/SplashScreen";

export default function Home() {
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // If user has already seen splash, go straight to uptime
    if (typeof window !== "undefined" && localStorage.getItem("dd_splash_done")) {
      setShowSplash(false);
      router.replace("/uptime");
    }
  }, [router]);

  const handleSplashComplete = () => {
    localStorage.setItem("dd_splash_done", "true");
    setShowSplash(false);
    router.replace("/uptime");
  };

  if (!showSplash) return null;

  return <SplashScreen onComplete={handleSplashComplete} />;
}
