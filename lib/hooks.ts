"use client";

import { useState, useEffect, useMemo } from "react";

export function useViewport() {
  const [dims, setDims] = useState({ w: 1200, h: 900 });
  useEffect(() => {
    const u = () => setDims({ w: window.innerWidth, h: window.innerHeight });
    u();
    window.addEventListener("resize", u);
    return () => window.removeEventListener("resize", u);
  }, []);
  return dims;
}

export function useTokens(h: number) {
  return useMemo(() => {
    // ═══ COMPACT: ≤768px (13" laptop with devtools) ═══
    if (h <= 768) return {
      pad: "20px 32px 12px",
      hero: 28, sub: 13, heroMb: 12,
      tabPad: "6px 16px", tabFs: 12, tabMb: 12,
      gap: 12, chartMinH: 300, botMinH: 130,
      chartTFs: 13, chartSFs: 11, srcFs: 9,
      chartMarginL: 66, chartMarginR: 28,
      rPad: "16px 20px", rNumFs: 28, rLabelFs: 10,
      upgPad: "12px 14px", upgLFs: 9, upgNFs: 18, upgPpmFs: 20,
      botPad: "14px 18px", botLFs: 9, botTFs: 13, botBFs: 12, botSFs: 11,
      roiFs: 11, roiPad: "8px 10px",
      footMt: 10, footFs: 10,
    };

    // ═══ STANDARD: 769–900px (14" MacBook) ═══
    if (h <= 900) return {
      pad: "28px 44px 16px",
      hero: 34, sub: 15, heroMb: 18,
      tabPad: "7px 20px", tabFs: 13, tabMb: 16,
      gap: 14, chartMinH: 370, botMinH: 145,
      chartTFs: 14, chartSFs: 12, srcFs: 9,
      chartMarginL: 66, chartMarginR: 28,
      rPad: "20px 24px", rNumFs: 32, rLabelFs: 10,
      upgPad: "12px 16px", upgLFs: 10, upgNFs: 20, upgPpmFs: 22,
      botPad: "16px 20px", botLFs: 10, botTFs: 14, botBFs: 13, botSFs: 12,
      roiFs: 12, roiPad: "10px 12px",
      footMt: 12, footFs: 10,
    };

    // ═══ COMFORT: 901–1080px (15-16" laptop, smaller external) ═══
    if (h <= 1080) return {
      pad: "36px 56px 20px",
      hero: 38, sub: 16, heroMb: 24,
      tabPad: "8px 22px", tabFs: 14, tabMb: 22,
      gap: 18, chartMinH: 400, botMinH: 165,
      chartTFs: 15, chartSFs: 13, srcFs: 10,
      chartMarginL: 68, chartMarginR: 28,
      rPad: "24px 28px", rNumFs: 34, rLabelFs: 11,
      upgPad: "14px 18px", upgLFs: 10, upgNFs: 22, upgPpmFs: 24,
      botPad: "20px 24px", botLFs: 10, botTFs: 15, botBFs: 14, botSFs: 13,
      roiFs: 13, roiPad: "12px 14px",
      footMt: 18, footFs: 11,
    };

    // ═══ SPACIOUS: >1080px (27" monitor) ═══
    return {
      pad: "48px 64px 24px",
      hero: 42, sub: 17, heroMb: 28,
      tabPad: "9px 26px", tabFs: 15, tabMb: 26,
      gap: 20, chartMinH: 460, botMinH: 185,
      chartTFs: 16, chartSFs: 14, srcFs: 10,
      chartMarginL: 70, chartMarginR: 28,
      rPad: "28px 32px", rNumFs: 36, rLabelFs: 11,
      upgPad: "16px 20px", upgLFs: 11, upgNFs: 24, upgPpmFs: 26,
      botPad: "22px 28px", botLFs: 11, botTFs: 16, botBFs: 15, botSFs: 13,
      roiFs: 14, roiPad: "14px 16px",
      footMt: 22, footFs: 11,
    };
  }, [h]);
}
