/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Hero content inside the full-height landing container: the "Begin Your
 * Journey" CTA on home, or "The Studio" heading once inside the studio.
 */
export const HeroSection: React.FC<{
  activeTab: "home" | "studio";
  isButtonHovered: boolean;
  onHoverChange: (hovered: boolean) => void;
  onEnterStudio: () => void;
}> = ({ activeTab, isButtonHovered, onHoverChange, onEnterStudio }) => {
  if (activeTab === "home") {
    return (
      <main className="relative z-10 flex h-full flex-col items-center justify-center px-8 text-center">
        <div className="max-w-6xl translate-y-[104px]">
          <button
            onClick={onEnterStudio}
            onMouseEnter={() => onHoverChange(true)}
            onMouseLeave={() => onHoverChange(false)}
            className={cn(
              "liquid-glass animate-fade-rise cursor-pointer rounded-full px-16 py-7 sm:px-22 sm:py-8 text-xl sm:text-3xl font-medium text-foreground transition-all duration-700 ease-out",
              isButtonHovered
                ? "bg-[#FA003F] text-white shadow-[0_0_55px_rgba(250,0,63,0.85)] scale-[1.04]"
                : "hover:scale-[1.03]"
            )}
          >
            Begin Your Journey
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="relative z-10 flex h-full flex-col items-center justify-center px-8 pt-20 text-center lg:pt-0">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-full w-full px-4"
      >
        <h1
          className="text-[6.5rem] xs:text-[7.5rem] sm:text-[11.25rem] font-normal tracking-tighter text-foreground leading-[0.85] text-center"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          The <span className="text-muted-foreground italic">Studio</span>
        </h1>
        <p className="mt-6 text-lg text-muted-foreground">
          A curated collection of our latest generative experiments and cinematic explorations.
        </p>
      </motion.div>
    </main>
  );
};
