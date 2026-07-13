/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion } from "motion/react";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { FEATURED_VIDEO, GALLERY_ITEMS, GalleryItem, isDirectVideoUrl } from "../../data/site";

/** One tile in the studio grid: image, hover-to-play clip, or video thumbnail. */
const GalleryTile: React.FC<{
  item: GalleryItem;
  index: number;
  onSelect: (item: GalleryItem) => void;
}> = ({ item, index, onSelect }) => {
  const [loaded, setLoaded] = useState(false);
  const directVideo = item.type === "video" && isDirectVideoUrl(item.url);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className={cn(
        "group relative cursor-pointer overflow-hidden rounded-2xl bg-zinc-900/50",
        item.span
      )}
      onClick={() => onSelect(item)}
    >
      {directVideo ? (
        <video
          src={item.url}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          muted
          playsInline
          onMouseOver={(e) => (e.target as HTMLVideoElement).play()}
          onMouseOut={(e) => {
            const v = e.target as HTMLVideoElement;
            v.pause();
            v.currentTime = 0;
          }}
        />
      ) : (
        <img
          src={item.type === "video" ? item.thumbnail : item.url}
          alt={item.title || `Studio work ${index + 1}`}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          className={cn(
            "h-full w-full object-cover object-center transition-all duration-[1200ms] ease-out group-hover:scale-110",
            loaded ? "opacity-100 filter-none" : "opacity-0 filter blur-md scale-[1.01]"
          )}
          referrerPolicy="no-referrer"
        />
      )}

      {item.type === "video" && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-xl transition-all duration-500 group-hover:scale-110 group-hover:bg-white/20">
            <Play className="ml-1 h-5 w-5 fill-white text-white" />
          </div>
        </div>
      )}

      <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <div className="absolute bottom-8 left-8 translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
        <p className="text-xs font-medium uppercase tracking-widest text-white/60">
          {item.label || (item.type === "video" ? "Film" : "Project")}
        </p>
        <h4
          className="mt-2 text-2xl font-medium text-white"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          {item.title || (item.type === "video" ? "Video" : "Untitled")}
        </h4>
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
    </motion.div>
  );
};

/** Studio gallery: featured film on top, then the masonry-style grid. */
export const GallerySection: React.FC<{
  onSelectImage: (url: string) => void;
  onSelectVideo: (url: string) => void;
}> = ({ onSelectImage, onSelectVideo }) => {
  const handleSelect = (item: GalleryItem) => {
    if (item.type === "video") {
      onSelectVideo(item.url || "");
    } else {
      onSelectImage(item.url);
    }
  };

  return (
    <section className="relative z-10 bg-transparent px-6 py-24 md:px-12">
      <div className="mx-auto max-w-screen-2xl">
        {/* Featured film taking up the entire top row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={cn(
            "w-full overflow-hidden rounded-2xl bg-black border-0 mb-8 shadow-2xl",
            FEATURED_VIDEO.aspect
          )}
        >
          <iframe
            src={FEATURED_VIDEO.src}
            className="w-full h-full border-0 outline-none scale-[1.02] origin-center bg-black"
            style={{ border: "none", outline: "none", background: "black" }}
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            title={FEATURED_VIDEO.title}
          />
        </motion.div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12">
          {GALLERY_ITEMS.map((item, idx) => (
            <GalleryTile key={idx} item={item} index={idx} onSelect={handleSelect} />
          ))}
        </div>
      </div>
    </section>
  );
};
