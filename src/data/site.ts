/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/** Central place for brand assets, copy, and gallery content. */

export const BRAND = {
  name: "The Produced",
  red: "#FA003F",
  logoRed: "https://i.ibb.co/ksH2WLYk/THE-PRODUCED-LOGO-RED.png",
  logoFlicker: "https://imglink.cc/cdn/vSFMkujUJV.png",
  footerGraphic: "https://imglink.cc/cdn/XbDN_VXquQ.svg",
  contactEmail: "theproducedstudio@gmail.com",
  tagline: "Est. 2026 — Built for the quiet ones",
} as const;

/**
 * The films that head the studio grid, shown side by side above the tiles.
 *
 * Each carries its true aspect ratio and is laid out at a width proportional
 * to it, so the pair lands on exactly the same height with neither one
 * letterboxed. Forcing a shared tile shape instead pillarboxes the odd one
 * out, and the player fills that dead space with white — very visible against
 * this page.
 */
export const FEATURED_VIDEOS = [
  {
    src: "https://player.vimeo.com/video/1209343360?badge=0&autopause=0&player_id=0&app_id=58479&title=0&byline=0&portrait=0",
    title: "Tribal",
    ratio: 3990 / 1716,
  },
  {
    src: "https://player.vimeo.com/video/1213123690?badge=0&autopause=0&player_id=0&app_id=58479&title=0&byline=0&portrait=0",
    title: "F1 Spec Edit 2",
    ratio: 16 / 9,
  },
  {
    src: "https://player.vimeo.com/video/1216385603?badge=0&autopause=0&player_id=0&app_id=58479&title=0&byline=0&portrait=0",
    title: "Skate",
    ratio: 16 / 9,
  },
] as const;

export interface NavItem {
  name: "Home" | "Studio" | "About";
  href: string;
  description: string;
}

export const NAV_ITEMS: NavItem[] = [
  { name: "Home", href: "/", description: "[0]" },
  { name: "Studio", href: "/studio", description: "[1]" },
  { name: "About", href: "/about", description: "[2]" },
];

export interface MethodCard {
  tag: string;
  title: string;
  body: string;
}

export const METHOD_CARDS: MethodCard[] = [
  {
    tag: "01 // PIPELINE",
    title: "AI Studio",
    body:
      "This is where ideas get their first breath. Our AI Studio is not a tool—it's an environment. " +
      "A purpose-built creative space where generative models are curated, conditioned, and directed by human sensibility. " +
      "We don't hand you a prompt box. We build a visual language around your project, fine-tuning outputs until " +
      "every frame feels intentional, consistent, and unmistakably yours.",
  },
  {
    tag: "02 // STRATEGY",
    title: "Storyboard Pre-Viz",
    body:
      "Before a single light is rigged or a location is scouted, the film should already exist in your mind and on the page. " +
      "We collapse weeks of traditional pre-production into days, producing full cinematic pre-viz sequences that let " +
      "directors make their big decisions before they're expensive. Shot composition, lighting scenarios, and camera movement.",
  },
  {
    tag: "03 // CONCEPTUAL",
    title: "Concept Imagery",
    body:
      "The hardest thing to sell is a feeling. We make it visible. From campaign pitches to full feature development, " +
      "we generate and iterate on concept art, mood boards, character studies, and world environments, giving " +
      "stakeholders something real to react to before a single frame is committed to production. Ideation at the speed of thought.",
  },
  {
    tag: "04 // DIRECTION",
    title: "Video Direction",
    body:
      "From treatment to final cut, we direct with AI woven into the entire pipeline, not bolted on at the end. " +
      "We develop treatments illustrated with AI-rendered reference imagery, supervise production informed by pre-viz, " +
      "and guide post-production with AI-assisted color, compositing, and motion.",
  },
];

export interface GalleryItem {
  type?: "image" | "video";
  url: string;
  span: string;
  thumbnail?: string;
  title?: string;
  label?: string;
}

