/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const STAGGER = 0.035;

/**
 * Letter-by-letter rolling hover effect: the visible line slides up and a
 * duplicate slides in from below. `center` staggers outward from the middle.
 */
export const TextRoll: React.FC<{
  children: string;
  className?: string;
  center?: boolean;
}> = ({ children, className, center = false }) => {
  const letters = children.split("");
  const delayFor = (i: number) =>
    center ? STAGGER * Math.abs(i - (letters.length - 1) / 2) : STAGGER * i;

  return (
    <motion.span
      initial="initial"
      whileHover="hovered"
      className={cn("relative block overflow-hidden", className)}
      style={{ lineHeight: 0.75 }}
    >
      <div>
        {letters.map((l, i) => (
          <motion.span
            variants={{ initial: { y: 0 }, hovered: { y: "-100%" } }}
            transition={{ ease: "easeInOut", delay: delayFor(i) }}
            className="inline-block"
            key={i}
          >
            {l === " " ? " " : l}
          </motion.span>
        ))}
      </div>
      <div className="absolute inset-0">
        {letters.map((l, i) => (
          <motion.span
            variants={{ initial: { y: "100%" }, hovered: { y: 0 } }}
            transition={{ ease: "easeInOut", delay: delayFor(i) }}
            className="inline-block"
            key={i}
          >
            {l === " " ? " " : l}
          </motion.span>
        ))}
      </div>
    </motion.span>
  );
};
