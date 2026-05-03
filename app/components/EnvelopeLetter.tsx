"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useAnimation, type Variants } from "framer-motion";

type Props = {
  title: string;
  body: string;
  signoff: string;
};

type Particle = {
  id: number;
  angle: number;
  dist: number;
  spin: number;
  symbol: string;
};

function makeParticles(): Particle[] {
  const symbols = ["♥", "✿", "♡", "✦", "❀", "✾"];
  return Array.from({ length: 18 }, (_, i) => ({
    id: i,
    angle: (i / 18) * 360 + Math.random() * 20 - 10,
    dist: 90 + Math.random() * 110,
    spin: Math.random() * 360 - 180,
    symbol: symbols[i % symbols.length],
  }));
}

export default function EnvelopeLetter({ title, body, signoff }: Props) {
  const [phase, setPhase] = useState<"sealed" | "opening" | "open">("sealed");
  const [particles, setParticles] = useState<Particle[]>([]);
  const flapControls = useAnimation();
  const sealControls = useAnimation();
  const letterControls = useAnimation();
  const particleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const paragraphs = body.split("\n\n").filter(Boolean);

  async function handleOpen() {
    if (phase !== "sealed") return;
    setPhase("opening");
    setParticles(makeParticles());

    // 1. Seal shatters
    await sealControls.start({
      scale: [1, 1.25, 0],
      rotate: [0, -15, 20],
      opacity: [1, 1, 0],
      transition: { duration: 0.45, ease: "easeIn" },
    });

    // 2. Flap opens (3D rotateX)
    flapControls.start({
      rotateX: -185,
      transition: { type: "spring", stiffness: 70, damping: 14, delay: 0.05 },
    });

    // 3. Letter rises
    await letterControls.start({
      y: -230,
      opacity: 1,
      transition: { delay: 0.35, duration: 0.9, ease: [0.22, 1, 0.36, 1] },
    });

    // 4. Clean up particles after they animate out
    particleTimerRef.current = setTimeout(() => {
      setParticles([]);
      setPhase("open");
    }, 1800);
  }

  useEffect(() => {
    return () => {
      if (particleTimerRef.current) clearTimeout(particleTimerRef.current);
    };
  }, []);

  const envelopeW = 340;
  const envelopeH = 220;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 relative z-10">

      {/* ── Hint text ── */}
      <AnimatePresence>
        {phase === "sealed" && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="hint-bounce mb-10 tracking-widest uppercase text-xs select-none"
            style={{
              fontFamily: "var(--font-lato)",
              color: "#e06080",
              letterSpacing: "0.22em",
            }}
          >
            tap the seal to open ♥
          </motion.p>
        )}
      </AnimatePresence>

      {/* ── Envelope + letter wrapper ── */}
      <div
        className="relative flex items-center justify-center"
        style={{ width: envelopeW, height: envelopeH + 240 }}
      >
        {/* ── Letter card (behind envelope, rises up) ── */}
        <motion.div
          initial={{ y: 0, opacity: 0 }}
          animate={letterControls}
          className="absolute z-10 rounded-xl overflow-hidden"
          style={{
            width: envelopeW - 24,
            top: "50%",
            marginTop: -envelopeH * 0.5 + 20,
            left: 12,
            filter: "drop-shadow(0 12px 40px rgba(136,19,55,0.18))",
          }}
        >
          <LetterCard
            title={title}
            paragraphs={paragraphs}
            signoff={signoff}
            isOpen={phase === "open"}
          />
        </motion.div>

        {/* ── Envelope body ── */}
        <div
          className={`absolute bottom-0 left-0 right-0 ${phase === "sealed" ? "envelope-bob" : ""} cursor-pointer`}
          style={{ height: envelopeH, zIndex: 20 }}
          onClick={handleOpen}
        >
          <div className="envelope-scene w-full h-full">
            {/* Back panel */}
            <div
              className="absolute inset-0 rounded-b-xl"
              style={{ background: "linear-gradient(160deg, #f5c9bb 0%, #edb5a5 100%)" }}
            />

            {/* Side flaps (decorative triangles) */}
            <div
              className="absolute inset-0"
              style={{
                clipPath: "polygon(0 0, 0 100%, 50% 55%)",
                background: "linear-gradient(135deg, #e8a898, #dfa090)",
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                clipPath: "polygon(100% 0, 50% 55%, 100% 100%)",
                background: "linear-gradient(225deg, #e8a898, #dfa090)",
              }}
            />

            {/* Bottom flap (front pocket shape) */}
            <div
              className="absolute inset-0 rounded-b-xl"
              style={{
                clipPath: "polygon(0 100%, 50% 55%, 100% 100%)",
                background: "linear-gradient(180deg, #f0b8a8, #e8a898)",
              }}
            />

            {/* Inner shadow / depth lines */}
            <div
              className="absolute inset-0 rounded-b-xl pointer-events-none"
              style={{
                boxShadow: "inset 0 -6px 24px rgba(160,60,60,0.12), 0 8px 32px rgba(180,60,60,0.15)",
              }}
            />

            {/* Envelope inner paper visible at top */}
            <div
              className="absolute top-0 left-4 right-4 rounded-sm"
              style={{
                height: 28,
                background: "linear-gradient(180deg, #fff8f5 0%, #ffeee8 100%)",
                boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
              }}
            />

            {/* Top flap — animates open */}
            <motion.div
              animate={flapControls}
              initial={{ rotateX: 0 }}
              className="absolute top-0 left-0 right-0 envelope-flap"
              style={{
                height: envelopeH,
                clipPath: "polygon(0 0, 100% 0, 50% 55%)",
                background: "linear-gradient(180deg, #f0b4a0 0%, #e8a898 60%, #dfa090 100%)",
                transformOrigin: "top center",
                zIndex: phase === "sealed" ? 30 : 5,
              }}
            >
              {/* Subtle fold crease line */}
              <div
                className="absolute left-0 right-0"
                style={{
                  top: "54%",
                  height: 1,
                  background: "linear-gradient(90deg, transparent, rgba(180,80,80,0.2), transparent)",
                }}
              />
            </motion.div>

            {/* Wax seal — sits at the flap point */}
            <AnimatePresence>
              {phase === "sealed" && (
                <motion.button
                  animate={sealControls}
                  exit={{ scale: 0, opacity: 0 }}
                  className="absolute wax-seal flex items-center justify-center select-none"
                  style={{
                    width: 52,
                    height: 52,
                    top: "50%",
                    left: "50%",
                    marginLeft: -26,
                    marginTop: -20,
                    zIndex: 40,
                    borderRadius: "50%",
                    background: "radial-gradient(ellipse at 38% 32%, #ef4444, #dc2626 50%, #7f1d1d)",
                    border: "2.5px solid rgba(220,38,38,0.35)",
                    cursor: "pointer",
                  }}
                  aria-label="Open envelope"
                >
                  <span className="text-white text-lg leading-none" style={{ textShadow: "0 1px 3px rgba(0,0,0,0.4)" }}>
                    ♥
                  </span>
                </motion.button>
              )}
            </AnimatePresence>

            {/* Particle burst — originates from seal position */}
            {particles.map((p) => (
              <span
                key={p.id}
                className="heart-particle"
                style={{
                  top: "calc(50% - 20px)",
                  left: "calc(50% - 0px)",
                  ["--angle" as string]: `${p.angle}deg`,
                  ["--dist" as string]: `${p.dist}px`,
                  ["--spin" as string]: `${p.spin}deg`,
                  animationDelay: `${p.id * 0.025}s`,
                  color: p.id % 3 === 0 ? "#f9a8d4" : p.id % 3 === 1 ? "#f43f5e" : "#fbbf24",
                  fontSize: `${0.8 + Math.random() * 0.6}rem`,
                }}
              >
                {p.symbol}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Full letter view after open ── */}
      <AnimatePresence>
        {phase === "open" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative z-10 w-full max-w-xl mt-8"
          >
            <FullLetter title={title} paragraphs={paragraphs} signoff={signoff} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Compact letter card visible rising from envelope ── */
function LetterCard({
  title,
  paragraphs,
  signoff,
  isOpen,
}: {
  title: string;
  paragraphs: string[];
  signoff: string;
  isOpen: boolean;
}) {
  return (
    <div
      style={{
        background: "linear-gradient(160deg, #fffdf9 0%, #fff5f7 100%)",
        border: "1px solid rgba(253,164,175,0.3)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.9)",
        borderTop: "4px solid #fda4af",
        padding: "20px 24px 16px",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-playfair)",
          fontSize: "1.15rem",
          fontStyle: "italic",
          color: "#881337",
          marginBottom: 8,
        }}
      >
        {title}
      </p>
      {paragraphs[0] && (
        <p
          style={{
            fontFamily: "var(--font-lato)",
            fontSize: "0.82rem",
            color: "#4a2030",
            fontWeight: 300,
            lineHeight: 1.65,
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
          }}
        >
          {paragraphs[0]}
        </p>
      )}
      <p
        className="text-right mt-3"
        style={{
          fontFamily: "var(--font-playfair)",
          fontSize: "0.9rem",
          fontStyle: "italic",
          color: "#881337",
        }}
      >
        {signoff} ♡
      </p>
    </div>
  );
}

/* ── Full beautiful letter shown after open ── */
function FullLetter({
  title,
  paragraphs,
  signoff,
}: {
  title: string;
  paragraphs: string[];
  signoff: string;
}) {
  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.1 },
    },
  };
  const item: Variants = {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
  };

  return (
    <div
      className="rounded-2xl px-10 py-14 sm:px-14 sm:py-16 relative overflow-hidden"
      style={{
        background: "linear-gradient(160deg, #fffdf9 0%, #fffaf5 40%, #fff5f7 100%)",
        boxShadow:
          "0 2px 4px rgba(0,0,0,0.04), 0 8px 32px rgba(190,18,60,0.10), inset 0 1px 0 rgba(255,255,255,0.9)",
        border: "1px solid rgba(253, 164, 175, 0.25)",
      }}
    >
      {/* Paper grain */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.025'/%3E%3C/svg%3E")`,
          backgroundSize: "256px",
        }}
      />

      <motion.div variants={container} initial="hidden" animate="show">
        {/* Top ornament */}
        <motion.div variants={item} className="flex items-center gap-3 mb-8">
          <div
            className="flex-1 h-px"
            style={{ background: "linear-gradient(90deg, transparent, #fda4af80, transparent)" }}
          />
          <span style={{ color: "#fda4af" }}>✦</span>
          <div
            className="flex-1 h-px"
            style={{ background: "linear-gradient(90deg, transparent, #fda4af80, transparent)" }}
          />
        </motion.div>

        {/* Date */}
        <motion.p
          variants={item}
          className="text-right mb-6 tracking-widest uppercase text-xs"
          style={{ fontFamily: "var(--font-lato)", color: "#d4a0aa", letterSpacing: "0.18em" }}
        >
          {new Date().toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </motion.p>

        {/* Title */}
        <motion.h1
          variants={item}
          className="text-4xl sm:text-5xl mb-8 leading-tight text-center"
          style={{ fontFamily: "var(--font-playfair)", color: "#881337", fontStyle: "italic" }}
        >
          {title}
        </motion.h1>

        {/* SVG ornament divider */}
        <motion.div variants={item} className="flex justify-center mb-8">
          <svg width="180" height="18" viewBox="0 0 180 18" fill="none">
            <line x1="0" y1="9" x2="72" y2="9" stroke="#fda4af" strokeWidth="1" strokeDasharray="3 4" />
            <path d="M84 2 Q90 9 84 16 Q90 9 96 2 Q90 9 96 16 Q90 9 84 2Z" fill="#f9a8d4" />
            <circle cx="90" cy="9" r="3" fill="#fda4af" />
            <line x1="108" y1="9" x2="180" y2="9" stroke="#fda4af" strokeWidth="1" strokeDasharray="3 4" />
          </svg>
        </motion.div>

        {/* Body */}
        <div className="space-y-6">
          {paragraphs.map((para, i) => (
            <motion.p
              key={i}
              variants={item}
              className="leading-8 text-lg"
              style={{
                fontFamily: "var(--font-lato)",
                color: "#4a2030",
                fontWeight: 300,
                textIndent: "2em",
              }}
            >
              {para}
            </motion.p>
          ))}
        </div>

        {/* Sign-off */}
        <motion.div variants={item} className="mt-12 text-right">
          <p
            className="text-sm mb-2 tracking-widest uppercase"
            style={{ fontFamily: "var(--font-lato)", color: "#d4a0aa", letterSpacing: "0.15em" }}
          >
            With all my love,
          </p>
          <p
            className="text-3xl"
            style={{ fontFamily: "var(--font-playfair)", color: "#881337", fontStyle: "italic" }}
          >
            {signoff}
          </p>
        </motion.div>

        {/* Bottom ornament */}
        <motion.div variants={item} className="flex items-center gap-3 mt-10">
          <div
            className="flex-1 h-px"
            style={{ background: "linear-gradient(90deg, transparent, #fda4af80, transparent)" }}
          />
          <span style={{ color: "#fda4af" }}>✦</span>
          <div
            className="flex-1 h-px"
            style={{ background: "linear-gradient(90deg, transparent, #fda4af80, transparent)" }}
          />
        </motion.div>
      </motion.div>

      {/* Wax seal at bottom */}
      <div className="flex justify-center mt-[-28px] translate-y-10 relative z-20">
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.8, type: "spring", stiffness: 200, damping: 15 }}
          className="wax-seal w-14 h-14 rounded-full flex items-center justify-center text-xl select-none"
          style={{
            background: "radial-gradient(ellipse at 35% 35%, #ef4444, #dc2626 60%, #7f1d1d)",
            border: "3px solid rgba(190,18,60,0.25)",
          }}
        >
          ❤
        </motion.div>
      </div>
    </div>
  );
}
