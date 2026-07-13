/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { cn } from "@/lib/utils";
import { BRAND } from "../../data/site";

/**
 * Bottom of the page: spacer, the tagline strip, and the red brand footer
 * with Studio / Contact links.
 */
export const SiteFooter: React.FC<{
  dimmed: boolean;
  onExploreStudio: () => void;
}> = ({ dimmed, onExploreStudio }) => (
  <>
    {/* Page extension spacer to push the footer down */}
    <div className="relative z-10 h-[6in] w-full" />

    {/* Tagline strip */}
    <div
      className={cn(
        "relative z-10 px-8 py-12 transition-all",
        dimmed
          ? "filter grayscale-[100%] duration-[1200ms] ease-out"
          : "duration-[2500ms] ease-out"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center gap-4">
        <div className="h-[1px] w-8 bg-muted-foreground" />
        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          {BRAND.tagline}
        </p>
      </div>
    </div>

    {/* Red brand footer */}
    <div
      id="blank-brand-footer"
      className={cn(
        "relative z-10 w-full bg-[#FA003F] h-[3in] flex items-center justify-between pl-2 md:pl-4 pr-8 md:pr-16 transition-all overflow-hidden",
        dimmed
          ? "filter grayscale-[100%] duration-[1200ms] ease-out"
          : "duration-[2500ms] ease-out"
      )}
    >
      <img
        src={BRAND.footerGraphic}
        alt="Footer Graphic"
        className="h-[2.4in] w-auto object-contain flex-shrink-0"
        referrerPolicy="no-referrer"
      />

      <div className="hidden sm:flex items-center h-full flex-shrink-0 mr-12 md:mr-32 lg:mr-48">
        <div className="flex gap-16 text-right">
          <div className="flex flex-col gap-1.5">
            <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/50 mb-0.5">
              Explore
            </p>
            <a
              href="#studio"
              onClick={(e) => {
                e.preventDefault();
                onExploreStudio();
              }}
              className="font-sans text-sm font-semibold text-white hover:text-white/80 transition-colors hover:underline underline-offset-4"
            >
              Studio
            </a>
          </div>

          <div className="flex flex-col gap-1.5">
            <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/50 mb-0.5">
              Contact
            </p>
            <a
              href={`mailto:${BRAND.contactEmail}`}
              className="font-sans text-sm font-semibold text-white hover:text-white/80 transition-colors hover:underline underline-offset-4"
            >
              Get in touch
            </a>
          </div>
        </div>
      </div>
    </div>
  </>
);
