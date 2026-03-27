/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [flicker, setFlicker] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"home" | "studio">("home");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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
            className="relative flex min-h-screen flex-col bg-black selection:bg-white selection:text-background"
          >
            {/* Hero Section Container */}
            <div className="relative h-[65vh] w-full overflow-hidden bg-black lg:h-screen">
              {/* Video Background - Absolute within hero so it scrolls away */}
              <div className="absolute inset-0 z-0">
                <iframe
                  src="https://player.mux.com/NMBBSsrAd5SYsg4o9w8Df7FNF1dMeoTnntu93BF4wBA?background=1&autoplay=1&loop=1&muted=1"
                  className="absolute inset-0 h-full w-full object-cover opacity-80 pointer-events-none"
                  allow="autoplay; fullscreen"
                  style={{ border: 'none', width: '100vw', height: '100vh' }}
                />
                {/* Subtle overlay */}
                <div className="absolute inset-0 bg-black/40 pointer-events-none" />
              </div>

              {/* Navigation Bar */}
              <nav className="absolute top-0 left-0 right-0 z-50 w-full px-6 py-8 md:px-12">
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
                    <a href="#about" className="text-sm font-medium tracking-wide text-muted-foreground/80 transition-colors hover:text-muted-foreground">
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
                        onClick={() => setIsMenuOpen(false)}
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
                  {/* Hero Content - Refined Framing */}
                  <main className="relative z-10 flex h-full flex-col items-center justify-center px-8 text-center lg:justify-end lg:pb-56">
                    <div className="max-w-6xl">
                      <h1 
                        className="animate-fade-rise text-4xl font-normal leading-[0.9] tracking-[-0.03em] text-foreground sm:text-7xl lg:text-9xl"
                        style={{ fontFamily: "'Instrument Serif', serif" }}
                      >
                        Where <em className="not-italic text-muted-foreground">vision</em> meets its <br className="hidden lg:block" />
                        <em className="not-italic text-muted-foreground">fullest potential.</em>
                      </h1>

                      {/* Desktop only subtext and button (overlayed) */}
                      <div className="hidden lg:block">
                        <p className="animate-fade-rise-delay mx-auto mt-10 max-w-3xl text-xl leading-relaxed text-foreground/90">
                          We build AI-powered tools for directors, creators, and visual thinkers. 
                          From concept to screen, we produce the imagery that makes ideas undeniable.
                        </p>

                        <button 
                          onClick={() => setActiveTab("studio")}
                          className="liquid-glass animate-fade-rise-delay-2 mt-16 cursor-pointer rounded-full px-16 py-6 text-lg font-medium text-foreground transition-transform hover:scale-[1.03]"
                        >
                          Begin Journey
                        </button>
                      </div>
                    </div>
                  </main>
                </>
              ) : (
                <main className="relative z-10 flex h-full flex-col items-center justify-center px-8 text-center">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-4xl"
                  >
                    <h1 
                      className="text-5xl font-normal tracking-tight text-foreground sm:text-7xl"
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

            {activeTab === "home" && (
              <div className="relative z-10 flex flex-col items-center bg-black px-8 py-16 text-center lg:hidden">
                <p className="animate-fade-rise-delay max-w-2xl text-base leading-relaxed text-foreground/90">
                  We build AI-powered tools for directors, creators, and visual thinkers. 
                  From concept to screen, we produce the imagery that makes ideas undeniable.
                </p>

                <button 
                  onClick={() => setActiveTab("studio")}
                  className="liquid-glass animate-fade-rise-delay-2 mt-10 cursor-pointer rounded-full px-12 py-5 text-base font-medium text-foreground transition-transform hover:scale-[1.03]"
                >
                  Begin Journey
                </button>
              </div>
            )}

            {activeTab === "studio" && (
              <section className="relative z-10 bg-black px-6 py-24 md:px-12">
                <div className="mx-auto max-w-screen-2xl">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12">
                    {[
                      { url: "https://imglink.cc/cdn/hWTYlP7XGI.png", span: "lg:col-span-8 lg:row-span-2 h-[500px]", title: "Neon Noir", label: "Project 01" },
                      { url: "https://imglink.cc/cdn/QHnVs04CXH.png", span: "lg:col-span-4 lg:row-span-1 h-[242px]" },
                      { url: "https://imglink.cc/cdn/y80-LceSWj.png", span: "lg:col-span-4 lg:row-span-1 h-[242px]" },
                      { url: "https://imglink.cc/cdn/dbAYmRkrxD.png", span: "lg:col-span-6 lg:row-span-2 h-[500px]", title: "Ethereal Planes", label: "Project 02" },
                      { url: "https://imglink.cc/cdn/Ww6ZI1SfCY.png", span: "lg:col-span-6 lg:row-span-2 h-[500px]" },
                      { url: "https://imglink.cc/cdn/sdNwHfScgn.png", span: "lg:col-span-4 lg:row-span-1 h-[242px]" },
                      { url: "https://imglink.cc/cdn/CD42-c1O4o.png", span: "lg:col-span-8 lg:row-span-1 h-[242px]" },
                      { url: "https://imglink.cc/cdn/-WbZc0sMQg.png", span: "lg:col-span-12 lg:row-span-2 h-[600px]" },
                      { url: "https://imglink.cc/cdn/Pgaq9urVTq.png", span: "lg:col-span-5 lg:row-span-1 h-[242px]" },
                      { url: "https://imglink.cc/cdn/7AEBBdspSa.jpg", span: "lg:col-span-7 lg:row-span-1 h-[242px]" },
                      { url: "https://imglink.cc/cdn/z3dNzqcNoi.jpg", span: "lg:col-span-6 lg:row-span-1 h-[242px]" },
                      { url: "https://imglink.cc/cdn/Q3-PjdGrH4.png", span: "lg:col-span-6 lg:row-span-1 h-[242px]" },
                      { url: "https://imglink.cc/cdn/iiWkIbKyBX.png", span: "lg:col-span-12 lg:row-span-1 h-[300px]" },
                      { url: "https://imglink.cc/cdn/vgeGgHT7na.png", span: "lg:col-span-7 lg:row-span-1 h-[242px]" },
                      { url: "https://imglink.cc/cdn/BwuVWNd3Xr.png", span: "lg:col-span-5 lg:row-span-1 h-[242px]" }
                    ].map((item, idx) => (
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
                        onClick={() => setSelectedImage(item.url)}
                      >
                        <img 
                          src={item.url} 
                          alt={`Studio work ${idx + 1}`} 
                          className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                        {item.title && (
                          <div className="absolute bottom-8 left-8 translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                            <p className="text-xs font-medium uppercase tracking-widest text-white/60">{item.label}</p>
                            <h4 className="mt-2 text-2xl font-medium text-white" style={{ fontFamily: "'Instrument Serif', serif" }}>{item.title}</h4>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* About Section - Improved Spacing & Framing */}
            <section id="about" className="relative z-10 bg-black px-8 py-32 md:px-16 md:py-64">
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

                <div className="grid gap-16 md:grid-cols-2 md:gap-24 lg:gap-32">
                  {/* AI Studio */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                  >
                    <h3 
                      className="mb-4 text-2xl text-muted-foreground"
                      style={{ fontFamily: "'Instrument Serif', serif" }}
                    >
                      AI Studio
                    </h3>
                    <p className="text-base leading-relaxed text-foreground/70">
                      This is where ideas get their first breath. Our AI Studio is not a tool it's an environment. 
                      A purpose-built creative space where generative models are curated, conditioned, and directed by human sensibility. 
                      We don't hand you a prompt box. We build a visual language around your project, fine-tuning outputs until 
                      every frame feels intentional, consistent, and unmistakably yours. The machine learns your aesthetic. 
                      Then it works for it.
                    </p>
                  </motion.div>

                  {/* Storyboard Pre-Visualization */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    <h3 
                      className="mb-4 text-2xl text-muted-foreground"
                      style={{ fontFamily: "'Instrument Serif', serif" }}
                    >
                      Storyboard Pre-Visualization
                    </h3>
                    <p className="text-base leading-relaxed text-foreground/70">
                      Before a single light is rigged or a location is scouted, the film should already exist in your mind and on the page. 
                      We collapse weeks of traditional pre-production into days, producing full cinematic pre-viz sequences that let 
                      directors make their big decisions before they're expensive. Shot composition. Camera movement. 
                      Lighting scenarios. Action beats. Rendered at near-photographic fidelity, so what arrives on set is confidence.
                    </p>
                  </motion.div>

                  {/* Concept Imagery */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                  >
                    <h3 
                      className="mb-4 text-2xl text-muted-foreground"
                      style={{ fontFamily: "'Instrument Serif', serif" }}
                    >
                      Concept Imagery
                    </h3>
                    <p className="text-base leading-relaxed text-foreground/70">
                      The hardest thing to sell is a feeling. We make it visible. From campaign pitches to full feature development, 
                      we generate and iterate on concept art, mood boards, character studies, and world environments giving 
                      stakeholders something real to react to before a single frame is committed to production. 
                      Ideation at the speed of thought. Refinement at the pace of conversation.
                    </p>
                  </motion.div>

                  {/* Video Direction */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  >
                    <h3 
                      className="mb-4 text-2xl text-muted-foreground"
                      style={{ fontFamily: "'Instrument Serif', serif" }}
                    >
                      Video Direction
                    </h3>
                    <p className="text-base leading-relaxed text-foreground/70">
                      From treatment to final cut, we direct with AI woven into the entire pipeline not bolted on at the end. 
                      We develop treatment documents illustrated with AI-rendered reference imagery. We supervise production 
                      informed by pre-viz. We guide post with AI-assisted color, compositing, and motion to ensure the story 
                      that was conceived is the story that gets told. Every decision made earlier. Every vision delivered cleaner.
                    </p>
                  </motion.div>
                </div>
              </div>
            </section>

            {/* Footer / Bottom details */}
            <div className="relative z-10 px-8 py-12">
              <div className="mx-auto flex max-w-7xl items-center gap-4">
                <div className="h-[1px] w-8 bg-muted-foreground" />
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Est. 2026 — Built for the quiet ones
                </p>
              </div>
            </div>
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
