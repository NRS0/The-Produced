/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import { X } from "lucide-react";
import { TextRoll } from "./TextRoll";
import { BRAND, NAV_ITEMS, NavItem } from "../data/site";

/**
 * Immersive fullscreen menu. Render inside <AnimatePresence> so the
 * fade-out exit animation plays.
 */
export const MenuOverlay: React.FC<{
  onClose: () => void;
  onNavigate: (name: NavItem["name"]) => void;
}> = ({ onClose, onNavigate }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.4, ease: "easeInOut" }}
    className="fixed inset-0 z-[150] flex flex-col justify-between bg-[#000000] px-6 py-8 md:px-12 md:py-12 select-none"
  >
    {/* Ambient red glow backdrops matching the site's dark scheme */}
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FA003F]/10 rounded-full blur-[140px]" />
      <div className="absolute bottom-1/10 left-1/3 w-[400px] h-[400px] bg-red-950/15 rounded-full blur-[110px]" />
    </div>

    {/* Menu header (logo left, close right) */}
    <div className="relative z-10 flex items-center justify-between">
      <div>
        <img
          src={BRAND.logoRed}
          alt="Produced Logo"
          className="h-10 w-auto object-contain md:h-14"
          referrerPolicy="no-referrer"
        />
      </div>

      <button
        onClick={onClose}
        className="group flex items-center gap-3 text-xs font-semibold tracking-[0.25em] uppercase cursor-pointer text-zinc-400 hover:text-white transition-colors border-0 bg-transparent p-0"
      >
        <span>
          <TextRoll>CLOSE</TextRoll>
        </span>
        <X size={24} className="text-[#FA003F] group-hover:scale-110 transition-transform" />
      </button>
    </div>

    {/* Centered navigation items */}
    <div className="relative z-10 flex flex-1 items-center justify-center">
      <ul className="flex flex-col items-center justify-center gap-5 sm:gap-6 md:gap-7 max-w-xl w-full text-center">
        {NAV_ITEMS.map((item, index) => (
          <motion.li
            key={item.name}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.45, ease: "easeOut" }}
            className="relative flex cursor-pointer flex-col items-center overflow-visible group"
            onClick={() => onNavigate(item.name)}
          >
            <div className="relative flex items-start">
              <TextRoll
                center
                className="text-4xl xs:text-5xl md:text-7xl font-extrabold uppercase leading-[0.8] tracking-[-0.03em] text-zinc-100 group-hover:text-[#FA003F] transition-colors duration-300"
              >
                {item.name}
              </TextRoll>
            </div>
          </motion.li>
        ))}
      </ul>
    </div>
  </motion.div>
);
