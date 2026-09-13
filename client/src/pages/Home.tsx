import UpdatedGame from "@/components/bright/UpdatedGame";
import { useState, useEffect, useRef, useMemo, type ReactElement, type CSSProperties } from "react";
import { motion, useInView } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";
import {
  // Moon,  // unused — theme toggle hidden
  // Sun,   // unused — theme toggle hidden
  Sparkles,
  Mail,
  Globe,
  ChevronDown,
  Play,
  Github,
  Linkedin,
} from "lucide-react";

// Journey chapters data with exact content
const journeyChapters: { emoji: string; title: string; date: string; subtitle: string; story: string; sparkle: boolean; floatingEmojis: string[]; achievements?: string[] }[] = [
  {
    emoji: "🏫",
    title: "Where It All Started",
    date: "September 2020",
    subtitle: "Mechanical Engineering at AUM",
    story: "I started at AUM as a Mechanical Engineering student.",
    sparkle: false,
    floatingEmojis: ["📐", "🔩", "📚"],
  },
  {
    emoji: "💻",
    title: "My First Line of Code",
    date: "August 2022",
    subtitle: "CODED Web Development Bootcamp",
    story: "Curiosity led me to CODED's Web Development Bootcamp, where I built my first website and wrote my first lines of code. I was completely hooked. ✨",
    sparkle: false,
    floatingEmojis: ["🌐", "🎨", "⌨️"],
  },
  {
    emoji: "🔄",
    title: "The Pivot",
    date: "September 2022",
    subtitle: "Changing My Major",
    story: "The more I learned about technology, the more interested I became in Computer Engineering. So, I decided to switch from Mechanical Engineering to Computer Engineering.",
    sparkle: true,
    floatingEmojis: ["💫", "🔮", "✨"],
  },
  {
    emoji: "👩‍🏫",
    title: "From Learning to Teaching",
    date: "October 2022 – May 2023",
    subtitle: "Student Mentor at CODED",
    story: "A few months later, I returned to CODED as a Student Mentor, going from learning programming myself to helping others uncover the magic of it. ✨",
    sparkle: false,
    floatingEmojis: ["💡", "📝", "🌟"],
  },
  {
    emoji: "🌐",
    title: "Joining AUM's First Google Developer Student Club",
    date: "September 2022 – May 2023",
    subtitle: "Core Member & Web Development Mentor",
    story: "I joined AUM's first Google Developer Student Club, where I taught web development and helped with workshops in mobile development and cybersecurity.",
    sparkle: false,
    floatingEmojis: ["🌍", "🎯", "👥"],
  },
  {
    emoji: "🚀",
    title: "AI Meets Entrepreneurship",
    date: "September 2023 – June 2024",
    subtitle: "UC Berkeley AI & Entrepreneurship Program",
    story: "I was selected among the Top 50 students for the program, where my team created EVA, our AI-powered graduation project. EVA went on to win four awards in Kuwait, regionally, and globally. 🏆✨",
    sparkle: true,
    floatingEmojis: ["🤖", "🏆", "💡"],
  },
  {
    emoji: "🔐",
    title: "Exploring Cybersecurity",
    date: "September 2024 – Present",
    subtitle: "From Curiosity to CTFs",
    story: "A friend introduced me to cybersecurity, leading me to CTFs, Hack The Box, WiCSME, and Google's Foundations of Cybersecurity certification.",
    sparkle: false,
    floatingEmojis: ["🛡️", "🔓", "🕵️"],
  },
  {
    emoji: "🎓",
    title: "My Graduation Project",
    date: "January 2024 – June 2025",
    subtitle: "AI for Healthcare",
    story: "My team and I developed EpiCare, an AI platform for personalized epilepsy treatments, and Hayat, its intelligent assistant, in collaboration with Al-Sabah Hospital and Vivus Clinic.\n\nIn June 2025, I graduated from AUM with Honors in Computer Engineering. ✨",
    sparkle: true,
    floatingEmojis: ["🩺", "🎓", "🏆"],
  },
  {
    emoji: "❤️",
    title: "Teaching the Next Generation",
    date: "June 2025 – August 2025",
    subtitle: "Sharing What I Love",
    story: "I joined CODED to teach AI, Python, Robotics, Mobile Development, and Entrepreneurship to students across different ages, from 5-year-olds to university graduates.\n\nHelping others discover the same excitement I felt when I first started never gets old. ✨",
    sparkle: false,
    floatingEmojis: ["🌱", "🤖", "📚"],
  },
  {
    emoji: "🤖",
    title: "The Next Chapter",
    date: "September 2025 – Present",
    subtitle: "Master's in Data Science & AI",
    story: "I'm now pursuing my Master's in Data Science and AI, researching AI for Healthcare while continuing to explore Agentic AI, cybersecurity, and new technologies. 🚀",
    sparkle: true,
    floatingEmojis: ["🌌", "💭", "⭐"],
  },
];

const skills = [
  { name: "Artificial Intelligence", emoji: "🧠", category: "AI/ML" },
  { name: "Agentic AI", emoji: "🤖", category: "AI/ML" },
  { name: "Multimodal Training", emoji: "🔄", category: "AI/ML" },
  { name: "Machine Learning", emoji: "⚡", category: "AI/ML" },
  { name: "Computer Vision", emoji: "👁️", category: "AI/ML" },
  { name: "Python Programming", emoji: "🐍", category: "Programming" },
  { name: "React Development", emoji: "⚛️", category: "Frontend" },
  { name: "Web Development", emoji: "🌐", category: "Frontend" },
  { name: "UI/UX Design", emoji: "🎨", category: "Design" },
  { name: "Django & FastAPI", emoji: "🔧", category: "Backend" },
  { name: "Healthcare AI", emoji: "💊", category: "Specialized" },
  { name: "Data Analysis", emoji: "📊", category: "Analytics" },
  { name: "Cybersecurity", emoji: "🔒", category: "Security" },
  { name: "Entrepreneurship", emoji: "🚀", category: "Business" },
  { name: "Strategic Planning", emoji: "📋", category: "Business" },
  { name: "Digital Marketing", emoji: "📱", category: "Business" },
  { name: "Communication", emoji: "🗣️", category: "Soft Skills" },
  { name: "Public Speaking", emoji: "🎤", category: "Soft Skills" },
  { name: "Education & Training", emoji: "👩‍🏫", category: "Teaching" },
  { name: "Mentorship", emoji: "🤝", category: "Teaching" },
  { name: "Leadership", emoji: "👥", category: "Soft Skills" },
  { name: "Adaptability", emoji: "🔄", category: "Soft Skills" },
  { name: "Innovation", emoji: "💡", category: "Soft Skills" },
  { name: "Problem Solving", emoji: "🧩", category: "Soft Skills" },
];

// Multi-color sparkle palette for card surroundings (no yellow/orange)
const cardSparkleColors = [
  "#ffffff", "#e9d5ff", "#a78bfa", "#f0abfc",
  "#93c5fd", "#c4b5fd", "#d8b4fe", "#fb7185",
  "#c084fc", "#38bdf8", "#f9a8d4", "#a5f3fc",
];

// 4-point star sparkle data — varied colors, drifting across the page
const starSparkleData = [
  { left: "7%",  top: "12%", color: "#FF8B68", size: 22, anim: "star-drift-1", dur: "14s",  delay: "0s"    },
  { left: "23%", top: "38%", color: "#a78bfa", size: 20, anim: "star-drift-2", dur: "18s",  delay: "3.5s"  },
  { left: "41%", top: "72%", color: "#FFD774", size: 27, anim: "star-drift-3", dur: "22s",  delay: "1.2s"  },
  { left: "57%", top: "22%", color: "#f0abfc", size: 21, anim: "star-drift-4", dur: "16s",  delay: "5.5s"  },
  { left: "69%", top: "58%", color: "#93c5fd", size: 24, anim: "star-drift-5", dur: "20s",  delay: "2.3s"  },
  { left: "82%", top: "33%", color: "#6ee7b7", size: 20, anim: "star-drift-6", dur: "13s",  delay: "7.1s"  },
  { left: "91%", top: "54%", color: "#fbbf24", size: 23, anim: "star-drift-1", dur: "19s",  delay: "4.2s"  },
  { left: "14%", top: "82%", color: "#fb7185", size: 25, anim: "star-drift-3", dur: "15s",  delay: "6.8s"  },
  { left: "48%", top: "88%", color: "#c084fc", size: 21, anim: "star-drift-2", dur: "21s",  delay: "9.4s"  },
  { left: "76%", top: "83%", color: "#38bdf8", size: 22, anim: "star-drift-5", dur: "17s",  delay: "11.2s" },
];

function PageSparkles() {
  return (
    <div className="hidden md:block fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 3 }}>
      {starSparkleData.map((s, i) => (
        <span
          key={i}
          className="absolute select-none leading-none"
          style={{
            left: s.left,
            top: s.top,
            color: s.color,
            fontSize: `${s.size}px`,
            animation: `${s.anim} ${s.dur} ease-in-out ${s.delay} infinite`,
          }}
        >✦</span>
      ))}
    </div>
  );
}

const journeyThemes = [
  "engineering", "coding", "pivot", "mentoring", "community",
  "entrepreneurship", "cybersecurity", "graduation", "teaching", "future",
];

// Organic left/right offsets — feels designed, not mathematical
const leftOffsets  = ["2%", "7%", "4%", "1%", "5%", "3%", "6%", "2%"];
const rightOffsets = ["5%", "1%", "6%", "3%", "2%", "7%", "4%", "3%"];

