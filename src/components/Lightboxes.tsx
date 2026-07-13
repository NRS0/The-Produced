/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import { X } from "lucide-react";
import { isDirectVideoUrl } from "../data/site";

/** Shared fullscreen backdrop + close button for both lightboxes. */
const LightboxShell: React.FC<{
  onClose: () => void;
  children: React.ReactNode;
  panelClassName: string;
}> = ({ onClose, children, panelClassName }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 p-4 backdrop-blur-xl md:p-12"
    onClick={onClose}
  >
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="absolute right-8 top-8 z-[210] text-white/60 transition-colors hover:text-white"
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      <X size={40} strokeWidth={1} />
    </motion.button>

    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className={panelClassName}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </motion.div>
  </motion.div>
);

/** Fullscreen video player: native <video> for raw files, iframe for embeds. */
export const VideoLightbox: React.FC<{ url: string; onClose: () => void }> = ({
  url,
  onClose,
}) => (
  <LightboxShell
    onClose={onClose}
    panelClassName="relative aspect-video w-full max-w-6xl overflow-hidden rounded-2xl shadow-2xl bg-black"
  >
    {isDirectVideoUrl(url) ? (
      <video src={url} className="h-full w-full" controls autoPlay />
    ) : (
      <iframe
        src={url}
        className="h-full w-full border-0"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
      />
    )}
  </LightboxShell>
);

/** Fullscreen image viewer. */
export const ImageLightbox: React.FC<{ url: string; onClose: () => void }> = ({
  url,
  onClose,
}) => (
  <LightboxShell
    onClose={onClose}
    panelClassName="relative max-h-full max-w-full overflow-hidden rounded-lg shadow-2xl"
  >
    <img
      src={url}
      alt="Full frame view"
      className="max-h-[85vh] w-auto object-contain md:max-h-[90vh]"
      referrerPolicy="no-referrer"
    />
  </LightboxShell>
);
