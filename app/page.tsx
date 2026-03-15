"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SplashScreen } from "@/components/onboarding/SplashScreen";

export default function Home() {
  const router = useRouter();
  // null = not yet resolved (server + first paint)
  // true = splash already seen, redirect
  // false = show splash
  const [splashDone, setSplashDone] = useState<boolean | null>(null);

  useEffect(() => {
    let done = false;
    try {
      done = !!localStorage.getItem("dd_splash_done");
    } catch {}
    setSplashDone(done);
    if (done) router.replace("/uptime");
  }, [router]);

  // Render nothing on server and first paint — avoids hydration mismatch entirely
  if (splashDone === null) return null;

  // Already seen — null while redirect fires
  if (splashDone === true) return null;

  const handleComplete = () => {
    try { localStorage.setItem("dd_splash_done", "true"); } catch {}
    router.replace("/uptime");
  };

  return <SplashScreen onComplete={handleComplete} />;
}
