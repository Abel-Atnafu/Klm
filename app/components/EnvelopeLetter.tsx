"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useAnimation, type Variants } from "framer-motion";

type Props = { title: string; body: string; signoff: string };

type Particle = { id: number; angle: number; dist: number };

function makeParticles(): Particle[] {
  return Array.from({ length: 10 }, (_, i) => ({
    id: i,
    angle: (i / 10) * 360 + Math.random() * 15,
    dist: 70 + Math.random() * 80,
  }));
}

export default function EnvelopeLetter({ title, body, signoff }: Props) {
  const [phase, setPhase] = useState<"sealed" | "opening" | "open">("sealed");
  const [particles, setParticles] = useState<Particle[]>([]);
  const flapControls = useAnimation();
  const sealControls = useAnimation();
  const letterControls = useAnimation();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const paragraphs = body.split("\n\n").filter(Boolean);

  async function handleOpen() {
    if (phase !== "sealed") return;

    // 1. Animate the seal away FIRST — it must still be mounted for this to work
    await sealControls.start({
      scale: 0,
      opacity: 0,
      transition: { duration: 0.28, ease: "easeIn" },
    });

    // 2. Now it's safe to change phase (seal unmounts invisibly)
    setPhase("opening");
    setParticles(makeParticles());

    // 3. Flap swings open
    flapControls.start({
      rotateX: -178,
      transition: { type: "spring", stiffness: 55, damping: 11 },
    });

    // 4. Letter rises out
    await letterControls.start({
      y: -200,
      opacity: 1,
      transition: { delay: 0.28, duration: 0.9, ease: [0.22, 1, 0.36, 1] },
    });

    // 5. Switch to fully-open state
    timerRef.current = setTimeout(() => {
      setParticles([]);
      setPhase("open");
    }, 1400);
  }

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const W = 340;
  const H = 216;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 relative z-10">

      {/* Hint */}
      <AnimatePresence>
        {phase === "sealed" && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="hint-bounce mb-10 tracking-widest uppercase text-xs select-none pointer-events-none"
            style={{ fontFamily: "var(--font-lato)", color: "#e06080", letterSpacing: "0.22em" }}
          >
            tap the seal to open ♥
          </motion.p>
        )}
      </AnimatePresence>

      {/* Envelope + letter scene */}
      <div className="relative flex items-center justify-center" style={{ width: W, height: H + 240 }}>

        {/* Letter card — starts hidden inside, rises out */}
        <motion.div
          initial={{ y: 0, opacity: 0 }}
          animate={letterControls}
          className="absolute z-10 rounded-lg overflow-hidden"
          style={{
            width: W - 28,
            top: "50%",
            marginTop: -H * 0.5 + 16,
            left: 14,
            boxShadow: "0 16px 48px rgba(190,18,60,0.16)",
          }}
        >
          <PeekCard title={title} paragraphs={paragraphs} signoff={signoff} />
        </motion.div>

        {/* Envelope */}
        <div
          className={`absolute bottom-0 left-0 right-0 cursor-pointer ${phase === "sealed" ? "envelope-bob" : ""}`}
          style={{ height: H, zIndex: 20 }}
          onClick={handleOpen}
          role="button"
          aria-label="Open envelope"
        >
          <div className="envelope-scene relative w-full h-full">

            {/* Back (base) */}
            <div
              className="absolute inset-0 rounded-b-2xl"
              style={{ background: "linear-gradient(160deg, #fce7f3 0%, #fecdd3 100%)" }}
            />

            {/* Left triangle flap */}
            <div
              className="absolute inset-0"
              style={{
                clipPath: "polygon(0 0, 0 100%, 50% 52%)",
                background: "linear-gradient(135deg, #fda4af, #f9a8d4)",
              }}
            />

            {/* Right triangle flap */}
            <div
              className="absolute inset-0"
              style={{
                clipPath: "polygon(100% 0, 50% 52%, 100% 100%)",
                background: "linear-gradient(225deg, #fda4af, #f9a8d4)",
              }}
            />

            {/* Bottom triangle (pocket) */}
            <div
              className="absolute inset-0 rounded-b-2xl"
              style={{
                clipPath: "polygon(0 100%, 50% 52%, 100% 100%)",
                background: "linear-gradient(180deg, #fecdd3, #fda4af)",
              }}
            />

            {/* Drop shadow + inner glow */}
            <div
              className="absolute inset-0 rounded-b-2xl pointer-events-none"
              style={{
                boxShadow:
                  "inset 0 -4px 20px rgba(244,114,182,0.10), 0 10px 40px rgba(244,114,182,0.20)",
              }}
            />

            {/* White paper peek at top */}
            <div
              className="absolute top-0 left-5 right-5"
              style={{
                height: 24,
                background: "linear-gradient(180deg, #fffdf9, #fff0f5)",
                borderRadius: "0 0 2px 2px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              }}
            />

            {/* Top flap — the one that opens */}
            <motion.div
              animate={flapControls}
              initial={{ rotateX: 0 }}
              className="absolute top-0 left-0 right-0 envelope-flap"
              style={{
                height: H,
                clipPath: "polygon(0 0, 100% 0, 50% 52%)",
                background: "linear-gradient(175deg, #fce7f3 0%, #fecdd3 55%, #fda4af 100%)",
                transformOrigin: "top center",
                zIndex: phase === "sealed" ? 30 : 4,
              }}
            />

            {/* Wax seal — still mounted while phase === "sealed", animated away by sealControls */}
            {phase === "sealed" && (
              <motion.button
                animate={sealControls}
                className="wax-seal absolute flex items-center justify-center select-none"
                style={{
                  width: 54,
                  height: 54,
                  top: "50%",
                  left: "50%",
                  marginLeft: -27,
                  marginTop: -22,
                  zIndex: 40,
                  borderRadius: "50%",
                  background: "radial-gradient(ellipse at 36% 30%, #f43f5e, #dc2626 55%, #7f1d1d)",
                  border: "2.5px solid rgba(220,38,38,0.3)",
                  cursor: "pointer",
                }}
                onClick={handleOpen}
              >
                <span
                  className="text-white text-lg leading-none"
                  style={{ textShadow: "0 1px 4px rgba(0,0,0,0.35)" }}
                >
                  ♥
                </span>
              </motion.button>
            )}

            {/* Heart particles */}
            {particles.map((p) => (
              <span
                key={p.id}
                className="heart-particle"
                style={{
                  ["--angle" as string]: `${p.angle}deg`,
                  ["--dist" as string]: `${p.dist}px`,
                  color: p.id % 2 === 0 ? "#f43f5e" : "#f9a8d4",
                }}
              >
                ♥
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Full letter — shown after animation completes */}
      <AnimatePresence>
        {phase === "open" && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative z-10 w-full max-w-xl mt-6"
          >
            <FullLetter title={title} paragraphs={paragraphs} signoff={signoff} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* Small card that peeks out of the envelope as it rises */
function PeekCard({ title, paragraphs, signoff }: { title: string; paragraphs: string[]; signoff: string }) {
  return (
    <div
      style={{
        background: "linear-gradient(160deg, #fffdf9, #fff5f7)",
        borderTop: "3px solid #fda4af",
        padding: "18px 22px 14px",
      }}
    >
      <p style={{ fontFamily: "var(--font-playfair)", fontSize: "1.1rem", fontStyle: "italic", color: "#881337", marginBottom: 6 }}>
        {title}
      </p>
      {paragraphs[0] && (
        <p
          style={{
            fontFamily: "var(--font-lato)",
            fontSize: "0.8rem",
            color: "#4a2030",
            fontWeight: 300,
            lineHeight: 1.6,
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
          }}
        >
          {paragraphs[0]}
        </p>
      )}
      <p style={{ fontFamily: "var(--font-playfair)", fontSize: "0.85rem", fontStyle: "italic", color: "#881337", textAlign: "right", marginTop: 10 }}>
        {signoff} ♡
      </p>
    </div>
  );
}

/* Full letter revealed after the envelope interaction */
function FullLetter({ title, paragraphs, signoff }: { title: string; paragraphs: string[]; signoff: string }) {
  const container: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
  };
  const item: Variants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" as const } },
  };

  return (
    <div
      className="rounded-2xl px-10 py-14 sm:px-14 sm:py-16 relative overflow-hidden"
      style={{
        background: "linear-gradient(160deg, #fffdf9 0%, #fffaf5 40%, #fff5f7 100%)",
        boxShadow: "0 4px 32px rgba(190,18,60,0.10), inset 0 1px 0 rgba(255,255,255,0.9)",
        border: "1px solid rgba(253,164,175,0.25)",
      }}
    >
      <motion.div variants={container} initial="hidden" animate="show">
        {/* Top ornament */}
        <motion.div variants={item} className="flex items-center gap-3 mb-8">
          <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, transparent, #fda4af80, transparent)" }} />
          <span style={{ color: "#fda4af" }}>✦</span>
          <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, transparent, #fda4af80, transparent)" }} />
        </motion.div>

        {/* Date */}
        <motion.p
          variants={item}
          className="text-right mb-6"
          style={{ fontFamily: "var(--font-lato)", color: "#d4a0aa", fontSize: "0.7rem", letterSpacing: "0.18em", textTransform: "uppercase" }}
        >
          {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
        </motion.p>

        {/* Title */}
        <motion.h1
          variants={item}
          className="text-4xl sm:text-5xl mb-8 leading-tight text-center"
          style={{ fontFamily: "var(--font-playfair)", color: "#881337", fontStyle: "italic" }}
        >
          {title}
        </motion.h1>

        {/* Ornament divider */}
        <motion.div variants={item} className="flex justify-center mb-8">
          <svg width="160" height="16" viewBox="0 0 160 16" fill="none">
            <line x1="0" y1="8" x2="62" y2="8" stroke="#fda4af" strokeWidth="1" strokeDasharray="3 4" />
            <circle cx="80" cy="8" r="3.5" fill="#fda4af" />
            <circle cx="70" cy="8" r="2" fill="#f9a8d4" />
            <circle cx="90" cy="8" r="2" fill="#f9a8d4" />
            <line x1="98" y1="8" x2="160" y2="8" stroke="#fda4af" strokeWidth="1" strokeDasharray="3 4" />
          </svg>
        </motion.div>

        {/* Body */}
        <div className="space-y-6">
          {paragraphs.map((para, i) => (
            <motion.p
              key={i}
              variants={item}
              className="leading-8 text-lg"
              style={{ fontFamily: "var(--font-lato)", color: "#4a2030", fontWeight: 300, textIndent: "2em" }}
            >
              {para}
            </motion.p>
          ))}
        </div>

        {/* Sign-off */}
        <motion.div variants={item} className="mt-12 text-right">
          <p style={{ fontFamily: "var(--font-lato)", color: "#d4a0aa", fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 6 }}>
            With all my love,
          </p>
          <p className="text-3xl" style={{ fontFamily: "var(--font-playfair)", color: "#881337", fontStyle: "italic" }}>
            {signoff}
          </p>
        </motion.div>

        {/* Bottom ornament */}
        <motion.div variants={item} className="flex items-center gap-3 mt-10">
          <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, transparent, #fda4af80, transparent)" }} />
          <span style={{ color: "#fda4af" }}>✦</span>
          <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, transparent, #fda4af80, transparent)" }} />
        </motion.div>
      </motion.div>

      {/* Wax seal */}
      <div className="flex justify-center" style={{ marginTop: -14, paddingBottom: 8 }}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.6, type: "spring", stiffness: 220, damping: 16 }}
          className="wax-seal w-12 h-12 rounded-full flex items-center justify-center text-lg select-none"
          style={{
            background: "radial-gradient(ellipse at 36% 32%, #f43f5e, #dc2626 60%, #7f1d1d)",
            border: "2.5px solid rgba(190,18,60,0.2)",
          }}
        >
          ❤
        </motion.div>
      </div>
    </div>
  );
}