function JourneyCard({ chapter, index }: { chapter: (typeof journeyChapters)[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const theme = journeyThemes[index] ?? "future";
  const chapterNum = String(index + 1).padStart(2, "0");

  const isLeft = index % 2 === 0;
  const pairIdx = Math.floor(index / 2);
  const wrapperStyle: React.CSSProperties = isLeft
    ? { marginLeft: leftOffsets[pairIdx % leftOffsets.length], marginRight: "auto" }
    : { marginRight: rightOffsets[pairIdx % rightOffsets.length], marginLeft: "auto" };

  return (
    <motion.div
      ref={ref}
      className="journey-card-wrapper"
      style={wrapperStyle}
      initial={{ opacity: 0, x: isLeft ? -60 : 60 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: isLeft ? -60 : 60 }}
      transition={{ duration: 0.65, ease: [0.22, 0.8, 0.25, 1] }}
    >
      {/* ── Surrounding sparkle stars — spread far outside the card ── */}
      {/* Top edge */}
      <span className="absolute pointer-events-none select-none leading-none animate-[sparkle_3.5s_ease-in-out_infinite]" style={{ top: -18, left: "12%",  fontSize: 14, color: cardSparkleColors[(index + 0) % 12], animationDelay: `${index * 0.15}s` }}>✦</span>
      <span className="absolute pointer-events-none select-none leading-none animate-[sparkle_4s_ease-in-out_infinite]"   style={{ top: -22, left: "48%",  fontSize: 18, color: cardSparkleColors[(index + 3) % 12], animationDelay: `${index * 0.30}s` }}>✦</span>
      <span className="absolute pointer-events-none select-none leading-none animate-[sparkle_3s_ease-in-out_infinite]"   style={{ top: -16, right: "14%", fontSize: 12, color: cardSparkleColors[(index + 6) % 12], animationDelay: `${index * 0.45}s` }}>✦</span>
      {/* Bottom edge */}
      <span className="absolute pointer-events-none select-none leading-none animate-[sparkle_4.5s_ease-in-out_infinite]" style={{ bottom: -20, left: "22%",  fontSize: 16, color: cardSparkleColors[(index + 1) % 12], animationDelay: `${index * 0.20}s` }}>✦</span>
      <span className="absolute pointer-events-none select-none leading-none animate-[sparkle_3.2s_ease-in-out_infinite]" style={{ bottom: -18, right: "20%", fontSize: 13, color: cardSparkleColors[(index + 7) % 12], animationDelay: `${index * 0.55}s` }}>✦</span>
      {/* Left edge */}
      <span className="card-sparkle-side absolute pointer-events-none select-none leading-none animate-[sparkle_3.8s_ease-in-out_infinite]" style={{ top: "18%", left: -28, fontSize: 15, color: cardSparkleColors[(index + 2) % 12], animationDelay: `${index * 0.10}s` }}>✦</span>
      <span className="card-sparkle-side absolute pointer-events-none select-none leading-none animate-[sparkle_4.2s_ease-in-out_infinite]" style={{ top: "62%", left: -24, fontSize: 11, color: cardSparkleColors[(index + 8) % 12], animationDelay: `${index * 0.35}s` }}>✦</span>
      {/* Right edge */}
      <span className="card-sparkle-side absolute pointer-events-none select-none leading-none animate-[sparkle_3.6s_ease-in-out_infinite]" style={{ top: "28%", right: -26, fontSize: 17, color: cardSparkleColors[(index + 4) % 12], animationDelay: `${index * 0.25}s` }}>✦</span>
      <span className="card-sparkle-side absolute pointer-events-none select-none leading-none animate-[sparkle_4.8s_ease-in-out_infinite]" style={{ top: "72%", right: -22, fontSize: 12, color: cardSparkleColors[(index + 9) % 12], animationDelay: `${index * 0.50}s` }}>✦</span>

      {/* Extra stars for milestone cards */}
      {chapter.sparkle && (
        <>
          <span className="absolute pointer-events-none select-none leading-none animate-[sparkle_2.8s_ease-in-out_infinite]" style={{ top: -28,   left: "32%", fontSize: 20, color: cardSparkleColors[(index + 5)  % 12], animationDelay: `${index * 0.18}s` }}>✦</span>
          <span className="absolute pointer-events-none select-none leading-none animate-[sparkle_3.3s_ease-in-out_infinite]" style={{ bottom: -26, left: "55%", fontSize: 18, color: cardSparkleColors[(index + 10) % 12], animationDelay: `${index * 0.38}s` }}>✦</span>
          <span className="card-sparkle-side absolute pointer-events-none select-none leading-none animate-[sparkle_4s_ease-in-out_infinite]"   style={{ top: "45%", left: -36,  fontSize: 16, color: cardSparkleColors[(index + 11) % 12], animationDelay: `${index * 0.60}s` }}>✦</span>
          <span className="card-sparkle-side absolute pointer-events-none select-none leading-none animate-[sparkle_3.5s_ease-in-out_infinite]" style={{ top: "50%", right: -34, fontSize: 19, color: cardSparkleColors[(index + 0)  % 12], animationDelay: `${index * 0.42}s` }}>✦</span>
        </>
      )}

      <article className={`journey-card ${theme}`}>
        {/* Floating background emojis */}
        {chapter.floatingEmojis?.map((em, i) => (
          <span
            key={i}
            className="card-float-emoji" aria-hidden="true"
            style={{
              animationDelay: `${i * 1.1}s`,
              right: i === 0 ? "14px" : i === 1 ? "52px" : "28px",
              top: i === 0 ? "52px" : i === 1 ? "90px" : "130px",
            }}
          >
            {em}
          </span>
        ))}

        {/* Retro window bar */}
        <div className="journey-window-bar">
          <div className="journey-window-title">
            <span className="journey-status-dot" />
            <span>chapter_{chapterNum}.exe</span>
          </div>
          <div className="journey-window-controls" aria-hidden="true">
            <span /><span /><span />
          </div>
        </div>

        {/* Card content */}
        <div className="journey-card-content">
          <div className="flex items-start gap-3 md:gap-4 mb-2 md:mb-3">
            <div className="journey-icon flex-shrink-0">{chapter.emoji}</div>
            <div className="flex-1 min-w-0">
              <h3 className="card-title-glow text-[0.9rem] md:text-xl font-bold leading-tight">{chapter.title}</h3>
              <span className="text-[0.7rem] md:text-sm font-medium dark:text-[#a78bfa] text-purple-500">{chapter.date}</span>
            </div>
          </div>
          <h4 className="card-subtitle-glow text-[0.78rem] md:text-base font-semibold mb-1 md:mb-3 pl-[44px] md:pl-[56px]">{chapter.subtitle}</h4>
          <p className="text-[0.75rem] md:text-[0.92rem] dark:text-[rgba(203,213,225,0.85)] text-gray-600 leading-5 md:leading-7 pl-[44px] md:pl-[56px] whitespace-pre-line">{chapter.story}</p>
          {chapter.achievements && (
            <div className="mt-2 md:mt-4 pl-[44px] md:pl-[56px] flex flex-col gap-1 md:gap-2">
              {chapter.achievements.map((a, i) => (
                <div key={i} className="text-[0.7rem] md:text-sm dark:text-[#e9d5ff] text-purple-800 px-3 py-1 md:px-4 md:py-2 dark:bg-[rgba(139,92,246,0.1)] bg-purple-50 border dark:border-[rgba(139,92,246,0.2)] border-purple-200 rounded-lg md:rounded-xl font-medium">
                  {a}
                </div>
              ))}
            </div>
          )}
        </div>
      </article>
    </motion.div>
  );
}

function SkillItem({ skill, index }: { skill: (typeof skills)[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-30px" });

  return (
    <motion.div
      ref={ref}
      className="skill-item flex items-center gap-3 p-3.5 rounded-2xl dark:bg-[rgba(15,15,46,0.5)] bg-white/60 border dark:border-[rgba(139,92,246,0.1)] border-purple-100 backdrop-blur-sm"
      style={{
        "--float-dur": `${3.0 + (index % 7) * 0.28}s`,
        "--float-delay": `${(index % 9) * 0.22}s`,
      } as React.CSSProperties}
      initial={{ opacity: 0, y: 15 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
      transition={{ duration: 0.4, delay: index * 0.03 }}
    >
      <span className="text-xl">{skill.emoji}</span>
      <div className="flex flex-col">
        <span className="text-sm font-semibold dark:text-[#f5f3ff] text-purple-900">{skill.name}</span>
        <span className="text-xs dark:text-[#a78bfa] text-purple-500">{skill.category}</span>
      </div>
    </motion.div>
  );
}

type DustPoint = {
  x: number; y: number; age: number; maxAge: number;
  size: number; color: string; char: string;
  vx: number; vy: number;
};

// Pixie dust palette — yellows, golds, warm whites
const DUST_PALETTE = [
  "255,245,160", "255,230,100", "255,215,60",
  "255,250,200", "255,200,80",  "255,240,150",
  "255,220,120", "255,255,190", "255,210,90",
];
const DUST_CHARS = ["✦", "✧", "⋆", "·", "✦", "✧", "✨", "·", "✦"];

function ShootingStar() {
  type RenderState = {
    x: number; y: number;
    show: boolean;
    dust: DustPoint[];
  };
  const [render, setRender] = useState<RenderState | null>(null);

  useEffect(() => {
    // Current smoothed position
    const cur = { x: 0, y: 0, initialized: false };
    const dust: DustPoint[] = [];
    let frame = 0;
    let rafId: number;

    // Find whichever journey card is currently in the "reading zone"
    const getTarget = () => {
      const wrappers = Array.from(
        document.querySelectorAll<HTMLElement>(".journey-card-wrapper")
      );
      if (!wrappers.length) return null;

      const viewH = window.innerHeight;
      const readLine = viewH * 0.42; // natural reading eye-line

      let best: HTMLElement | null = null;
      let bestDist = Infinity;

      for (const w of wrappers) {
        const r = w.getBoundingClientRect();
        if (r.bottom < 0 || r.top > viewH) continue; // off-screen
        const center = (r.top + r.bottom) / 2;
        const dist = Math.abs(center - readLine);
        if (dist < bestDist) { bestDist = dist; best = w; }
      }

      if (!best) return null;
      const r = best.getBoundingClientRect();
      // Sit on the card — top-right corner, slightly inset
      return {
        x: r.right  - 38,
        y: r.top    + 44,
      };
    };

    const spawnDust = (x: number, y: number) => {
      const ci = Math.floor(Math.random() * DUST_PALETTE.length);
      const isDot = Math.random() < 0.35;
      dust.push({
        x, y, age: 0,
        maxAge: 45 + Math.floor(Math.random() * 20),
        size: isDot ? 4 + Math.random() * 4 : 8 + Math.random() * 11,
        color: DUST_PALETTE[ci],
        char: isDot ? "·" : DUST_CHARS[ci],
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 1.0 - 0.25,
      });
      while (dust.length > 40) dust.shift();
    };

    const tick = () => {
      frame++;
      const target = getTarget();

      if (target) {
        if (!cur.initialized) {
          cur.x = target.x;
          cur.y = target.y;
          cur.initialized = true;
        }

        const dx = target.x - cur.x;
        const dy = target.y - cur.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Lerp — slow enough to feel like it's drifting
        cur.x += dx * 0.03;
        cur.y += dy * 0.03;

        // Spawn dust only while moving (more than 1px away)
        if (dist > 1 && frame % 2 === 0) spawnDust(cur.x, cur.y);
      }

      // Update & age dust
      for (let i = dust.length - 1; i >= 0; i--) {
        dust[i].x   += dust[i].vx;
        dust[i].y   += dust[i].vy;
        dust[i].age++;
        if (dust[i].age >= dust[i].maxAge) dust.splice(i, 1);
      }

      // Star is always visible once a card is found; never hidden
      setRender(
        cur.initialized
          ? { x: cur.x, y: cur.y, show: !!target || cur.initialized, dust: dust.map(p => ({ ...p })) }
          : null
      );

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  if (!render) return null;

  return (
    <>
      {/* ── Pixie dust trail — yellow/gold tones ── */}
      {render.dust.map((p, i) => {
        const t = p.age / p.maxAge;
        const opacity = t < 0.12 ? t / 0.12 : Math.pow(1 - t, 1.4);
        return (
          <div
            key={i}
            style={{
              position: "fixed",
              left: p.x,
              top:  p.y,
              zIndex: 2000,
              pointerEvents: "none",
              transform: "translate(-50%,-50%)",
              opacity: Math.max(0, opacity),
              fontSize: p.size,
              color: `rgb(${p.color})`,
              lineHeight: 1,
              textShadow: [
                `0 0 5px rgba(${p.color},${opacity})`,
                `0 0 12px rgba(255,220,60,${opacity * 0.6})`,
                `0 0 22px rgba(255,180,0,${opacity * 0.3})`,
              ].join(", "),
            }}
          >
            {p.char}
          </div>
        );
      })}

      {/* ── Light yellow glowing star — always on, lays on card ── */}
      {render.show && (
        <div
          style={{
            position: "fixed",
            left: render.x,
            top:  render.y,
            zIndex: 2001,
            pointerEvents: "none",
            transform: "translate(-50%,-50%)",
            willChange: "left, top",
          }}
        >
          {/* Warm yellow halo */}
          <div style={{
            position: "absolute",
            inset: "-14px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,240,100,0.22) 0%, rgba(255,200,40,0.08) 55%, transparent 75%)",
            filter: "blur(5px)",
          }} />
          {/* The star — light yellow ✦ with subtle glow */}
          <span style={{
            fontSize: 30,
            display: "block",
            color: "#FFF5A0",
            lineHeight: 1,
            textShadow: [
              "0 0 5px rgba(255,250,160,0.70)",
              "0 0 12px rgba(255,220,80,0.40)",
              "0 0 24px rgba(255,190,20,0.20)",
            ].join(", "),
          }}>
            ✦
          </span>
        </div>
      )}
    </>
  );
}

// Decorative SVG cloud — light mode hero only
function Cloud({ x, y, scale, opacity, dur, delay }: {
  x: string; y: string; scale: number; opacity: number; dur: string; delay: string;
}) {
  return (
    <div
      className="absolute pointer-events-none select-none"
      style={{
        left: x, top: y,
        width: `${140 * scale}px`,
        opacity,
        animation: `cloudDrift ${dur} ease-in-out ${delay} infinite`,
        filter: "blur(1px)",
        zIndex: 1,
      }}
    >
      <svg viewBox="0 0 140 70" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "auto" }}>
        <ellipse cx="70"  cy="56" rx="62"  ry="20"  fill="white" fillOpacity="0.88" />
        <circle  cx="44"  cy="42" r="24"             fill="white" fillOpacity="0.88" />
        <circle  cx="76"  cy="32" r="30"             fill="white" fillOpacity="0.88" />
        <circle  cx="108" cy="44" r="22"             fill="white" fillOpacity="0.88" />
      </svg>
    </div>
  );
}

const heroCloudData = [
  { x: "4%",  y: "8%",  scale: 1.20, opacity: 0.50, dur: "20s", delay: "0s"   },
  { x: "68%", y: "5%",  scale: 0.85, opacity: 0.42, dur: "26s", delay: "7s"   },
  { x: "82%", y: "30%", scale: 0.70, opacity: 0.38, dur: "18s", delay: "13s"  },
  { x: "1%",  y: "52%", scale: 0.75, opacity: 0.34, dur: "23s", delay: "4s"   },
  { x: "55%", y: "76%", scale: 1.00, opacity: 0.40, dur: "28s", delay: "10s"  },
  { x: "28%", y: "88%", scale: 0.65, opacity: 0.32, dur: "21s", delay: "16s"  },
];

/* ─── Projects Archive ─────────────────────────────────────────── */

const PA_PROJECTS = [
  {
    id: 1,
    number: "01",
    title: "EPICARE",
    subtitle: "Full-Stack AI Healthcare Platform for Epilepsy Care",
    desc: "A full-stack epilepsy care platform for patients and doctors, combining patient management, treatment support, and AI.\n\nIts AI assistant, Hayat, helps patients and doctors navigate the platform and understand care information.\n\nThe platform was developed using data from [[num:1,000+]] epilepsy patients in Kuwait, through clinical collaboration with [[org:VIVUS Clinic for Neurological Diseases]] and [[org:Al Sabah Hospital]].",
    recognitions: [
      { icon: "🤝", text: "Clinical Collaboration — [[org:VIVUS Clinic for Neurological Diseases]] & [[org:Al Sabah Hospital]]" },
      { icon: "📊", text: "[[rank:1,000+]] Real Patient Records" },
      { icon: "🏅", text: "[[rank:Top 13]] Projects — [[org:AUM Innovation Fair]]" },
    ],
    tags: ["Full-Stack Development", "Frontend Development", "Backend Development", "Python", "Machine Learning", "XGBoost", "NLP", "AI Assistant", "SHAP", "Explainable AI", "Healthcare AI", "Data Analysis"],
    badge: "HEALTHCARE AI",
    glow: "radial-gradient(ellipse at center, rgba(183,105,255,0.30) 0%, rgba(210,150,255,0.14) 55%, transparent 100%)",
    accent: "rgba(186,115,255,0.85)",
    accentRgb: "186,115,255",
    mediaBg: "linear-gradient(135deg, #0D0515 0%, #160930 60%, #080312 100%)",
    video: "/nora-dark/videos/epicare.mp4",
    deep: "22,7,35",
    surface: "17,8,27",
    titleLines: ["EPICARE"],
  },
  {
    id: 2,
    number: "02",
    title: "EVA",
    subtitle: "Intelligent Wearable Assistant for People with Specific Needs",
    desc: "An AI-powered wearable assistant designed to support people with specific needs in everyday life. EVA combines computer vision, NLP and intelligent assistance to help users understand their surroundings, communicate and receive personalized real-time support.\n\nDeveloped through the [[org:UC Berkeley × AUM]] AI & Entrepreneurship Program as an assistive technology and business concept.",
    recognitions: [
      { icon: "🥇", text: "[[rank:1st Place]] — [[org:Gulf Hult Business & Innovation Competition]]" },
      { icon: "🌍", text: "[[rank:Top 12 Globally]] — [[org:Babson College]]" },
      { icon: "🥈", text: "[[rank:2nd Place]] — [[org:AUM Startup Challenge]]" },
      { icon: "🏆", text: "[[rank:Best Social Media]] — [[org:INJAZ Kuwait]]" },
      { icon: "🥇", text: "[[rank:Ranked #1]] — [[org:UC Berkeley]] AI & Entrepreneurship Program" },
    ],
    tags: ["Artificial Intelligence", "Computer Vision", "Assistive Technology", "Accessibility", "Product Development", "UX/UI", "Entrepreneurship"],
    badge: "WEARABLE AI",
    glow: "radial-gradient(ellipse at center, rgba(255,91,188,0.30) 0%, rgba(255,140,210,0.14) 55%, transparent 100%)",
    accent: "rgba(255,99,190,0.85)",
    accentRgb: "255,99,190",
    mediaBg: "linear-gradient(135deg, #1E0518 0%, #300828 60%, #160410 100%)",
    video: "/nora-dark/videos/eva-kw.mp4",
    deep: "34,5,25",
    surface: "25,7,19",
    titleLines: ["EVA"],
  },
  {
    id: 3,
    number: "03",
    title: "WEREWOLF CURSE",
    subtitle: "Award-Winning Adventure Game",
    desc: "A two-level adventure game created with a multidisciplinary team in just [[num:3 days]] for Kuwait's [[org:National Cultural Game Jam]].",
    recognitions: [
      { icon: "🥇", text: "[[rank:1st Place]] — Best Game in Kuwait, Creative Category" },
      { icon: "🏆", text: "[[rank:Best Game Design Award]]" },
      { icon: "🤝", text: "National Competition • Collaborative Team Project" },
    ],
    tags: ["Godot Engine", "GDScript", "Game Development", "Game Design", "AI-Assisted Development", "Rapid Prototyping", "Interactive Design"],
    badge: "GAME DEV",
    glow: "radial-gradient(ellipse at center, rgba(255,63,55,0.32) 0%, rgba(255,130,120,0.14) 55%, transparent 100%)",
    accent: "rgba(255,68,61,0.85)",
    accentRgb: "255,68,61",
    mediaBg: "linear-gradient(135deg, #1E0505 0%, #320808 60%, #160303 100%)",
    video: "/nora-dark/videos/wolf-game.mp4",
    deep: "34,5,7",
    surface: "24,7,9",
    titleLines: ["WEREWOLF"],
  },
  {
    id: 4,
    number: "04",
    title: "AAFIYA",
    subtitle: "Personalized Nutrition & Wellness Platform",
    desc: "A health and lifestyle platform that tracks meals and calories and provides personalized nutrition and recipe recommendations based on individual needs, including allergies and health conditions.",
    recognitions: [
      { icon: "💡", text: "Participated in [[org:Innovation Center Kuwait]]" },
    ],
    tags: ["Health Tech", "Personalization", "Nutrition", "Calorie Tracking", "Meal Tracking", "Recipe Recommendation", "Web Development"],
    badge: "HEALTH TECH",
    glow: "radial-gradient(ellipse at center, rgba(105,255,87,0.28) 0%, rgba(150,255,130,0.14) 55%, transparent 100%)",
    accent: "rgba(117,255,87,0.85)",
    accentRgb: "117,255,87",
    mediaBg: "linear-gradient(135deg, #051A08 0%, #082810 60%, #030F05 100%)",
    video: "/nora-dark/videos/aafiya.mp4",
    deep: "5,27,10",
    surface: "7,22,10",
    titleLines: ["AAFIYA"],
  },
  {
    id: 5,
    number: "05",
    title: "RISE",
    subtitle: "AI-Powered Trading Platform",
    desc: "An AI trading platform combining market data, intelligent analysis and automated tools to make financial information easier to understand and support more informed trading decisions.",
    recognitions: [
      { icon: "◈", text: "[[rank:CURRENT BUILD]] // IN DEVELOPMENT" },
    ],
    tags: ["Agentic AI", "Artificial Intelligence", "FinTech", "Market Data", "Financial Analytics", "Web Development", "Data Visualization"],
    badge: "FINTECH AI",
    glow: "radial-gradient(ellipse at center, rgba(56,169,255,0.28) 0%, rgba(110,200,255,0.14) 55%, transparent 100%)",
    accent: "rgba(61,169,255,0.85)",
    accentRgb: "61,169,255",
    mediaBg: "linear-gradient(135deg, #051020 0%, #081830 60%, #030A18 100%)",
    deep: "5,20,37",
    surface: "7,17,29",
    titleLines: ["RISE"],
    image: "/nora-dark/rise-trade.png",
  },
];

/* ─── Neon Icons (inline SVG line art — no emoji, no icon libraries) ── */
const NEON_ICONS: { [key: number]: ReactElement } = {
  /* EPICARE — purple diagonal pill + cross + heartbeat */
  1: (
    <svg viewBox="0 0 150 95" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <g transform="rotate(-32 75 46)">
        <rect x="29" y="23" width="92" height="46" rx="23" />
        <path d="M75 23v46" />
        <path d="M47 46h16 M55 38v16" />
      </g>
    </svg>
  ),
  /* EVA — pink retro robot head */
  2: (
    <svg viewBox="0 0 130 95" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <rect x="30" y="24" width="70" height="48" rx="17" />
      <path d="M65 14v10 M65 14l7-6 M24 40h-9v17h9 M106 40h9v17h-9" />
      <circle cx="51" cy="45" r="4" />
      <circle cx="79" cy="45" r="4" />
      <path d="M50 59c10 8 21 8 31 0" />
    </svg>
  ),
  /* WEREWOLF — red continuous-line wolf profile */
  3: (
    <svg viewBox="0 0 180 120" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 72 C34 66 42 58 48 47 L50 29 L62 42 L70 24 L78 43 C91 44 103 49 116 55 L132 51 L124 60 L146 64 L135 71 L160 76" />
      <path d="M23 72 C15 77 14 83 23 88 C31 93 43 91 51 88 C60 85 67 88 70 96 L72 110" />
      <path d="M72 110 L82 101 L88 116" />
      <path d="M61 55 L70 53 L66 60 L57 61 Z" />
    </svg>
  ),
  /* AAFIYA — green bowl + two leaves + heartbeat */
  4: (
    <svg viewBox="0 0 150 100" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M27 56h96 c-5 22-22 34-48 34 S34 78 27 56z" />
      <path d="M46 52 c-4-19 4-32 19-39 5 14 2 25-9 36" />
      <path d="M76 51 c5-21 19-32 38-32 -2 16-10 29-27 34" />
      <path d="M38 70 h19 l7-12 8 20 9-14 7 8 h23" />
    </svg>
  ),
  /* RISE — blue circle with dollar sign */
  5: (
    <svg viewBox="0 0 120 100" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="60" cy="50" r="34" />
      <path d="M60 27v46" />
      <path d="M73 34 C68 29 52 28 47 37 C41 49 73 47 73 59 C73 70 52 73 44 64" />
    </svg>
  ),
};

const PA_SPARKS = Array.from({ length: 55 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  color: ["#a78bfa", "#c084fc", "#9b59d0", "#d4a8ff", "#8F42D7", "#b57bee", "#e4ccff", "#7b3db0"][i % 8],
  size: `${2.5 + Math.random() * 3}px`,
  dur: `${3.5 + Math.random() * 5}s`,
  delay: `${Math.random() * 7}s`,
  opacity: 0.2 + Math.random() * 0.5,
  isCross: i % 5 === 0,
}));

// Emoji + diamond sparkles for the Selected Works background (trimmed, smaller)
const PA_EMOJI_SPARKLES = [
  // ── Top ──
  { id:  0, left:  "5%", top:  "7%", emoji: "✨", size: 13, dur: "5s",   delay: "0s",   op: 0.65 },
  { id:  1, left: "28%", top:  "5%", emoji: "✦",  size: 10, dur: "6.5s", delay: "1.4s", op: 0.75, color: "#c4b5fd" },
  { id:  2, left: "60%", top:  "6%", emoji: "✦",  size: 13, dur: "4.8s", delay: "1.8s", op: 0.7,  color: "#93c5fd" },
  { id:  3, left: "88%", top:  "9%", emoji: "✧",  size: 11, dur: "5.2s", delay: "0.4s", op: 0.7,  color: "#f9a8d4" },
  // ── Left ──
  { id:  4, left:  "2%", top: "30%", emoji: "✦",  size: 12, dur: "5.8s", delay: "1.1s", op: 0.65, color: "#c084fc" },
  { id:  5, left:  "5%", top: "60%", emoji: "🌟", size: 14, dur: "8s",   delay: "0.2s", op: 0.45 },
  // ── Right ──
  { id:  6, left: "93%", top: "28%", emoji: "✦",  size: 13, dur: "6.2s", delay: "0.7s", op: 0.65, color: "#f472b6" },
  { id:  7, left: "91%", top: "58%", emoji: "💫", size: 12, dur: "7.2s", delay: "1.6s", op: 0.55 },
  // ── Middle ──
  { id:  8, left: "18%", top: "32%", emoji: "✦",  size:  9, dur: "6s",   delay: "1s",   op: 0.55, color: "#a78bfa" },
  { id:  9, left: "42%", top: "40%", emoji: "✨", size:  9, dur: "4.6s", delay: "0.8s", op: 0.45 },
  { id: 10, left: "65%", top: "35%", emoji: "⭐", size: 10, dur: "5.1s", delay: "1.3s", op: 0.5  },
  { id: 11, left: "80%", top: "48%", emoji: "✦",  size: 12, dur: "7s",   delay: "4s",   op: 0.6,  color: "#c084fc" },
  // ── Bottom ──
  { id: 12, left:  "8%", top: "86%", emoji: "✨", size: 12, dur: "5.6s", delay: "2.2s", op: 0.55 },
  { id: 13, left: "35%", top: "90%", emoji: "✦",  size: 14, dur: "5.4s", delay: "1.5s", op: 0.65, color: "#f472b6" },
  { id: 14, left: "62%", top: "87%", emoji: "💫", size: 13, dur: "8.5s", delay: "3s",   op: 0.45 },
  { id: 15, left: "85%", top: "91%", emoji: "✦",  size: 10, dur: "5.9s", delay: "0.3s", op: 0.6,  color: "#a78bfa" },
  // ── Accent ──
  { id: 16, left: "15%", top: "20%", emoji: "🌟", size: 17, dur: "9s",   delay: "4.5s", op: 0.3  },
  { id: 17, left: "78%", top: "76%", emoji: "✨", size: 18, dur: "10s",  delay: "5.2s", op: 0.28 },
];

// Emoji sparkles for the Journey section (same style, slightly smaller)
const JOURNEY_SPARKLES = [
  { id:  0, left:  "4%", top: "10%", emoji: "✨", size:  8, dur: "5.2s", delay: "0s",   op: 0.80 },
  { id:  1, left: "15%", top:  "5%", emoji: "✦",  size:  7, dur: "6s",   delay: "1.5s", op: 0.90, color: "#a78bfa" },
  { id:  2, left: "38%", top:  "4%", emoji: "💫", size:  9, dur: "7.5s", delay: "0.7s", op: 0.75 },
  { id:  3, left: "65%", top:  "6%", emoji: "✦",  size:  7, dur: "5.5s", delay: "2s",   op: 0.85, color: "#f9a8d4" },
  { id:  4, left: "88%", top:  "8%", emoji: "⭐", size:  7, dur: "6.5s", delay: "1s",   op: 0.70 },
  { id:  5, left:  "2%", top: "35%", emoji: "✦",  size:  8, dur: "5.8s", delay: "1.2s", op: 0.85, color: "#c4b5fd" },
  { id:  6, left:  "3%", top: "65%", emoji: "✧",  size:  6, dur: "4.8s", delay: "2.8s", op: 0.80, color: "#93c5fd" },
  { id:  7, left: "94%", top: "32%", emoji: "✨", size:  7, dur: "5s",   delay: "0.5s", op: 0.75 },
  { id:  8, left: "96%", top: "60%", emoji: "✦",  size:  8, dur: "6.8s", delay: "3.2s", op: 0.85, color: "#c084fc" },
  { id:  9, left: "22%", top: "48%", emoji: "✦",  size:  6, dur: "6.2s", delay: "1.8s", op: 0.75, color: "#f472b6" },
  { id: 10, left: "55%", top: "52%", emoji: "✨", size:  7, dur: "4.9s", delay: "0.9s", op: 0.70 },
  { id: 11, left: "75%", top: "40%", emoji: "✧",  size:  7, dur: "5.7s", delay: "2.5s", op: 0.80, color: "#a78bfa" },
  { id: 12, left: "10%", top: "85%", emoji: "💫", size:  8, dur: "7s",   delay: "3.5s", op: 0.72 },
  { id: 13, left: "50%", top: "90%", emoji: "✦",  size:  9, dur: "5.4s", delay: "1.4s", op: 0.85, color: "#e9d5ff" },
  { id: 14, left: "85%", top: "88%", emoji: "🌟", size: 10, dur: "8s",   delay: "4s",   op: 0.65 },
];

// Rotating sparkle emojis for Journey (spin while floating)
const JOURNEY_ROTATE_SPARKS = [
  { id:  0, left: "9%",  top: "20%", emoji: "✨", size: 11, dur: "5s",   delay: "0s",   op: 0.80 },
  { id:  1, left: "18%", top: "42%", emoji: "💫", size: 12, dur: "6.5s", delay: "1.2s", op: 0.75 },
  { id:  2, left: "30%", top: "18%", emoji: "⭐", size: 10, dur: "4.8s", delay: "2.5s", op: 0.70 },
  { id:  3, left: "42%", top: "60%", emoji: "✨", size: 11, dur: "7.2s", delay: "0.4s", op: 0.78 },
  { id:  4, left: "52%", top: "28%", emoji: "🌟", size: 13, dur: "5.5s", delay: "3.1s", op: 0.65 },
  { id:  5, left: "63%", top: "70%", emoji: "💫", size: 10, dur: "6.0s", delay: "1.7s", op: 0.72 },
  { id:  6, left: "74%", top: "22%", emoji: "✨", size: 11, dur: "4.4s", delay: "0.9s", op: 0.80 },
  { id:  7, left: "83%", top: "55%", emoji: "⭐", size:  9, dur: "7.8s", delay: "2.8s", op: 0.68 },
  { id:  8, left: "12%", top: "70%", emoji: "🌟", size: 11, dur: "5.2s", delay: "1.5s", op: 0.73 },
  { id:  9, left: "58%", top: "45%", emoji: "✨", size:  8, dur: "6.8s", delay: "3.8s", op: 0.70 },
  { id: 10, left: "35%", top: "80%", emoji: "💫", size: 11, dur: "5.7s", delay: "0.6s", op: 0.75 },
  { id: 11, left: "90%", top: "75%", emoji: "✨", size: 10, dur: "4.9s", delay: "2.2s", op: 0.72 },
];

// Tiny white disappearing stars for Journey section background
const JOURNEY_BG_STARS = [
  // char: ✦ ✧ ⋆ · ✦ ✧ (white, tiny, scattered densely)
  { id:  0, left:  "2%",  top:  "8%",  ch: "✦", sz: 5,  dur: "3.2s", del: "0s"    },
  { id:  1, left:  "8%",  top: "18%",  ch: "·", sz: 6,  dur: "4.1s", del: "1.1s"  },
  { id:  2, left: "14%",  top:  "5%",  ch: "⋆", sz: 7,  dur: "2.8s", del: "0.4s"  },
  { id:  3, left: "20%",  top: "14%",  ch: "✧", sz: 5,  dur: "3.7s", del: "2.3s"  },
  { id:  4, left: "27%",  top:  "3%",  ch: "✦", sz: 4,  dur: "4.5s", del: "0.8s"  },
  { id:  5, left: "34%",  top: "10%",  ch: "·", sz: 5,  dur: "3.0s", del: "1.9s"  },
  { id:  6, left: "41%",  top:  "6%",  ch: "⋆", sz: 6,  dur: "5.2s", del: "3.1s"  },
  { id:  7, left: "48%",  top: "16%",  ch: "✦", sz: 4,  dur: "3.5s", del: "0.2s"  },
  { id:  8, left: "55%",  top:  "4%",  ch: "✧", sz: 7,  dur: "4.8s", del: "1.5s"  },
  { id:  9, left: "62%",  top: "12%",  ch: "·", sz: 5,  dur: "2.9s", del: "2.7s"  },
  { id: 10, left: "70%",  top:  "7%",  ch: "⋆", sz: 6,  dur: "3.8s", del: "0.6s"  },
  { id: 11, left: "77%",  top: "15%",  ch: "✦", sz: 4,  dur: "5.0s", del: "3.4s"  },
  { id: 12, left: "84%",  top:  "3%",  ch: "✧", sz: 5,  dur: "3.3s", del: "1.0s"  },
  { id: 13, left: "91%",  top: "11%",  ch: "·", sz: 6,  dur: "4.2s", del: "2.0s"  },
  { id: 14, left: "97%",  top:  "6%",  ch: "⋆", sz: 5,  dur: "3.1s", del: "0.7s"  },
  { id: 15, left:  "5%",  top: "28%",  ch: "✦", sz: 4,  dur: "4.6s", del: "1.8s"  },
  { id: 16, left: "11%",  top: "40%",  ch: "✧", sz: 6,  dur: "3.4s", del: "3.2s"  },
  { id: 17, left: "18%",  top: "52%",  ch: "·", sz: 5,  dur: "5.1s", del: "0.3s"  },
  { id: 18, left: "24%",  top: "33%",  ch: "⋆", sz: 7,  dur: "2.7s", del: "2.5s"  },
  { id: 19, left: "31%",  top: "45%",  ch: "✦", sz: 4,  dur: "4.0s", del: "1.3s"  },
  { id: 20, left: "38%",  top: "58%",  ch: "✧", sz: 5,  dur: "3.6s", del: "0.9s"  },
  { id: 21, left: "45%",  top: "30%",  ch: "·", sz: 6,  dur: "4.9s", del: "2.1s"  },
  { id: 22, left: "52%",  top: "44%",  ch: "⋆", sz: 5,  dur: "3.2s", del: "3.7s"  },
  { id: 23, left: "59%",  top: "22%",  ch: "✦", sz: 7,  dur: "4.4s", del: "0.5s"  },
  { id: 24, left: "66%",  top: "55%",  ch: "✧", sz: 4,  dur: "3.9s", del: "1.6s"  },
  { id: 25, left: "73%",  top: "38%",  ch: "·", sz: 6,  dur: "2.6s", del: "2.9s"  },
  { id: 26, left: "80%",  top: "24%",  ch: "⋆", sz: 5,  dur: "5.3s", del: "0.1s"  },
  { id: 27, left: "87%",  top: "48%",  ch: "✦", sz: 4,  dur: "3.7s", del: "1.4s"  },
  { id: 28, left: "93%",  top: "36%",  ch: "✧", sz: 6,  dur: "4.3s", del: "2.6s"  },
  { id: 29, left:  "7%",  top: "68%",  ch: "·", sz: 5,  dur: "3.5s", del: "0.8s"  },
  { id: 30, left: "15%",  top: "78%",  ch: "⋆", sz: 7,  dur: "4.7s", del: "3.0s"  },
  { id: 31, left: "23%",  top: "62%",  ch: "✦", sz: 4,  dur: "3.1s", del: "1.7s"  },
  { id: 32, left: "32%",  top: "75%",  ch: "✧", sz: 5,  dur: "5.4s", del: "2.4s"  },
  { id: 33, left: "40%",  top: "83%",  ch: "·", sz: 6,  dur: "2.9s", del: "0.6s"  },
  { id: 34, left: "48%",  top: "70%",  ch: "⋆", sz: 4,  dur: "4.1s", del: "3.5s"  },
  { id: 35, left: "56%",  top: "80%",  ch: "✦", sz: 7,  dur: "3.8s", del: "1.2s"  },
  { id: 36, left: "64%",  top: "65%",  ch: "✧", sz: 5,  dur: "4.5s", del: "2.8s"  },
  { id: 37, left: "72%",  top: "77%",  ch: "·", sz: 6,  dur: "3.3s", del: "0.4s"  },
  { id: 38, left: "79%",  top: "60%",  ch: "⋆", sz: 4,  dur: "5.0s", del: "1.9s"  },
  { id: 39, left: "86%",  top: "72%",  ch: "✦", sz: 5,  dur: "3.6s", del: "3.3s"  },
  { id: 40, left: "94%",  top: "82%",  ch: "✧", sz: 6,  dur: "4.2s", del: "0.9s"  },
  { id: 41, left: "10%",  top: "93%",  ch: "·", sz: 5,  dur: "2.8s", del: "2.2s"  },
  { id: 42, left: "28%",  top: "95%",  ch: "⋆", sz: 7,  dur: "4.8s", del: "1.0s"  },
  { id: 43, left: "50%",  top: "97%",  ch: "✦", sz: 4,  dur: "3.4s", del: "3.8s"  },
  { id: 44, left: "72%",  top: "92%",  ch: "✧", sz: 6,  dur: "5.2s", del: "0.3s"  },
  { id: 45, left: "90%",  top: "94%",  ch: "·", sz: 5,  dur: "3.9s", del: "2.0s"  },
  // extra dense layer
  { id: 46, left:  "4%",  top: "13%",  ch: "·", sz: 3,  dur: "2.4s", del: "0.3s"  },
  { id: 47, left: "12%",  top: "25%",  ch: "✦", sz: 4,  dur: "3.8s", del: "1.5s"  },
  { id: 48, left: "19%",  top: "47%",  ch: "·", sz: 3,  dur: "5.0s", del: "2.8s"  },
  { id: 49, left: "26%",  top: "20%",  ch: "⋆", sz: 4,  dur: "2.9s", del: "0.7s"  },
  { id: 50, left: "33%",  top: "38%",  ch: "·", sz: 3,  dur: "4.3s", del: "3.6s"  },
  { id: 51, left: "39%",  top:  "9%",  ch: "✧", sz: 4,  dur: "3.1s", del: "1.2s"  },
  { id: 52, left: "46%",  top: "53%",  ch: "·", sz: 3,  dur: "4.7s", del: "0.5s"  },
  { id: 53, left: "53%",  top: "31%",  ch: "⋆", sz: 4,  dur: "3.5s", del: "2.1s"  },
  { id: 54, left: "60%",  top: "42%",  ch: "·", sz: 3,  dur: "2.7s", del: "3.9s"  },
  { id: 55, left: "67%",  top: "18%",  ch: "✦", sz: 4,  dur: "4.6s", del: "0.9s"  },
  { id: 56, left: "74%",  top: "63%",  ch: "·", sz: 3,  dur: "3.3s", del: "2.4s"  },
  { id: 57, left: "81%",  top: "29%",  ch: "⋆", sz: 4,  dur: "5.1s", del: "1.7s"  },
  { id: 58, left: "88%",  top: "57%",  ch: "·", sz: 3,  dur: "2.6s", del: "0.2s"  },
  { id: 59, left: "95%",  top: "21%",  ch: "✧", sz: 4,  dur: "4.0s", del: "3.1s"  },
  { id: 60, left:  "6%",  top: "73%",  ch: "⋆", sz: 3,  dur: "3.6s", del: "1.0s"  },
  { id: 61, left: "13%",  top: "86%",  ch: "·", sz: 4,  dur: "4.9s", del: "2.3s"  },
  { id: 62, left: "22%",  top: "57%",  ch: "✦", sz: 3,  dur: "3.2s", del: "3.4s"  },
  { id: 63, left: "29%",  top: "88%",  ch: "·", sz: 4,  dur: "2.5s", del: "0.6s"  },
  { id: 64, left: "37%",  top: "66%",  ch: "⋆", sz: 3,  dur: "4.4s", del: "1.8s"  },
  { id: 65, left: "44%",  top: "79%",  ch: "✧", sz: 4,  dur: "3.0s", del: "2.6s"  },
  { id: 66, left: "51%",  top: "90%",  ch: "·", sz: 3,  dur: "5.3s", del: "0.4s"  },
  { id: 67, left: "58%",  top: "68%",  ch: "✦", sz: 4,  dur: "3.7s", del: "3.0s"  },
  { id: 68, left: "65%",  top: "85%",  ch: "·", sz: 3,  dur: "2.8s", del: "1.3s"  },
  { id: 69, left: "71%",  top: "50%",  ch: "⋆", sz: 4,  dur: "4.2s", del: "2.7s"  },
  { id: 70, left: "78%",  top: "91%",  ch: "·", sz: 3,  dur: "3.5s", del: "0.8s"  },
  { id: 71, left: "85%",  top: "74%",  ch: "✧", sz: 4,  dur: "4.8s", del: "3.3s"  },
  { id: 72, left: "92%",  top: "45%",  ch: "·", sz: 3,  dur: "2.9s", del: "1.6s"  },
  { id: 73, left:  "3%",  top: "56%",  ch: "⋆", sz: 4,  dur: "3.4s", del: "2.9s"  },
  { id: 74, left: "16%",  top: "35%",  ch: "·", sz: 3,  dur: "5.2s", del: "0.1s"  },
  { id: 75, left: "35%",  top: "27%",  ch: "✦", sz: 4,  dur: "3.9s", del: "1.4s"  },
  { id: 76, left: "57%",  top: "14%",  ch: "·", sz: 3,  dur: "4.5s", del: "3.7s"  },
  { id: 77, left: "75%",  top: "34%",  ch: "⋆", sz: 4,  dur: "2.7s", del: "0.5s"  },
  { id: 78, left: "89%",  top: "16%",  ch: "·", sz: 3,  dur: "3.8s", del: "2.2s"  },
  { id: 79, left: "43%",  top: "96%",  ch: "✧", sz: 3,  dur: "4.1s", del: "1.9s"  },
  { id: 80, left: "68%",  top: "98%",  ch: "·", sz: 4,  dur: "3.0s", del: "0.3s"  },
  { id: 81, left: "21%",  top: "99%",  ch: "⋆", sz: 3,  dur: "5.5s", del: "2.5s"  },
  { id: 82, left: "82%",  top: "87%",  ch: "·", sz: 4,  dur: "3.1s", del: "1.1s"  },
  { id: 83, left:  "9%",  top: "43%",  ch: "✦", sz: 3,  dur: "4.6s", del: "3.2s"  },
  { id: 84, left: "49%",  top: "23%",  ch: "·", sz: 4,  dur: "2.3s", del: "0.7s"  },
  { id: 85, left: "96%",  top: "67%",  ch: "⋆", sz: 3,  dur: "4.4s", del: "2.0s"  },
  { id: 86, left: "30%",  top: "71%",  ch: "·", sz: 4,  dur: "3.6s", del: "3.5s"  },
  { id: 87, left: "63%",  top: "59%",  ch: "✧", sz: 3,  dur: "5.0s", del: "0.9s"  },
  { id: 88, left: "76%",  top: "11%",  ch: "·", sz: 4,  dur: "2.6s", del: "2.6s"  },
  { id: 89, left:  "1%",  top: "89%",  ch: "⋆", sz: 3,  dur: "3.3s", del: "1.4s"  },
  { id: 90, left: "99%",  top: "30%",  ch: "·", sz: 4,  dur: "4.7s", del: "3.8s"  },
  { id: 91, left: "54%",  top: "76%",  ch: "✦", sz: 3,  dur: "3.2s", del: "0.2s"  },
  { id: 92, left: "17%",  top: "62%",  ch: "·", sz: 4,  dur: "4.0s", del: "1.7s"  },
  { id: 93, left: "42%",  top: "42%",  ch: "⋆", sz: 3,  dur: "2.8s", del: "2.3s"  },
  { id: 94, left: "83%",  top: "39%",  ch: "·", sz: 4,  dur: "5.1s", del: "0.6s"  },
  { id: 95, left: "25%",  top: "81%",  ch: "✧", sz: 3,  dur: "3.7s", del: "3.6s"  },
];

function renderText(text: string): React.ReactNode[] {
  return text.split(/(\[\[(?:org|num|rank):[^\]]+\]\])/).map((part, i) => {
    const m = part.match(/^\[\[(org|num|rank):(.+)\]\]$/);
    if (!m) return <span key={i}>{part}</span>;
    if (m[1] === "org")  return <span key={i} className="pa-hl-org">{m[2]}</span>;
    if (m[1] === "num")  return <span key={i} className="pa-hl-num">{m[2]}</span>;
    if (m[1] === "rank") return <span key={i} className="pa-hl-rank">{m[2]}</span>;
    return <span key={i}>{part}</span>;
  });
}

function ProjectsSection() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [active, setActive] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [showGlitch, setShowGlitch] = useState(false);
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const touchStart = useRef(0);

  const proj = PA_PROJECTS[active];

  function goTo(idx: number) {
    if (transitioning || idx === active) return;
    setPlaying(false);
    if (videoRef.current) { videoRef.current.pause(); videoRef.current.currentTime = 0; }
    setTransitioning(true);
    setShowGlitch(true);
    setTimeout(() => setShowGlitch(false), 480);
    setTimeout(() => { setActive(idx); setTransitioning(false); }, 320);
  }

  function handlePlay() {
    if (videoRef.current) { videoRef.current.play(); setPlaying(true); }
  }
  function prev() { goTo((active - 1 + PA_PROJECTS.length) % PA_PROJECTS.length); }
  function next() { goTo((active + 1) % PA_PROJECTS.length); }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, transitioning]);

  function onTouchStart(e: React.TouchEvent) { touchStart.current = e.touches[0].clientX; }
  function onTouchEnd(e: React.TouchEvent) {
    const dx = e.changedTouches[0].clientX - touchStart.current;
    if (Math.abs(dx) > 45) { dx < 0 ? next() : prev(); }
  }

  // sectionBg starts below
  const sectionBg = isDark
    ? [
        "radial-gradient(ellipse at 18% 45%, rgba(88,28,135,0.32) 0%, transparent 58%)",
        "radial-gradient(ellipse at 78% 18%, rgba(100,40,180,0.22) 0%, transparent 52%)",
        "radial-gradient(ellipse at 55% 82%, rgba(120,50,200,0.20) 0%, transparent 52%)",
        "linear-gradient(175deg, #18151f 0%, #1b172c 45%, #191624 100%)",
      ].join(", ")
    : [
        "radial-gradient(ellipse at 22% 48%, rgba(143,66,215,0.14) 0%, transparent 55%)",
        "radial-gradient(ellipse at 76% 22%, rgba(162,106,255,0.10) 0%, transparent 50%)",
        "linear-gradient(175deg, #F0EAFF 0%, #EAE2FF 45%, #F6F2FF 100%)",
      ].join(", ");

  const titleColor = isDark ? "rgba(255,255,255,0.96)" : "rgba(15,10,40,0.92)";
  const isLastThree = active >= 2;
  const cardBg = isDark
    ? isLastThree
      ? `radial-gradient(circle at 18% 0%, rgba(96,165,250,.22), transparent 36%), linear-gradient(160deg, rgba(147,197,253,.12) 0%, rgba(59,130,246,.07) 45%, rgba(15,30,60,.97) 100%)`
      : `radial-gradient(circle at 18% 0%, rgba(${proj.accentRgb},.28), transparent 36%), linear-gradient(160deg, rgba(${proj.accentRgb},.18) 0%, rgba(${proj.accentRgb},.08) 45%, rgba(${proj.deep ?? "8,8,12"},.99) 100%)`
    : isLastThree
      ? `radial-gradient(circle at 12% 0%, rgba(147,197,253,.18), transparent 38%), linear-gradient(160deg, rgba(219,234,254,.5) 0%, #EFF6FF 100%)`
      : `radial-gradient(circle at 12% 0%, rgba(${proj.accentRgb},.14), transparent 38%), linear-gradient(160deg, rgba(${proj.accentRgb},.09) 0%, #FEFEFF 100%)`;
  const cardBodyText = isDark ? "rgba(220,215,255,0.82)" : "rgba(40,30,80,0.75)";

  return (
    <section
      id="projects" className="pa-section"
      style={{ background: sectionBg }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="pa-grid" aria-hidden />
      <div className="pa-crt"  aria-hidden />
      <div className="pa-vignette" aria-hidden />
      {/* Progressive dim overlay — gets darker toward last projects */}
      <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1, background: "rgba(17,19,29,1)", opacity: [0, 0, 0.10, 0.20, 0.32][active] ?? 0, transition: "opacity 0.5s ease" }} />

      {/* Sparks */}
      <div className="pa-sparks" aria-hidden>
        {PA_SPARKS.map(s => (
          <div
            key={s.id}
            className={`pa-spark${s.isCross ? " cross" : ""}`}
            style={{
              left: s.left, top: s.top,
              width: s.size, height: s.size,
              background: s.color,
              "--pa-sd": s.dur, "--pa-sdl": s.delay,
              "--pa-so": s.opacity, "--pa-sc": s.color,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Emoji + diamond sparkles */}
      <div className="pa-emoji-sparks" aria-hidden>
        {PA_EMOJI_SPARKLES.map(s => (
          <span
            key={s.id}
            className={`pa-emoji-spark${s.color ? " diamond" : ""}`}
            style={{
              left: s.left,
              top: s.top,
              fontSize: s.size + "px",
              color: s.color ?? undefined,
              "--pes-dur": s.dur,
              "--pes-del": s.delay,
              "--pes-op": s.op,
            } as React.CSSProperties}
          >
            {s.emoji}
          </span>
        ))}
      </div>

      {/* Header */}
      <div className="pa-header">
        <span className="pa-eyebrow">// PROJECT ARCHIVE</span>
        <h2 className="pa-title" style={{ color: titleColor }}>
          <span className="pa-title-line1">A few things</span>
          <span className="pa-title-line2">I’ve built.</span>
        </h2>
        <p className="pa-subtitle" style={{ color: isDark ? "rgba(196,181,253,0.45)" : "rgba(80,60,140,0.5)" }}>
          There’s more on GitHub.
        </p>
        <a href="https://github.com/nourah-alotaibi" target="_blank" rel="noopener noreferrer" style={{ color: "inherit", fontSize: 14, textDecoration: "underline", textUnderlineOffset: 4 }}>More on GitHub</a>
        <div className="pa-divider" />
      </div>

      {/* Single-project viewer */}
      <div
        className="pa-viewer"
        style={{ "--pa-accent": proj.accent, "--pa-accent-rgb": proj.accentRgb, "--pa-deep": proj.deep, "--pa-surface": proj.surface } as React.CSSProperties}
      >
        {/* ── Neon Sign Environment (floating above card) ── */}
        <div className={`pa-neon-env${transitioning ? " pa-v-out" : ""}`}>
          {/* Thin decorative wire */}
          <svg className="pa-wire-deco" viewBox="0 0 220 12" fill="none" aria-hidden>
            <path d="M0 6 Q35 3 55 6 Q90 9 110 6 Q145 3 165 6 L220 6"
              stroke={`rgba(${proj.accentRgb},0.22)`} strokeWidth="1" strokeDasharray="4 6" />
            <circle cx="55"  cy="6" r="2.5" fill={`rgba(${proj.accentRgb},0.28)`} />
            <circle cx="165" cy="6" r="2.5" fill={`rgba(${proj.accentRgb},0.28)`} />
          </svg>

          {/* Neon icon */}
          <div
            className="pa-neon-icon"
            style={{
              color: `rgb(${proj.accentRgb})`,
              marginTop: proj.id === 3 ? "-6px" : proj.id === 5 ? "-2px" : undefined,
            }}
          >
            {NEON_ICONS[proj.id]}
          </div>

          {/* Neon title */}
          <div className="pa-neon-title">
            {(proj.titleLines ?? [proj.title]).map((line, i) => (
              <span
                key={i}
                className={`pa-neon-line${proj.id === 3 ? " pa-neon-flicker" : ""}`}
                style={{
                  color: proj.id === 3 && i === 0 ? "#ffd2cf" : `rgb(${proj.accentRgb})`,
                  textShadow: `0 0 2px #fff, 0 0 7px rgb(${proj.accentRgb}), 0 0 19px rgb(${proj.accentRgb}), 0 0 42px rgba(${proj.accentRgb},.36)`,
                }}
              >
                {line}
              </span>
            ))}
          </div>

          {/* Light spill onto top of card */}
          <div
            className="pa-light-spill"
            style={{ background: `radial-gradient(ellipse at center, rgba(${proj.accentRgb},.30), transparent 70%)` }}
          />
        </div>

        {/* Media + side arrows */}
        <div className="pa-media-wrap">
          <div className={`pa-viewer-media${transitioning ? " pa-v-out" : ""}`}>
            {showGlitch && <div className="pa-glitch-flash" aria-hidden />}
            <div className="pa-film-strip">
              {Array.from({ length: 16 }).map((_, pi) => <div key={pi} className="pa-perf" />)}
            </div>
            <div className="pa-media" style={{ background: isDark ? proj.mediaBg : "linear-gradient(135deg, #e8deff, #f0eaff)" }}>
              <div style={{
                position: "absolute", inset: 0,
                backgroundImage: `linear-gradient(rgba(${proj.accentRgb},0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(${proj.accentRgb},0.07) 1px, transparent 1px)`,
                backgroundSize: "32px 32px", zIndex: 1,
              }} />
              {proj.video ? (
                <>
                  <video
                    ref={videoRef}
                    key={proj.video}
                    src={proj.video}
                    controls={playing}
                    playsInline
                    onPause={() => setPlaying(false)}
                    onEnded={() => setPlaying(false)}
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 2 }}
                  />
                  {!playing && (
                    <div
                      onClick={handlePlay}
                      style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.38)", zIndex: 4, cursor: "pointer" }}
                    >
                      <div style={{ width: 60, height: 60, borderRadius: "50%", background: proj.accent, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 32px rgba(${proj.accentRgb},0.6)`, transition: "transform 0.2s" }}>
                        <Play style={{ width: 26, height: 26, color: "white", marginLeft: 4 }} fill="white" />
                      </div>
                    </div>
                  )}
                </>
              ) : proj.image ? (
                <img
                  src={proj.image}
                  alt={proj.title}
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 2 }}
                />
              ) : (
                <div style={{
                  position: "absolute", inset: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  zIndex: 2,
                  color: `rgb(${proj.accentRgb})`,
                  filter: `drop-shadow(0 0 4px rgba(${proj.accentRgb},.9)) drop-shadow(0 0 14px rgba(${proj.accentRgb},.6)) drop-shadow(0 0 30px rgba(${proj.accentRgb},.3))`,
                }}>
                  <div style={{ width: 120, height: 88 }}>{NEON_ICONS[proj.id]}</div>
                </div>
              )}
              <div className="pa-media-scan" />
              <div className="pa-rec" style={{ zIndex: 6 }}>REC</div>
              <span className="pa-badge" style={{ "--pa-accent": proj.accent, "--pa-accent-rgb": proj.accentRgb } as React.CSSProperties}>{proj.badge}</span>
            </div>
          </div>
          <button className="pa-arrow pa-arrow-left" onClick={prev} aria-label="Previous project">←</button>
          <button className="pa-arrow pa-arrow-right" onClick={next} aria-label="Next project">→</button>
        </div>

        {/* Content under media */}
        <div
          className={`pa-viewer-content${transitioning ? " pa-v-out" : ""}`}
          style={{ color: cardBodyText, background: cardBg }}
        >
          <div className="pa-card-number" style={{ color: proj.accent }}>
            {proj.number} // {proj.title}
          </div>
          <div className="pa-card-subtitle" style={{ color: isDark ? "#E4CCFF" : "rgba(42,16,80,0.9)" }}>
            {proj.subtitle}
          </div>
          {proj.desc.split("\n\n").map((para, pi) => (
            <p key={pi} className="pa-card-desc">{renderText(para)}</p>
          ))}
          {proj.title === "WEREWOLF CURSE" && <UpdatedGame />}
<div className="pa-recognitions">
            {proj.recognitions.map((r, ri) => (
              <div key={ri} className="pa-recognition-item">
                <span className="pa-recognition-dot" aria-hidden="true">•</span>
                <span>{renderText(r.text)}</span>
              </div>
            ))}
          </div>
          <div className="pa-skills-header">SKILLS //</div>
          <div className="pa-tags">
            {proj.tags.map(tag => <span key={tag} className="pa-tag">{tag}</span>)}
          </div>
        </div>

      </div>
    </section>
  );
}

function RetroGridScene() {
  return (
    <div className="hero-retro-scene" aria-hidden>
      <div className="hero-retro-stars" />
      <div className="hero-retro-horizon" />
      <div className="hero-retro-grid-wrap">
        <div className="hero-retro-grid" />
      </div>
      <div className="hero-retro-lane" />
    </div>
  );
}

// Awards banner (shared by mobile + desktop hero)
const AWARD_ITEMS = [
  { c: "pink", t: "🥇 1st — Gulf Countries Challenge" },
  { c: "cyan", t: "🥇 1st — Best Game, Cultural Game Jam S2" },
  { c: "violet", t: "🏆 Best Game Design — Cultural Game Jam S2" },
  { c: "pink", t: "🏆 Best Social Media — INJAZ Kuwait (EVA AI)" },
  { c: "cyan", t: "🥈 2nd — AUM Startup Challenge (EVA AI Pin)" },
  { c: "violet", t: "🎓 Graduated with Honors — B.Sc. CE" },
  { c: "pink", t: "🌍 Top 12 Worldwide — Babson Startup Challenge" },
  { c: "cyan", t: "🏆 Best Grad Project Nominee — UC Berkeley AI" },
];

// Glowing starfield for the desktop hero — mirrors the mobile hero look
const DESKTOP_HERO_STARS = Array.from({ length: 40 }, () => {
  const size = Math.random() * 1.3 + 0.5;
  return {
    size,
    top: Math.random() * 100,
    left: Math.random() * 100,
    delay: Math.random() * 5,
    dur: Math.random() * 3 + 2.4,
    glow: size * (Math.random() * 1.2 + 0.8),
    bright: Math.random() > 0.85,
  };
});

const HERO_BG_EMOJIS: { ch: string; style: CSSProperties; delay: string }[] = [
  { ch: "✨", style: { top: "13%", left: "11%" }, delay: "0s" },
  { ch: "⭐", style: { top: "70%", left: "7%" }, delay: "1.4s" },
  { ch: "✨", style: { top: "18%", right: "9%" }, delay: "0.7s" },
];

function DesktopAwardsTicker() {
  return (
    <div className="dh-award-ticker-wrap" aria-hidden>
      <div className="dh-award-ticker">
        {[...AWARD_ITEMS, ...AWARD_ITEMS].map((a, i) => (
          <span key={i} className="dh-award-item">
            <span className={`aw-${a.c}`}>{a.t}</span>
            <span className="dh-award-sep"> · </span>
          </span>
        ))}
      </div>
    </div>
  );
}

function MobileHero() {
  const stars = useMemo(
    () =>
      Array.from({ length: 55 }, () => {
        const size = Math.random() * 1.3 + 0.5; // 0.5–1.8px, mostly pin-tiny
        const bright = Math.random() > 0.85;
        return {
          size,
          top: Math.random() * 100,
          left: Math.random() * 100,
          delay: Math.random() * 5,
          dur: Math.random() * 3 + 2.4,
          glow: size * (Math.random() * 1.2 + 0.8), // soft halo radius
          bright,
        };
      }),
    [],
  );

  return (
    <section className="mh2-section">
      <div className="mh2-blob mh2-blob-a" aria-hidden />
      <div className="mh2-blob mh2-blob-b" aria-hidden />
      <div className="mh2-blob mh2-blob-c" aria-hidden />

      <div className="mh2-stars" aria-hidden>
        {stars.map((s, i) => (
          <span
            key={i}
            className={s.bright ? "mh2-star mh2-star-bright" : "mh2-star"}
            style={{
              width: `${s.size}px`,
              height: `${s.size}px`,
              top: `${s.top}%`,
              left: `${s.left}%`,
              animationDelay: `${s.delay}s`,
              animationDuration: `${s.dur}s`,
              boxShadow: `0 0 ${s.glow}px ${s.glow / 3}px rgba(255,255,255,${s.bright ? 0.35 : 0.16})`,
            }}
          />
        ))}
      </div>

      <div className="mh2-emojis" aria-hidden>
        {HERO_BG_EMOJIS.map((e, i) => (
          <span key={i} className="mh2-emoji" style={{ ...e.style, animationDelay: e.delay }}>
            {e.ch}
          </span>
        ))}
      </div>

      <div className="mh2-stage">
        <div className="mh2-portrait-col">
          <div className="mh2-portrait-wrap">
            <div className="mh2-ring mh2-ring-2" aria-hidden />
            <div className="mh2-ring mh2-ring-3" aria-hidden />
            <div className="mh2-ring mh2-ring-1" aria-hidden />
            <div className="mh2-portrait-frame">
              <img src="/nora-dark/image.png" alt="Nourah Alotaibi" />
            </div>

            <span className="mh2-robot" aria-hidden>🤖</span>

            <div className="mh2-computer" aria-hidden>
              <svg viewBox="0 0 100 82" fill="none">
                <rect x="18" y="8" width="64" height="45" rx="5" fill="#12132e" stroke="#FFD166" strokeWidth="4" />
                <rect x="25" y="15" width="50" height="31" rx="2" fill="#211548" stroke="#7E3FF2" strokeWidth="2" />
                <path d="M12 58 H88 L96 70 Q96 75 89 75 H11 Q4 75 4 70 Z" fill="#16133D" stroke="#FFD166" strokeWidth="4" />
              </svg>
            </div>
          </div>
        </div>

        <div className="mh2-content">
          <h1 className="mh2-hi">Hi, I'm</h1>
          <p className="mh2-name">Nourah Alotaibi</p>

          <div className="mh2-role-line">
            <span className="mh2-role-pill">Computer Engineer</span>
            <span className="mh2-role-pill mh2-alt">AI Developer</span>
          </div>

          <div className="mh2-credentials">
            <div className="mh2-cred">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10 12 5 2 10l10 5 10-5Z" />
                <path d="M6 12v5c0 1.1 2.7 2 6 2s6-.9 6-2v-5" />
              </svg>
              <span>
                <b>Major</b>: CE <span className="mh2-sep">·</span> <b>Minor</b>: AI &amp; Entrepreneurship
              </span>
            </div>
          </div>

          <p className="mh2-desc">
            I build AI systems that run locally and in the cloud, design web experiences, and enjoy solving CTFs (cybersecurity challenges).
          </p>

          <div className="mh2-actions">
            <a className="mh2-cta" href="#projects">
              <span>Explore my work</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a>

            <div className="mh2-socials">
              <a
                className="mh2-social"
                href="https://github.com/nourah-alotaibi"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.1 3.29 9.4 7.86 10.94.57.1.79-.25.79-.55v-2.15c-3.2.7-3.87-1.36-3.87-1.36-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.17.08 1.78 1.2 1.78 1.2 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.56-.29-5.25-1.28-5.25-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.64 1.59.24 2.77.12 3.06.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.4-5.27 5.69.41.36.78 1.07.78 2.16v3.2c0 .3.21.66.8.55A11.5 11.5 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
                </svg>
              </a>
              <a
                className="mh2-social"
                href="https://www.linkedin.com/in/nourah-fahad-alotaibi-14b121226/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.45 20.45h-3.56v-5.58c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.68H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45Z" />
                </svg>
              </a>
              <a className="mh2-social" href="mailto:noooriii760@gmail.com" aria-label="Email">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
                  <path d="m3 6 9 7 9-7" />
                </svg>
              </a>
            </div>
          </div>

          <div className="mh2-ticker-wrap">
            <div className="mh2-ticker">
              <span className="mh2-t-pink">🥇 1st — Gulf Countries Challenge</span> ·{" "}
              <span className="mh2-t-cyan">🥇 1st — Best Game, Cultural Game Jam S2</span> ·{" "}
              <span className="mh2-t-violet">🏆 Best Game Design — Cultural Game Jam S2</span> ·{" "}
              <span className="mh2-t-pink">🏆 Best Social Media — INJAZ Kuwait (EVA AI)</span> ·{" "}
              <span className="mh2-t-cyan">🥈 2nd — AUM Startup Challenge (EVA AI Pin)</span> ·{" "}
              <span className="mh2-t-violet">🎓 Graduated with Honors — B.Sc. CE</span> ·{" "}
              <span className="mh2-t-pink">🌍 Top 12 Worldwide — Babson Startup Challenge</span> ·{" "}
              <span className="mh2-t-cyan">🏆 Best Grad Project Nominee — UC Berkeley AI</span> ·{" "}
              <span className="mh2-t-pink">🥇 1st — Gulf Countries Challenge</span> ·{" "}
              <span className="mh2-t-cyan">🥇 1st — Best Game, Cultural Game Jam S2</span> ·{" "}
              <span className="mh2-t-violet">🏆 Best Game Design — Cultural Game Jam S2</span> ·{" "}
              <span className="mh2-t-pink">🏆 Best Social Media — INJAZ Kuwait (EVA AI)</span> ·{" "}
              <span className="mh2-t-cyan">🥈 2nd — AUM Startup Challenge (EVA AI Pin)</span> ·{" "}
              <span className="mh2-t-violet">🎓 Graduated with Honors — B.Sc. CE</span> ·{" "}
              <span className="mh2-t-pink">🌍 Top 12 Worldwide — Babson Startup Challenge</span> ·{" "}
              <span className="mh2-t-cyan">🏆 Best Grad Project Nominee — UC Berkeley AI</span> ·
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const { theme } = useTheme();
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const scrolled = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress((scrolled / max) * 100);
    };
    window.addEventListener("scroll", update);
    return () => window.removeEventListener("scroll", update);
  }, []);

  const isDark = theme === "dark";

  return (
    <div className={`min-h-screen ${isDark ? "bg-[#121321]" : "bg-[#FCFBF8]"}`}>
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-[3px] bg-white/5 z-[1000]">
        <div className="h-full bg-gradient-to-r from-indigo-400 via-purple-400 to-fuchsia-400 rounded-r transition-[width] duration-100" style={{ width: `${scrollProgress}%` }} />
      </div>

      {/* Page-wide drifting 4-point star sparkles */}
      <PageSparkles />

      {/* ── Hero Section ── */}
      <div id="hero">
        {/* Mobile hero — hidden on md+ */}
        <div className="md:hidden">
          <MobileHero />
        </div>

        {/* Desktop hero — hidden below md */}
      <section className="hidden md:flex min-h-screen flex-col items-center justify-center relative px-6 overflow-hidden" style={{ background: isDark
          ? [
              "radial-gradient(ellipse 1100px 640px at 50%  0%,  rgba(255,255,255,0.14) 0%, rgba(255,248,220,0.10) 30%, rgba(255,230,170,0.06) 55%, transparent 80%)",
              "radial-gradient(ellipse 1700px 950px at 50% -4%,  rgba(255,255,255,0.05) 0%, transparent 75%)",
              "radial-gradient(ellipse at top,          rgba(99,102,241,0.15)  0%, transparent 50%)",
              "radial-gradient(ellipse at bottom right, rgba(168,85,247,0.10)  0%, transparent 50%)",
              "radial-gradient(ellipse at bottom left,  rgba(236,72,153,0.08)  0%, transparent 50%)",
            ].join(", ")
          : [
              "radial-gradient(circle at 38% 28%, rgba(187,170,255,.88) 0%, rgba(167,148,255,.48) 32%, transparent 70%)",
              "radial-gradient(circle at 80% 10%, rgba(162,218,255,.78) 0%, transparent 70%)",
              "radial-gradient(circle at 50% 96%, rgba(255,175,215,.72) 0%, transparent 72%)",
              "radial-gradient(circle at 6%  5%,  rgba(255,210,120,.68) 0%, transparent 62%)",
              "radial-gradient(circle at 92% 70%, rgba(210,160,255,.62) 0%, transparent 64%)",
              "radial-gradient(circle at 20% 82%, rgba(150,235,205,.55) 0%, transparent 60%)",
              "radial-gradient(circle at center,  rgba(255,255,255,.30) 0%, transparent 80%)",
              "#F9F7FF",
            ].join(", ")
      }}>

        {/* Retro grid scene */}
        {isDark && <RetroGridScene />}

        {/* Decorative clouds — light mode only */}
        {!isDark && heroCloudData.map((c, i) => <Cloud key={i} {...c} />)}

        {/* Theme Toggle — moved to horizontal center of hero */}
        {/* <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50">
          <button
            onClick={toggleTheme}
            className={`w-11 h-11 rounded-full border backdrop-blur-xl flex items-center justify-center transition-all duration-300 hover:scale-105 ${isDark ? "border-white/10 bg-[rgba(15,15,40,0.8)] text-[#c4b5fd] hover:bg-[rgba(139,92,246,0.2)] hover:border-[rgba(139,92,246,0.4)]" : "border-purple-200 bg-white/80 text-purple-600 hover:bg-purple-50 hover:border-purple-300"}`}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div> */}

        {/* Sparkles — warm gold in light mode, purple-tinted in dark mode */}
        {isDark
          ? [...Array(8)].map((_, i) => (
              <span key={i} className="absolute text-base animate-[sparkle_4s_ease-in-out_infinite] pointer-events-none opacity-30" style={{ left: `${10 + i * 12}%`, top: `${15 + (i % 3) * 25}%`, animationDelay: `${i * 0.4}s` }}>✨</span>
            ))
          : [...Array(8)].map((_, i) => {
              const goldColors = ["#F6B35C", "#FFD07A", "#F9C18A"];
              const sizes = [12, 16, 14, 18, 12, 20, 14, 16];
              return (
                <span key={i} className="absolute animate-[sparkle_6s_ease-in-out_infinite] pointer-events-none select-none leading-none" style={{ left: `${8 + i * 11}%`, top: `${18 + (i % 3) * 24}%`, animationDelay: `${i * 0.7}s`, color: goldColors[i % 3], fontSize: sizes[i] + "px", opacity: 0 }}>✦</span>
              );
            })
        }

        {/* Tiny colored sparkle dots in hero */}
        {[...Array(12)].map((_, i) => (
          <span key={`dot-${i}`} className="absolute text-[8px] animate-[sparkle_3s_ease-in-out_infinite] pointer-events-none" style={{ left: `${5 + i * 8}%`, top: `${10 + (i % 4) * 22}%`, animationDelay: `${i * 0.5}s`, color: cardSparkleColors[i % 12] }}>●</span>
        ))}

        {/* Glowing starfield + drifting emojis — mirrors the mobile hero */}
        {isDark && (
          <div className="dh-stars" aria-hidden>
            {DESKTOP_HERO_STARS.map((s, i) => (
              <span
                key={`hstar-${i}`}
                className={s.bright ? "dh-star dh-star-bright" : "dh-star"}
                style={{
                  width: `${s.size}px`,
                  height: `${s.size}px`,
                  top: `${s.top}%`,
                  left: `${s.left}%`,
                  animationDelay: `${s.delay}s`,
                  animationDuration: `${s.dur}s`,
                  boxShadow: `0 0 ${s.glow}px ${s.glow / 3}px rgba(255,255,255,${s.bright ? 0.35 : 0.16})`,
                }}
              />
            ))}
          </div>
        )}
        {isDark && (
          <div className="dh-emojis" aria-hidden>
            {HERO_BG_EMOJIS.map((e, i) => (
              <span key={`hemoji-${i}`} className="dh-emoji" style={{ ...e.style, animationDelay: e.delay }}>
                {e.ch}
              </span>
            ))}
          </div>
        )}

        <div className="flex flex-row items-center justify-center gap-3 md:gap-16 max-w-[1100px] w-full relative z-10">
          {/* Portrait - left side */}
          <motion.div
            className="flex-shrink-0 relative"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            <img
              src="/nora-dark/image.png"
              alt="Nourah Alotaibi"
              className="h-[22vh] md:h-[75vh] max-h-[150px] md:max-h-[700px] min-h-[80px] md:min-h-[300px] w-auto object-contain animate-[portraitFloat_4s_ease-in-out_infinite]"
            />
          </motion.div>

          {/* Text - right side */}
          <motion.div
            className="text-left max-w-[520px] min-w-0"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          >
            <div className="hero-title-wrapper mb-1 md:mb-4">
              <h1 className={`hero-title text-[1rem] sm:text-5xl md:text-[3.5rem] font-extrabold leading-tight ${isDark ? "" : "text-purple-900"}`}>
                Hi, I'm <span className="hero-name-nourah">Nourah</span> <span className="hero-name-alotaibi">Alotaibi!</span> 👋🏻
              </h1>
              {isDark && (
                <>
                  <span className="title-sparkle sparkle-one">✦</span>
                  <span className="title-sparkle sparkle-two">✧</span>
                  <span className="title-sparkle sparkle-three">✨</span>
                </>
              )}
            </div>
            <div className="dh-socials">
              <a
                className="dh-social"
                href="https://github.com/nourah-alotaibi"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <Github />
              </a>
              <a
                className="dh-social"
                href="https://www.linkedin.com/in/nourah-fahad-alotaibi-14b121226/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <Linkedin />
              </a>
              <a
                className="dh-social"
                href="mailto:noooriii760@gmail.com"
                aria-label="Email"
              >
                <Mail />
              </a>
            </div>
            <h2 className={`text-[0.6rem] sm:text-xl md:text-2xl font-medium mb-1 md:mb-5 ${isDark ? "text-[#c4b5fd]" : "text-purple-600"}`}>
              Computer Engineer | AI Developer
            </h2>
            <p className={`dh-hero-desc text-[0.55rem] leading-4 mb-2 md:text-base md:leading-7 md:mb-6 ${isDark ? "text-[rgba(203,213,225,0.8)]" : "text-gray-600"}`}>
              I build AI systems that run locally and in the cloud, design web experiences, and enjoy solving CTFs (cybersecurity challenges).
            </p>
            <a href="#projects" className="premium-btn inline-flex items-center gap-1 md:gap-2 px-2.5 py-1 md:px-6 md:py-3 rounded-full font-semibold text-[0.55rem] md:text-sm text-white">
              <Sparkles className="w-2.5 h-2.5 md:w-4 md:h-4" />
              Explore My Work
            </a>

            <DesktopAwardsTicker />
          </motion.div>
        </div>

        <motion.div className={`absolute bottom-8 ${isDark ? "text-[rgba(196,181,253,0.5)]" : "text-purple-300"}`} animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </section>
      </div>{/* end #hero wrapper */}

      <ProjectsSection />

      {/* ── Journey Section ── */}
      <section
        id="journey"
        className="py-3 md:py-16 px-2 md:px-6 relative overflow-hidden"
        style={{
          background: isDark
            ? [
                "radial-gradient(ellipse 600px 400px at 20% 85%, rgba(30,80,180,0.18) 0%, transparent 70%)",
                "radial-gradient(ellipse 500px 350px at 80% 90%, rgba(56,120,220,0.14) 0%, transparent 65%)",
                "linear-gradient(180deg, #0d1018 0%, #111420 28%, #15192a 48%, #182033 65%, #1b2841 82%, #26334a 100%)",
              ].join(", ")
            : [
                "radial-gradient(ellipse 700px 560px at 100% 0%, rgba(167,139,250,0.28) 0%, rgba(196,181,253,0.12) 45%, transparent 72%)",
                "radial-gradient(ellipse 600px 500px at 0% 0%, rgba(192,132,252,0.22) 0%, rgba(167,139,250,0.08) 42%, transparent 70%)",
                "radial-gradient(circle at 58% 28%, rgba(240,200,235,.70) 0%, rgba(240,200,235,.32) 32%, transparent 70%)",
                "radial-gradient(circle at 88% 12%, rgba(190,224,255,.62) 0%, transparent 72%)",
                "radial-gradient(circle at 8%  10%, rgba(200,196,255,.58) 0%, transparent 70%)",
                "radial-gradient(circle at 50% 92%, rgba(255,236,168,.52) 0%, transparent 68%)",
                "radial-gradient(circle at center,  rgba(255,255,255,.22) 0%, transparent 80%)",
                "radial-gradient(circle at center,  rgba(255,255,255,.10) 0%, transparent 100%)",
                "#FCFBF8",
              ].join(", "),
        }}
      >
        {/* Dark mode atmospheric blobs */}
        {isDark && (
          <>
            <div className="absolute pointer-events-none rounded-full" style={{ top: "-8%", left: "10%", width: 600, height: 600, background: "radial-gradient(circle, rgba(74,22,143,0.55), transparent 70%)", filter: "blur(100px)", animation: "blob-drift-1 28s ease-in-out infinite", opacity: 0.22 }} />
            <div className="absolute pointer-events-none rounded-full" style={{ top: "40%", right: "5%", width: 480, height: 480, background: "radial-gradient(circle, rgba(118,37,217,0.45), transparent 70%)", filter: "blur(90px)", animation: "blob-drift-2 22s ease-in-out 4s infinite", opacity: 0.18 }} />
            <div className="absolute pointer-events-none rounded-full" style={{ bottom: "10%", left: "25%", width: 400, height: 400, background: "radial-gradient(circle, rgba(95,168,255,0.3), transparent 70%)", filter: "blur(110px)", animation: "blob-drift-3 32s ease-in-out 9s infinite", opacity: 0.1 }} />
          </>
        )}

        {/* Tiny white disappearing stars — fades toward bottom */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 2, WebkitMaskImage: "linear-gradient(to bottom, #000 0%, #000 35%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,0.15) 80%, transparent 100%)", maskImage: "linear-gradient(to bottom, #000 0%, #000 35%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,0.15) 80%, transparent 100%)" }} aria-hidden>
          {JOURNEY_BG_STARS.map(s => (
            <span
              key={s.id}
              className="absolute select-none leading-none"
              style={{
                left: s.left,
                top: s.top,
                fontSize: s.sz + "px",
                color: "#ffffff",
                animation: `sparkle ${s.dur} ease-in-out ${s.del} infinite`,
              }}
            >
              {s.ch}
            </span>
          ))}
        </div>

        {/* Journey floating sparkles */}
        <div className="pa-emoji-sparks" aria-hidden>
          {JOURNEY_SPARKLES.map(s => (
            <span
              key={s.id}
              className={`pa-emoji-spark${s.color ? " diamond" : ""}`}
              style={{
                left: s.left,
                top: s.top,
                fontSize: s.size + "px",
                color: s.color ?? undefined,
                "--pes-dur": s.dur,
                "--pes-del": s.delay,
                "--pes-op": s.op,
              } as React.CSSProperties}
            >
              {s.emoji}
            </span>
          ))}
        </div>

        {/* Rotating sparkle emojis */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 3 }} aria-hidden>
          {JOURNEY_ROTATE_SPARKS.map(s => (
            <span
              key={s.id}
              className="absolute select-none leading-none"
              style={{
                left: s.left,
                top: s.top,
                fontSize: s.size + "px",
                opacity: 0,
                "--pes-dur": s.dur,
                "--pes-del": s.delay,
                "--pes-op": s.op,
                animation: `journey-spin-float ${s.dur} ease-in-out ${s.delay} infinite`,
              } as React.CSSProperties}
            >
              {s.emoji}
            </span>
          ))}
        </div>

        <motion.div className="text-center mb-2 md:mb-8 relative z-10" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
          <h2 className="section-heading text-base sm:text-3xl md:text-4xl font-extrabold mb-1 md:mb-2">My Journey</h2>
          <p className="section-subtitle text-[0.6rem] md:text-base">Every chapter shaped who I am today</p>
        </motion.div>

        <ShootingStar />

        <div className="journey-grid relative z-10">
          {journeyChapters.map((chapter, index) => (
            <JourneyCard key={index} chapter={chapter} index={index} />
          ))}
        </div>
      </section>




      {/* ── Contact Section ── */}
      <section
        id="contact"
        className="py-6 md:py-24 px-3 md:px-6 relative overflow-hidden"
        style={{
          background: isDark
            ? "linear-gradient(175deg, #26334a 0%, #2c3b55 55%, #303950 100%)"
            : [
                "radial-gradient(circle at 28% 20%, rgba(240,200,235,.30) 0%, rgba(240,200,235,.12) 30%, transparent 70%)",
                "radial-gradient(circle at 80% 10%, rgba(220,180,255,.26) 0%, transparent 72%)",
                "radial-gradient(circle at 10% 82%, rgba(200,160,255,.22) 0%, transparent 70%)",
                "radial-gradient(circle at 75% 80%, rgba(255,210,240,.24) 0%, transparent 68%)",
                "radial-gradient(circle at 50% 45%, rgba(230,190,255,.18) 0%, transparent 72%)",
                "radial-gradient(circle at center,  rgba(255,255,255,.35) 0%, transparent 80%)",
                "radial-gradient(circle at center,  rgba(255,255,255,.18) 0%, transparent 100%)",
                "#FCFBF8",
              ].join(", "),
        }}
      >
        {isDark && (
          <>
            <div className="absolute pointer-events-none rounded-full" style={{ top: "10%", left: "30%", width: 500, height: 500, background: "radial-gradient(circle, rgba(88,28,135,0.55), transparent 70%)", filter: "blur(110px)", animation: "blob-drift-1 26s ease-in-out 2s infinite", opacity: 0.2 }} />
            <div className="absolute pointer-events-none rounded-full" style={{ bottom: "-5%", right: "20%", width: 380, height: 380, background: "radial-gradient(circle, rgba(118,37,217,0.45), transparent 70%)", filter: "blur(95px)", animation: "blob-drift-2 20s ease-in-out 10s infinite", opacity: 0.15 }} />
          </>
        )}

        <motion.div className="text-center mb-5 md:mb-16 relative z-10" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
          <h2 className="section-heading text-lg sm:text-4xl md:text-5xl font-extrabold mb-1 md:mb-3">Let's Connect</h2>
          <p className="section-subtitle text-[0.6rem] md:text-base">Ready to discuss AI innovation, education, or potential collaborations?</p>
        </motion.div>

        <div className="max-w-[500px] mx-auto flex flex-col gap-2 md:gap-6 relative z-10">
          <a href="mailto:noooriii760@gmail.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 md:gap-4 group">
            <div className={`w-7 h-7 md:w-11 md:h-11 rounded-lg md:rounded-xl flex items-center justify-center ${isDark ? "bg-gradient-to-br from-[rgba(139,92,246,0.2)] to-[rgba(168,85,247,0.2)] border border-[rgba(139,92,246,0.3)] text-[#c4b5fd]" : "bg-purple-100 border border-purple-200 text-purple-600"}`}><Mail className="w-3 h-3 md:w-5 md:h-5" /></div>
            <div><p className={`text-[0.55rem] md:text-xs font-medium ${isDark ? "text-[#a78bfa]" : "text-purple-500"}`}>Email</p><p className={`text-[0.6rem] md:text-sm group-hover:underline ${isDark ? "text-[#f5f3ff]" : "text-purple-900"}`}>noooriii760@gmail.com</p></div>
          </a>
          <a href="https://github.com/nourah-alotaibi" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 md:gap-4 group">
            <div className={`w-7 h-7 md:w-11 md:h-11 rounded-lg md:rounded-xl flex items-center justify-center ${isDark ? "bg-gradient-to-br from-[rgba(139,92,246,0.2)] to-[rgba(168,85,247,0.2)] border border-[rgba(139,92,246,0.3)] text-[#c4b5fd]" : "bg-purple-100 border border-purple-200 text-purple-600"}`}><Globe className="w-3 h-3 md:w-5 md:h-5" /></div>
            <div><p className={`text-[0.55rem] md:text-xs font-medium ${isDark ? "text-[#a78bfa]" : "text-purple-500"}`}>GitHub</p><p className={`text-[0.6rem] md:text-sm group-hover:underline ${isDark ? "text-[#f5f3ff]" : "text-purple-900"}`}>@nourah-alotaibi</p></div>
          </a>
          <a href="https://www.linkedin.com/in/nourah-fahad-alotaibi-14b121226/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 md:gap-4 group">
            <div className={`w-7 h-7 md:w-11 md:h-11 rounded-lg md:rounded-xl flex items-center justify-center ${isDark ? "bg-gradient-to-br from-[rgba(139,92,246,0.2)] to-[rgba(168,85,247,0.2)] border border-[rgba(139,92,246,0.3)] text-[#c4b5fd]" : "bg-purple-100 border border-purple-200 text-purple-600"}`}><Linkedin className="w-3 h-3 md:w-5 md:h-5" /></div>
            <div><p className={`text-[0.55rem] md:text-xs font-medium ${isDark ? "text-[#a78bfa]" : "text-purple-500"}`}>LinkedIn</p><p className={`text-[0.6rem] md:text-sm group-hover:underline ${isDark ? "text-[#f5f3ff]" : "text-purple-900"}`}>Nourah Alotaibi</p></div>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-4 md:py-12 px-3 md:px-6 text-center border-t relative z-10 ${isDark ? "border-[rgba(139,92,246,0.1)]" : "border-purple-100"}`}>
        <p className={`text-[0.6rem] md:text-sm ${isDark ? "text-[rgba(148,163,184,0.6)]" : "text-gray-500"}`}>© 2025 Nourah Alotaibi. Passionate about AI innovation and education.</p>
        <p className={`mt-1 md:mt-3 text-[0.6rem] md:text-sm italic ${isDark ? "text-[rgba(196,181,253,0.5)]" : "text-purple-400"}`}>"Technology is best when it brings people together and creates meaningful impact."</p>
      </footer>
    </div>
  );
}