export const GALLERY_ITEMS: GalleryItem[] = [
  // Latest set — sits directly under the featured film. Portraits run four
  // across, then the wider frames step down in pairs.
  { url: "https://imglink.cc/cdn/h7Iy--h5be.jpg", span: "lg:col-span-3 h-[500px]" },
  { url: "https://imglink.cc/cdn/G0Xq_l79_f.jpg", span: "lg:col-span-3 h-[500px]" },
  { url: "https://imglink.cc/cdn/FDKXecw5zG.jpg", span: "lg:col-span-3 h-[500px]" },
  { url: "https://imglink.cc/cdn/-7l6vRZ0Hb.jpg", span: "lg:col-span-3 h-[500px]" },
  { url: "https://imglink.cc/cdn/PDOSgNYwfo.jpg", span: "lg:col-span-4 h-[300px]" },
  { url: "https://imglink.cc/cdn/Z76TUqmS73.jpg", span: "lg:col-span-4 h-[300px]" },
  { url: "https://imglink.cc/cdn/KmUsheEssh.jpg", span: "lg:col-span-4 h-[300px]" },
  { url: "https://imglink.cc/cdn/P3RDPdx1ns.jpg", span: "lg:col-span-6 h-[450px]" },
  { url: "https://imglink.cc/cdn/NRb1t92JR6.jpg", span: "lg:col-span-6 h-[450px]" },

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
    label: "Latest Work",
  },
  // 7 highly curated cinematic pieces positioned in the center of the grid sequence
  { url: "https://imglink.cc/cdn/hbQLjFyZQa.png", span: "lg:col-span-4 h-[350px]" },
  { url: "https://imglink.cc/cdn/o6Oe4mAz2a.png", span: "lg:col-span-4 h-[350px]" },
  { url: "https://imglink.cc/cdn/EXJTwSqTVf.png", span: "lg:col-span-4 h-[350px]" },
  { url: "https://imglink.cc/cdn/yMCZgaiHVS.png", span: "lg:col-span-6 h-[400px]" },
  { url: "https://imglink.cc/cdn/kch-jo82xs.png", span: "lg:col-span-6 h-[400px]" },
  { url: "https://imglink.cc/cdn/znyg-gAHAO.png", span: "lg:col-span-8 h-[450px]" },
  { url: "https://imglink.cc/cdn/InPChUhFq6.png", span: "lg:col-span-4 h-[450px]" },
  { url: "https://imglink.cc/cdn/y80-LceSWj.png", span: "lg:col-span-8 h-[550px]" },
  {
    type: "video",
    url: "https://player.mux.com/HWhd6N8GWY01PJ005XjQW3j9nDJPqKBr5101UihwRE3WuU?metadata-video-title=The+Call&video-title=The+Call",
    thumbnail: "https://image.mux.com/HWhd6N8GWY01PJ005XjQW3j9nDJPqKBr5101UihwRE3WuU/thumbnail.jpg?time=0",
    span: "lg:col-span-4 h-[550px]",
    title: "The Call",
    label: "Featured Film",
  },
  { url: "https://imglink.cc/cdn/hWTYlP7XGI.png", span: "lg:col-span-12 h-[700px]", title: "Neon Noir", label: "Project 01" },
  { url: "https://imglink.cc/cdn/QHnVs04CXH.png", span: "lg:col-span-4 h-[300px]" },
  {
    type: "video",
    url: "https://player.mux.com/oX9d02YHnSI7n95TwzzNxjdLWtqP01pIZiAidQSwySpaI?metadata-video-title=The+Chase&video-title=The+Chase",
    thumbnail: "https://image.mux.com/oX9d02YHnSI7n95TwzzNxjdLWtqP01pIZiAidQSwySpaI/thumbnail.jpg?time=0",
    span: "lg:col-span-4 h-[300px]",
    title: "The Chase",
    label: "Short Film",
  },
  {
    type: "video",
    url: "https://player.mux.com/teBfiaqKP5kzSdda2ZetxU9nz4dTXNLiXRYSRl4YUnc?metadata-video-title=The+Clash&video-title=The+Clash",
    thumbnail: "https://image.mux.com/teBfiaqKP5kzSdda2ZetxU9nz4dTXNLiXRYSRl4YUnc/thumbnail.jpg?time=0",
    span: "lg:col-span-4 h-[300px]",
    title: "The Clash",
    label: "Cinematic",
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
  { url: "https://imglink.cc/cdn/iiWkIbKyBX.png", span: "lg:col-span-12 h-[300px]" },
];

/**
 * The studio grid split by tab. Spans in GALLERY_ITEMS were composed around
 * mixed rows of stills and films, so the video tab re-spans its four films
 * into an even two-by-two; the stills keep their original rhythm.
 */
const VIDEO_TAB_SPAN = "lg:col-span-6 h-[450px]";

export const VIDEO_ITEMS: GalleryItem[] = GALLERY_ITEMS.filter(
  (item) => item.type === "video"
).map((item) => ({ ...item, span: VIDEO_TAB_SPAN }));

export const IMAGE_ITEMS: GalleryItem[] = GALLERY_ITEMS.filter(
  (item) => item.type !== "video"
);

/** True when the item links to a raw video file rather than an embedded player. */
export const isDirectVideoUrl = (url: string | undefined) =>
  !!url && (url.toLowerCase().endsWith(".mov") || url.toLowerCase().endsWith(".mp4"));

/**
 * How many image tiles to warm ahead of time — the first row of the images
 * tab. The rest load lazily as they scroll into view.
 *
 * Warming the whole grid would queue ~180MB of full-resolution source files,
 * none of which the landing page even shows: the grid lives behind the Studio
 * tab. The tiles carry `loading="lazy"` and fade in, so anything past the
 * first row costs nothing to defer.
 */
const PRELOAD_TILE_COUNT = 4;

/**
 * Warm the browser cache for branding, the video-tab thumbnails, and the
 * first image tiles during the preloader window so both tabs open instantly.
 */
export function preloadSiteAssets() {
  [BRAND.logoRed, BRAND.logoFlicker].forEach((src) => {
    const img = new Image();
    img.src = src;
  });
  VIDEO_ITEMS.forEach((item) => {
    if (item.thumbnail) {
      const img = new Image();
      img.src = item.thumbnail;
    }
  });
  IMAGE_ITEMS.slice(0, PRELOAD_TILE_COUNT).forEach((item) => {
    const img = new Image();
    img.src = item.url;
  });
}
