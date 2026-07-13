/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import { BRAND } from "../data/site";

/**
 * Brand splash shown while the site boots: black screen with the red logo,
 * then a flicker to the alternate logo over the brand-red background.
 */
export const Preloader: React.FC<{ flicker: boolean }> = ({ flicker }) => (
  <motion.div
    key="preloader"
    initial={{ backgroundColor: "#000000" }}
    animate={{
      backgroundColor: flicker ? BRAND.red : "#000000",
      transition: { duration: 0.8, ease: "easeInOut" },
    }}
    exit={{
      opacity: 0,
      y: -20,
      transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
    }}
    className="fixed inset-0 z-[100] flex items-center justify-center"
  >
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: 1,
        scale: 1,
        transition: { duration: 1.2, ease: "easeOut" },
      }}
      className="relative flex items-center justify-center w-64 md:w-96 h-32 md:h-48"
    >
      {/* Static red logo */}
      <motion.img
        src={BRAND.logoRed}
        alt="Produced Logo"
        className="h-full w-auto object-contain"
        referrerPolicy="no-referrer"
        animate={{ opacity: !flicker ? 1 : 0 }}
        transition={{ duration: flicker ? 0.05 : 0.3 }}
      />

      {/* Flickering alternate logo layer */}
      <motion.img
        src={BRAND.logoFlicker}
        alt="Produced Logo Flicker"
        className="absolute inset-0 h-full w-auto mx-auto object-contain"
        referrerPolicy="no-referrer"
        initial={{ opacity: 0 }}
        animate={{ opacity: flicker ? [0, 1, 0.5, 1] : 0 }}
        transition={{ duration: 0.35, times: [0, 0.2, 0.5, 1] }}
      />

      {/* Subtle pulsing glow */}
      <motion.div
        animate={{
          opacity: flicker ? 0 : [0.2, 0.5, 0.2],
          scale: [1, 1.05, 1],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 -z-10 bg-red-500/20 blur-3xl"
      />
    </motion.div>
  </motion.div>
);
