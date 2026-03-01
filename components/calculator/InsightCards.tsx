"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import type { ThresholdAnnotation } from "@/lib/models";

interface InsightCardsProps {
  thresholds: ThresholdAnnotation[];
}

export function InsightCards({ thresholds }: InsightCardsProps) {
  return (
    <div className="flex flex-col gap-4">
      <AnimatePresence mode="popLayout">
        {thresholds.map((t) => (
          <motion.div
            key={`${t.trigger}-${t.title}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{
              opacity: 1,
              x: 0,
              transition: {
                type: "spring",
                stiffness: 300,
                damping: 30,
                duration: 0.3,
              },
            }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
          >
            <Card className="p-4">
              <div className="flex items-start gap-3">
                <span className="text-xl" aria-hidden>
                  {t.icon}
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-[#1B2A4A]">
                    {t.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-[#333333]">
                    {t.body}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
