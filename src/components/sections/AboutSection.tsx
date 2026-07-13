/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import { METHOD_CARDS } from "../../data/site";

/** "The Produced Method" — heading plus the four data-driven method cards. */
export const AboutSection: React.FC = () => (
  <section id="about" className="relative z-10 bg-transparent px-8 py-32 md:px-16 md:py-64">
    <div className="mx-auto max-w-screen-2xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="mb-24 md:mb-32"
      >
        <h2
          className="text-4xl font-normal tracking-tight text-foreground sm:text-6xl md:text-8xl"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          The <span className="text-muted-foreground italic">Produced</span> Method
        </h2>
        <div className="mt-6 h-[1px] w-24 bg-muted-foreground md:mt-8 md:w-40" />
      </motion.div>

      <div className="grid gap-6 sm:grid-cols-2 max-w-6xl mx-auto">
        {METHOD_CARDS.map((card, i) => (
          <motion.div
            key={card.tag}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 * (i + 1) }}
            className="group relative aspect-square rounded-[2rem] bg-zinc-900/35 border border-zinc-200/5 backdrop-blur-xl p-6 xs:p-8 sm:p-10 md:p-12 flex flex-col justify-start hover:bg-zinc-900/50 hover:border-zinc-200/10 hover:shadow-[0_0_50px_rgba(250,0,63,0.05)] transition-all duration-500 overflow-hidden"
          >
            <div>
              <span className="font-mono text-[9px] sm:text-xs text-[#FA003F] tracking-[0.25em] font-medium block mb-2 sm:mb-4">
                {card.tag}
              </span>
              <h3
                className="text-2xl sm:text-3xl lg:text-4xl text-foreground font-normal tracking-tight group-hover:text-[#FA003F] transition-colors duration-300"
                style={{ fontFamily: "'Instrument Serif', serif" }}
              >
                {card.title}
              </h3>
            </div>
            <p className="text-xl xs:text-2xl sm:text-base md:text-lg lg:text-xl xl:text-2xl leading-normal text-foreground/90 mt-4 sm:mt-6">
              {card.body}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);
