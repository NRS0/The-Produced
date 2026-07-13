/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { cn } from "@/lib/utils";
import { TextRoll } from "./TextRoll";
import { BRAND } from "../data/site";

/**
 * Top navigation: logo (opens menu), centered MENU trigger on desktop,
 * Contact button. `dimmed` applies the grayscale hover treatment driven
 * by the hero CTA.
 */
export const Navbar: React.FC<{
  dimmed: boolean;
  onOpenMenu: () => void;
}> = ({ dimmed, onOpenMenu }) => (
  <nav
    className={cn(
      "absolute top-0 left-0 right-0 z-50 w-full px-6 py-8 md:px-12 transition-all",
      dimmed
        ? "filter grayscale-[100%] brightness-[0.8] duration-[1200ms] ease-out"
        : "duration-[2500ms] ease-out"
    )}
  >
    <div className="grid grid-cols-3 items-center w-full">
      <div className="flex justify-start">
        <button
          onClick={onOpenMenu}
          className="cursor-pointer transition-transform active:scale-95 focus:outline-none"
        >
          <img
            src={BRAND.logoRed}
            alt="Produced Logo"
            className="h-10 w-auto object-contain md:h-14"
            referrerPolicy="no-referrer"
          />
        </button>
      </div>

      {/* Menu trigger in the center (desktop only) */}
      <div className="flex justify-center">
        <button
          onClick={onOpenMenu}
          className="group hidden md:flex items-center justify-center text-xs font-semibold tracking-[0.25em] uppercase text-white hover:text-[#FA003F] transition-all cursor-pointer p-2"
        >
          <TextRoll>MENU</TextRoll>
        </button>
      </div>

      {/* Contact button on the right */}
      <div className="flex justify-end">
        <a
          href={`mailto:${BRAND.contactEmail}`}
          className="liquid-glass rounded-full px-5 py-2 md:px-8 md:py-3 text-xs md:text-sm font-medium text-foreground transition-transform hover:scale-[1.03]"
        >
          Contact
        </a>
      </div>
    </div>
  </nav>
);
