/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { GrassField } from "./components/GrassField";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, X, Play } from "lucide-react";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [flicker, setFlicker] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"home" | "studio">("home");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  const handleAboutClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (activeTab !== "studio") {
      setActiveTab("studio");
      setTimeout(() => {
        const aboutSec = document.getElementById("about");
        if (aboutSec) {
          aboutSec.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      const aboutSec = document.getElementById("about");
      if (aboutSec) {
        aboutSec.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const handleAboutClickMobile = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsMenuOpen(false);
    if (activeTab !== "studio") {
      setActiveTab("studio");
      setTimeout(() => {
        const aboutSec = document.getElementById("about");
        if (aboutSec) {
          aboutSec.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      const aboutSec = document.getElementById("about");
      if (aboutSec) {
        aboutSec.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  useEffect(() => {
    // Start flicker and background transition at 1.8s
    const flickerTimer = setTimeout(() => {
      setFlicker(true);
    }, 1800);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 2800); // Extended slightly to show the red transition
    return () => {
      clearTimeout(timer);
      clearTimeout(flickerTimer);
    };
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="preloader"
            initial={{ backgroundColor: "#000000" }}
            animate={{ 
              backgroundColor: flicker ? "#FA003F" : "#000000",
              transition: { duration: 0.8, ease: "easeInOut" }
            }}
            exit={{ 
              opacity: 0,
              y: -20,
              transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
            }}
            className="fixed inset-0 z-[100] flex items-center justify-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                transition: { duration: 1.2, ease: "easeOut" }
              }}
              className="relative"
            >
              <AnimatePresence mode="wait">
                {!flicker ? (
                  <motion.img 
                    key="logo-1"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.1 } }}
                    src="https://i.ibb.co/ksH2WLYk/THE-PRODUCED-LOGO-RED.png" 
                    alt="Produced Logo" 
                    className="h-32 w-auto object-contain md:h-48"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <motion.img 
                    key="logo-2"
                    initial={{ opacity: 0 }}
                    animate={{ 
                      opacity: [0, 1, 0.5, 1],
                      transition: { duration: 0.3, times: [0, 0.2, 0.5, 1] }
                    }}
                    src="https://imglink.cc/cdn/vSFMkujUJV.png" 
                    alt="Produced Logo Flicker" 
                    className="h-32 w-auto object-contain md:h-48"
                    referrerPolicy="no-referrer"
                  />
                )}
              </AnimatePresence>
              {/* Subtle pulsing glow effect */}
              <motion.div 
                animate={{ 
                  opacity: flicker ? 0 : [0.2, 0.5, 0.2],
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                className="absolute inset-0 -z-10 bg-red-500/20 blur-3xl"
              />
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="main-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="relative flex min-h-screen flex-col selection:bg-white selection:text-background"
          >
            {/* Fixed Interactive Background */}
            <div className={cn(
              "fixed inset-0 z-0 transition-all",
              (activeTab === "home" && isButtonHovered) 
                ? "filter grayscale-[100%] contrast-[1.25] brightness-[0.75] duration-[1200ms] ease-out" 
                : "duration-[2500ms] ease-out"
            )}>
              <GrassField />
              {/* Subtle overlay */}
              <div className="absolute inset-0 bg-black/20 pointer-events-none" />
            </div>

            {/* Hero Section Container */}
            <div className="relative h-[85vh] w-full lg:h-screen">

              {/* Navigation Bar */}
              <nav className={cn(
                "absolute top-0 left-0 right-0 z-50 w-full px-6 py-8 md:px-12 transition-all",
                (activeTab === "home" && isButtonHovered) 
                  ? "filter grayscale-[100%] brightness-[0.8] duration-[1200ms] ease-out" 
                  : "duration-[2500ms] ease-out"
              )}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img 
                      src="https://i.ibb.co/ksH2WLYk/THE-PRODUCED-LOGO-RED.png" 
                      alt="Produced Logo" 
                      className="h-10 w-auto object-contain md:h-14"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Desktop Menu */}
                  <div className="hidden items-center gap-12 lg:flex">
                    <button 
                      onClick={() => setActiveTab("home")}
                      className={cn(
                        "text-sm font-medium tracking-wide transition-colors hover:text-muted-foreground",
                        activeTab === "home" ? "text-foreground" : "text-muted-foreground/80"
                      )}
                    >
                      Home
                    </button>
                    <button 
                      onClick={() => setActiveTab("studio")}
                      className={cn(
                        "text-sm font-medium tracking-wide transition-colors hover:text-muted-foreground",
                        activeTab === "studio" ? "text-foreground" : "text-muted-foreground/80"
                      )}
                    >
                      Studio
                    </button>
                    <a 
                      href="#about" 
                      onClick={handleAboutClick}
                      className="text-sm font-medium tracking-wide text-muted-foreground/80 transition-colors hover:text-muted-foreground"
                    >
                      About
                    </a>
                  </div>

                  {/* Mobile/Tablet Menu Toggle */}
                  <button 
                    className="flex lg:hidden text-foreground"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                  >
                    {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                  </button>

                  <a 
                    href="mailto:theproducedstudio@gmail.com"
                    className="liquid-glass hidden rounded-full px-8 py-3 text-sm font-medium text-foreground transition-transform hover:scale-[1.03] lg:block"
                  >
                    Contact
                  </a>
                </div>

                {/* Mobile/Tablet Menu Overlay */}
                <AnimatePresence>
                  {isMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="absolute left-0 right-0 top-full mt-4 flex flex-col items-center gap-8 bg-black/95 px-6 py-16 backdrop-blur-2xl lg:hidden"
                    >
                      <button 
                        className={cn(
                          "text-xl font-medium",
                          activeTab === "home" ? "text-foreground" : "text-muted-foreground/80"
                        )}
                        onClick={() => { setActiveTab("home"); setIsMenuOpen(false); }}
                      >
                        Home
                      </button>
                      <button 
                        className={cn(
                          "text-xl font-medium",
                          activeTab === "studio" ? "text-foreground" : "text-muted-foreground/80"
                        )}
                        onClick={() => { setActiveTab("studio"); setIsMenuOpen(false); }}
                      >
                        Studio
                      </button>
                      <a 
                        href="#about" 
                        className="text-xl font-medium text-muted-foreground/80"
                        onClick={handleAboutClickMobile}
                      >
                        About
                      </a>
                      <a 
                        href="mailto:theproducedstudio@gmail.com"
                        className="liquid-glass mt-6 w-full rounded-full py-5 text-center text-lg font-medium text-foreground"
                      >
                        Contact
                      </a>
                    </motion.div>
                  )}
                </AnimatePresence>
              </nav>

              {activeTab === "home" ? (
                <>
                  {/* Hero Content - Centered entry button (lowered slightly) */}
                  <main className="relative z-10 flex h-full flex-col items-center justify-center px-8 text-center">
                    <div className="max-w-6xl translate-y-[104px]">
                      <button 
                        onClick={() => setActiveTab("studio")}
                        onMouseEnter={() => setIsButtonHovered(true)}
                        onMouseLeave={() => setIsButtonHovered(false)}
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
                </>
              ) : (
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
              )}
            </div>



            {activeTab === "studio" && (
              <section className="relative z-10 bg-transparent px-6 py-24 md:px-12">
                <div className="mx-auto max-w-screen-2xl">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12">
                    {[
                      { url: "https://imglink.cc/cdn/i4VolVOCwH.png", span: "lg:col-span-4 h-[350px]" },
                      { url: "https://imglink.cc/cdn/p-9D0eKdmo.png", span: "lg:col-span-4 h-[350px]" },
                      { url: "https://imglink.cc/cdn/k127j8cU43.png", span: "lg:col-span-4 h-[350px]" },
                      { url: "https://imglink.cc/cdn/YjTe4ZiXr5.png", span: "lg:col-span-6 h-[450px]" },
                      { url: "https://imglink.cc/cdn/Y4_62nUHLs.png", span: "lg:col-span-6 h-[450px]" },
                      { url: "https://imglink.cc/cdn/FYBooA1NNV.png", span: "lg:col-span-4 h-[350px]" },
                      { url: "https://imglink.cc/cdn/9ze7x1WG95.png", span: "lg:col-span-4 h-[350px]" },
                      { url: "https://imglink.cc/cdn/ILU0UtwJCg.png", span: "lg:col-span-4 h-[350px]" },
                      { url: "https://imglink.cc/cdn/qXxECeZ0C2.png", span: "lg:col-span-7 h-[500px]" },
                      { url: "https://imglink.cc/cdn/qx4sGUX1wq.png", span: "lg:col-span-5 h-[500px]" },
                      { url: "https://imglink.cc/cdn/VHNeQLJedx.png", span: "lg:col-span-5 h-[450px]" },
                      { url: "https://imglink.cc/cdn/Rc_KJMFdyJ.png", span: "lg:col-span-7 h-[450px]" },
                      { url: "https://imglink.cc/cdn/B5ZEUqV4_z.png", span: "lg:col-span-4 h-[400px]" },
                      { url: "https://imglink.cc/cdn/Z4THW8pMu3.png", span: "lg:col-span-4 h-[400px]", title: "Shadow Play", label: "Special Edition" },
                      { 
                        type: "video", 
                        url: "https://imglink.cc/cdn/Gfmr_WcAAS.mov", 
                        span: "lg:col-span-4 h-[400px]", 
                        title: "The Vision", 
                        label: "Latest Work" 
                      },
                      { url: "https://imglink.cc/cdn/y80-LceSWj.png", span: "lg:col-span-8 h-[550px]" },
                      { 
                        type: "video", 
                        url: "https://player.mux.com/HWhd6N8GWY01PJ005XjQW3j9nDJPqKBr5101UihwRE3WuU?metadata-video-title=The+Call&video-title=The+Call", 
                        thumbnail: "https://image.mux.com/HWhd6N8GWY01PJ005XjQW3j9nDJPqKBr5101UihwRE3WuU/thumbnail.jpg?time=0",
                        span: "lg:col-span-4 h-[550px]", 
                        title: "The Call", 
                        label: "Featured Film" 
                      },
                      { url: "https://imglink.cc/cdn/hWTYlP7XGI.png", span: "lg:col-span-12 h-[700px]", title: "Neon Noir", label: "Project 01" },
                      { url: "https://imglink.cc/cdn/QHnVs04CXH.png", span: "lg:col-span-4 h-[300px]" },
                      { 
                        type: "video", 
                        url: "https://player.mux.com/oX9d02YHnSI7n95TwzzNxjdLWtqP01pIZiAidQSwySpaI?metadata-video-title=The+Chase&video-title=The+Chase", 
                        thumbnail: "https://image.mux.com/oX9d02YHnSI7n95TwzzNxjdLWtqP01pIZiAidQSwySpaI/thumbnail.jpg?time=0",
                        span: "lg:col-span-4 h-[300px]", 
                        title: "The Chase", 
                        label: "Short Film" 
                      },
                      { 
                        type: "video", 
                        url: "https://player.mux.com/teBfiaqKP5kzSdda2ZetxU9nz4dTXNLiXRYSRl4YUnc?metadata-video-title=The+Clash&video-title=The+Clash", 
                        thumbnail: "https://image.mux.com/teBfiaqKP5kzSdda2ZetxU9nz4dTXNLiXRYSRl4YUnc/thumbnail.jpg?time=0",
                        span: "lg:col-span-4 h-[300px]", 
                        title: "The Clash", 
                        label: "Cinematic" 
                      },
                      { url: "https://imglink.cc/cdn/dbAYmRkrxD.png", span: "lg:col-span-6 h-[500px]", title: "Ethereal Planes", label: "Project 02" },
                      { url: "https://imglink.cc/cdn/Ww6ZI1SfCY.png", span: "lg:col-span-6 h-[500px]" },
                      { url: "https://imglink.cc/cdn/sdNwHfScgn.png", span: "lg:col-span-4 h-[300px]" },
                      { url: "https://imglink.cc/cdn/CD42-c1O4o.png", span: "lg:col-span-8 h-[300px]" },
                      { url: "https://imglink.cc/cdn/-WbZc0sMQg.png", span: "lg:col-span-4 h-[300px]" },
                      { url: "https://imglink.cc/cdn/Pgaq9urVTq.png", span: "lg:col-span-5 h-[400px]" },
                      { url: "https://imglink.cc/cdn/7AEBBdspSa.jpg", span: "lg:col-span-7 h-[400px]" },
                      { url: "https://imglink.cc/cdn/z3dNzqcNoi.jpg", span: "lg:col-span-6 h-[350px]" },
                      { url: "https://imglink.cc/cdn/Q3-PjdGrH4.png", span: "lg:col-span-6 h-[350px]" },
                      { url: "https://imglink.cc/cdn/iiWkIbKyBX.png", span: "lg:col-span-12 h-[300px]" }
                    ].map((item, idx) => {
                      const isDirectVideo = item.type === 'video' && (item.url?.toLowerCase().endsWith('.mov') || item.url?.toLowerCase().endsWith('.mp4'));
                      
                      return (
                        <motion.div 
                          key={idx}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: idx * 0.05 }}
                          className={cn(
                            "group relative cursor-pointer overflow-hidden rounded-2xl bg-zinc-900/50",
                            item.span
                          )}
                          onClick={() => {
                            if (item.type === 'video') {
                              setSelectedVideo(item.url || '');
                            } else {
                              setSelectedImage((item as any).url);
                            }
                          }}
                        >
                          {isDirectVideo ? (
                            <video
                              src={item.url}
                              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                              muted
                              playsInline
                              onMouseOver={(e) => (e.target as HTMLVideoElement).play()}
                              onMouseOut={(e) => {
                                const v = (e.target as HTMLVideoElement);
                                v.pause();
                                v.currentTime = 0;
                              }}
                            />
                          ) : (
                            <img 
                              src={item.type === 'video' ? (item as any).thumbnail : (item as any).url} 
                              alt={item.title || `Studio work ${idx + 1}`} 
                              className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                              referrerPolicy="no-referrer"
                            />
                          )}
                          
                          {item.type === 'video' && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-xl transition-all duration-500 group-hover:scale-110 group-hover:bg-white/20">
                                <Play className="ml-1 h-5 w-5 fill-white text-white" />
                              </div>
                            </div>
                          )}

                          <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                          
                          <div className="absolute bottom-8 left-8 translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                            <p className="text-xs font-medium uppercase tracking-widest text-white/60">{item.label || (item.type === 'video' ? 'Film' : 'Project')}</p>
                            <h4 className="mt-2 text-2xl font-medium text-white" style={{ fontFamily: "'Instrument Serif', serif" }}>{item.title || (item.type === 'video' ? 'Video' : 'Untitled')}</h4>
                          </div>
                          
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </section>
            )}

            {/* About Section - Improved Spacing & Framing */}
            {activeTab === "studio" && (
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
                    {/* AI Studio */}
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.1 }}
                      className="group relative aspect-square rounded-[2rem] bg-zinc-900/35 border border-zinc-200/5 backdrop-blur-xl p-6 xs:p-8 sm:p-10 md:p-12 flex flex-col justify-start hover:bg-zinc-900/50 hover:border-zinc-200/10 hover:shadow-[0_0_50px_rgba(250,0,63,0.05)] transition-all duration-500 overflow-hidden"
                    >
                      <div>
                        <span className="font-mono text-[9px] sm:text-xs text-[#FA003F] tracking-[0.25em] font-medium block mb-2 sm:mb-4">01 // PIPELINE</span>
                        <h3 
                          className="text-2xl sm:text-3xl lg:text-4xl text-foreground font-normal tracking-tight group-hover:text-[#FA003F] transition-colors duration-300"
                          style={{ fontFamily: "'Instrument Serif', serif" }}
                        >
                          AI Studio
                        </h3>
                      </div>
                      <p className="text-xl xs:text-2xl sm:text-base md:text-lg lg:text-xl xl:text-2xl leading-normal text-foreground/90 mt-4 sm:mt-6">
                        This is where ideas get their first breath. Our AI Studio is not a tool—it's an environment. 
                        A purpose-built creative space where generative models are curated, conditioned, and directed by human sensibility. 
                        We don't hand you a prompt box. We build a visual language around your project, fine-tuning outputs until 
                        every frame feels intentional, consistent, and unmistakably yours.
                      </p>
                    </motion.div>

                    {/* Storyboard Pre-Visualization */}
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className="group relative aspect-square rounded-[2rem] bg-zinc-900/35 border border-zinc-200/5 backdrop-blur-xl p-6 xs:p-8 sm:p-10 md:p-12 flex flex-col justify-start hover:bg-zinc-900/50 hover:border-zinc-200/10 hover:shadow-[0_0_50px_rgba(250,0,63,0.05)] transition-all duration-500 overflow-hidden"
                    >
                      <div>
                        <span className="font-mono text-[9px] sm:text-xs text-[#FA003F] tracking-[0.25em] font-medium block mb-2 sm:mb-4">02 // STRATEGY</span>
                        <h3 
                          className="text-2xl sm:text-3xl lg:text-4xl text-foreground font-normal tracking-tight group-hover:text-[#FA003F] transition-colors duration-300"
                          style={{ fontFamily: "'Instrument Serif', serif" }}
                        >
                          Storyboard Pre-Viz
                        </h3>
                      </div>
                      <p className="text-xl xs:text-2xl sm:text-base md:text-lg lg:text-xl xl:text-2xl leading-normal text-foreground/90 mt-4 sm:mt-6">
                        Before a single light is rigged or a location is scouted, the film should already exist in your mind and on the page. 
                        We collapse weeks of traditional pre-production into days, producing full cinematic pre-viz sequences that let 
                        directors make their big decisions before they're expensive. Shot composition, lighting scenarios, and camera movement.
                      </p>
                    </motion.div>

                    {/* Concept Imagery */}
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                      className="group relative aspect-square rounded-[2rem] bg-zinc-900/35 border border-zinc-200/5 backdrop-blur-xl p-6 xs:p-8 sm:p-10 md:p-12 flex flex-col justify-start hover:bg-zinc-900/50 hover:border-zinc-200/10 hover:shadow-[0_0_50px_rgba(250,0,63,0.05)] transition-all duration-500 overflow-hidden"
                    >
                      <div>
                        <span className="font-mono text-[9px] sm:text-xs text-[#FA003F] tracking-[0.25em] font-medium block mb-2 sm:mb-4">03 // CONCEPTUAL</span>
                        <h3 
                          className="text-2xl sm:text-3xl lg:text-4xl text-foreground font-normal tracking-tight group-hover:text-[#FA003F] transition-colors duration-300"
                          style={{ fontFamily: "'Instrument Serif', serif" }}
                        >
                          Concept Imagery
                        </h3>
                      </div>
                      <p className="text-xl xs:text-2xl sm:text-base md:text-lg lg:text-xl xl:text-2xl leading-normal text-foreground/90 mt-4 sm:mt-6">
                        The hardest thing to sell is a feeling. We make it visible. From campaign pitches to full feature development, 
                        we generate and iterate on concept art, mood boards, character studies, and world environments, giving 
                        stakeholders something real to react to before a single frame is committed to production. Ideation at the speed of thought.
                      </p>
                    </motion.div>

                    {/* Video Direction */}
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                      className="group relative aspect-square rounded-[2rem] bg-zinc-900/35 border border-zinc-200/5 backdrop-blur-xl p-6 xs:p-8 sm:p-10 md:p-12 flex flex-col justify-start hover:bg-zinc-900/50 hover:border-zinc-200/10 hover:shadow-[0_0_50px_rgba(250,0,63,0.05)] transition-all duration-500 overflow-hidden"
                    >
                      <div>
                        <span className="font-mono text-[9px] sm:text-xs text-[#FA003F] tracking-[0.25em] font-medium block mb-2 sm:mb-4">04 // DIRECTION</span>
                        <h3 
                          className="text-2xl sm:text-3xl lg:text-4xl text-foreground font-normal tracking-tight group-hover:text-[#FA003F] transition-colors duration-300"
                          style={{ fontFamily: "'Instrument Serif', serif" }}
                        >
                          Video Direction
                        </h3>
                      </div>
                      <p className="text-xl xs:text-2xl sm:text-base md:text-lg lg:text-xl xl:text-2xl leading-normal text-foreground/90 mt-4 sm:mt-6">
                        From treatment to final cut, we direct with AI woven into the entire pipeline, not bolted on at the end. 
                        We develop treatments illustrated with AI-rendered reference imagery, supervise production informed by pre-viz, 
                        and guide post-production with AI-assisted color, compositing, and motion.
                      </p>
                    </motion.div>
                  </div>
                </div>
              </section>
            )}

            {/* Page extension spacer to push the footer down by 6 inches */}
            <div className="relative z-10 h-[6in] w-full" />

            {/* Footer / Bottom details */}
            <div className={cn(
              "relative z-10 px-8 py-12 transition-all",
              (activeTab === "home" && isButtonHovered) 
                ? "filter grayscale-[100%] duration-[1200ms] ease-out" 
                : "duration-[2500ms] ease-out"
            )}>
              <div className="mx-auto flex max-w-7xl items-center gap-4">
                <div className="h-[1px] w-8 bg-muted-foreground" />
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Est. 2026 — Built for the quiet ones
                </p>
              </div>
            </div>

            {/* Blank Red Footer */}
            <div 
              id="blank-brand-footer"
              className={cn(
                "relative z-10 w-full bg-[#FA003F] h-[3in] flex items-center justify-between pl-2 md:pl-4 pr-8 md:pr-16 transition-all overflow-hidden",
                (activeTab === "home" && isButtonHovered) 
                  ? "filter grayscale-[100%] duration-[1200ms] ease-out" 
                  : "duration-[2500ms] ease-out"
              )}
            >
              <img 
                src="https://imglink.cc/cdn/XbDN_VXquQ.svg" 
                alt="Footer Graphic" 
                className="h-[2.4in] w-auto object-contain flex-shrink-0"
                referrerPolicy="no-referrer"
              />

              {/* Creative Studio Footer Content on the Right */}
              <div className="hidden sm:flex items-center h-full flex-shrink-0 mr-12 md:mr-32 lg:mr-48">
                <div className="flex gap-16 text-right">
                  {/* Studio Link */}
                  <div className="flex flex-col gap-1.5">
                    <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/50 mb-0.5">Explore</p>
                    <a 
                      href="#studio" 
                      onClick={(e) => { 
                        e.preventDefault(); 
                        setActiveTab("studio"); 
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="font-sans text-sm font-semibold text-white hover:text-white/80 transition-colors hover:underline underline-offset-4"
                    >
                      Studio
                    </a>
                  </div>

                  {/* Contact Link */}
                  <div className="flex flex-col gap-1.5">
                    <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/50 mb-0.5">Contact</p>
                    <a 
                      href="mailto:theproducedstudio@gmail.com" 
                      className="font-sans text-sm font-semibold text-white hover:text-white/80 transition-colors hover:underline underline-offset-4"
                    >
                      Get in touch
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video Lightbox Overlay */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 p-4 backdrop-blur-xl md:p-12"
            onClick={() => setSelectedVideo(null)}
          >
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute right-8 top-8 z-[210] text-white/60 transition-colors hover:text-white"
              onClick={(e) => { e.stopPropagation(); setSelectedVideo(null); }}
            >
              <X size={40} strokeWidth={1} />
            </motion.button>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative aspect-video w-full max-w-6xl overflow-hidden rounded-2xl shadow-2xl bg-black"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedVideo?.toLowerCase().endsWith('.mov') || selectedVideo?.toLowerCase().endsWith('.mp4') ? (
                <video
                  src={selectedVideo}
                  className="h-full w-full"
                  controls
                  autoPlay
                />
              ) : (
                <iframe
                  src={selectedVideo || ''}
                  className="h-full w-full border-0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox Overlay */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 p-4 backdrop-blur-xl md:p-12"
            onClick={() => setSelectedImage(null)}
          >
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute right-8 top-8 z-[210] text-white/60 transition-colors hover:text-white"
              onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}
            >
              <X size={40} strokeWidth={1} />
            </motion.button>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative max-h-full max-w-full overflow-hidden rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={selectedImage} 
                alt="Full frame view" 
                className="max-h-[85vh] w-auto object-contain md:max-h-[90vh]"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
