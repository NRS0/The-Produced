/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, Suspense, lazy } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { Preloader } from "./components/Preloader";
import { Navbar } from "./components/Navbar";
import { MenuOverlay } from "./components/MenuOverlay";
import { ImageLightbox, VideoLightbox } from "./components/Lightboxes";
import { HeroSection } from "./components/sections/HeroSection";
import { GallerySection } from "./components/sections/GallerySection";
import { AboutSection } from "./components/sections/AboutSection";
import { SiteFooter } from "./components/sections/SiteFooter";
import { NavItem, preloadSiteAssets } from "./data/site";

// three.js dominates the bundle; split it into its own chunk and start
// fetching immediately so it downloads behind the preloader splash.
const grassFieldImport = import("./components/GrassField");
const GrassField = lazy(() =>
  grassFieldImport.then((m) => ({ default: m.GrassField }))
);

export default function App() {
  const [loading, setLoading] = useState(true);
  const [flicker, setFlicker] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"home" | "studio">("home");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  // Dim the page chrome while the hero CTA is hovered on home
  const dimmed = activeTab === "home" && isButtonHovered;

  const scrollToAbout = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleNavigate = (name: NavItem["name"]) => {
    if (name === "Home") {
      setActiveTab("home");
    } else if (name === "Studio") {
      setActiveTab("studio");
    } else if (name === "About") {
      setActiveTab("studio");
      // Wait for the studio sections to mount before scrolling
      setTimeout(scrollToAbout, 150);
    }
    setIsMenuOpen(false);
  };

  useEffect(() => {
    // Warm the cache while the preloader plays so the studio grid is instant
    preloadSiteAssets();

    // Flicker to red at 1.8s, reveal the site at 2.8s
    const flickerTimer = setTimeout(() => setFlicker(true), 1800);
    const doneTimer = setTimeout(() => setLoading(false), 2800);
    return () => {
      clearTimeout(doneTimer);
      clearTimeout(flickerTimer);
    };
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {loading ? (
          <Preloader key="preloader" flicker={flicker} />
        ) : (
          <motion.div
            key="main-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="relative flex min-h-screen flex-col selection:bg-white selection:text-background"
          >
            {/* Fixed interactive background */}
            <div
              className={cn(
                "fixed inset-0 z-0 transition-all",
                dimmed
                  ? "filter grayscale-[100%] contrast-[1.25] brightness-[0.75] duration-[1200ms] ease-out"
                  : "duration-[2500ms] ease-out"
              )}
            >
              <Suspense fallback={null}>
                <GrassField />
              </Suspense>
              <div className="absolute inset-0 bg-black/20 pointer-events-none" />
            </div>

            {/* Full-height landing container */}
            <div className="relative h-[85vh] w-full lg:h-screen">
              <Navbar dimmed={dimmed} onOpenMenu={() => setIsMenuOpen(true)} />
              <HeroSection
                activeTab={activeTab}
                isButtonHovered={isButtonHovered}
                onHoverChange={setIsButtonHovered}
                onEnterStudio={() => setActiveTab("studio")}
              />
            </div>

            {activeTab === "studio" && (
              <>
                <GallerySection
                  onSelectImage={setSelectedImage}
                  onSelectVideo={setSelectedVideo}
                />
                <AboutSection />
              </>
            )}

            <SiteFooter
              dimmed={dimmed}
              onExploreStudio={() => {
                setActiveTab("studio");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedVideo && (
          <VideoLightbox url={selectedVideo} onClose={() => setSelectedVideo(null)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedImage && (
          <ImageLightbox url={selectedImage} onClose={() => setSelectedImage(null)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isMenuOpen && (
          <MenuOverlay onClose={() => setIsMenuOpen(false)} onNavigate={handleNavigate} />
        )}
      </AnimatePresence>
    </>
  );
}
