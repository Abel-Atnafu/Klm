import { prisma } from "@/lib/prisma";
import PetalBackground from "./components/PetalBackground";

async function getLetter() {
  try {
    return await prisma.letter.findFirst({ orderBy: { id: "desc" } });
  } catch {
    return null;
  }
}

export default async function Home() {
  const letter = await getLetter();

  const title = letter?.title ?? "My Dearest Love";
  const body = letter?.body ?? "";
  const signoff = letter?.signoff ?? "Yours always";

  const paragraphs = body.split("\n\n").filter(Boolean);

  return (
    <main
      className="relative min-h-screen flex items-center justify-center py-16 px-4"
      style={{
        background:
          "linear-gradient(135deg, #fff1f5 0%, #fce7f3 30%, #fffbeb 60%, #fff0f6 100%)",
      }}
    >
      <PetalBackground />

      {/* Decorative top flourish */}
      <div
        className="fixed top-0 left-0 w-full h-1.5 z-10"
        style={{
          background:
            "linear-gradient(90deg, #fda4af, #f9a8d4, #fbbf24, #f9a8d4, #fda4af)",
        }}
      />

      {/* Letter card */}
      <article
        className="letter-appear relative z-10 w-full max-w-2xl mx-auto"
        style={{ filter: "drop-shadow(0 8px 40px rgba(190,18,60,0.10))" }}
      >
        {/* Paper texture card */}
        <div
          className="rounded-2xl px-10 py-14 sm:px-16 sm:py-20 relative overflow-hidden"
          style={{
            background:
              "linear-gradient(160deg, #fffdf9 0%, #fffaf5 40%, #fff5f7 100%)",
            boxShadow:
              "0 2px 4px rgba(0,0,0,0.04), 0 8px 24px rgba(190,18,60,0.08), inset 0 1px 0 rgba(255,255,255,0.9)",
            border: "1px solid rgba(253, 164, 175, 0.25)",
          }}
        >
          {/* Paper grain overlay */}
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E")`,
              backgroundSize: "256px",
            }}
          />

          {/* Top decorative line */}
          <div className="flex items-center gap-3 mb-10">
            <div
              className="flex-1 h-px"
              style={{
                background:
                  "linear-gradient(90deg, transparent, #fda4af80, transparent)",
              }}
            />
            <span style={{ color: "#fda4af", fontSize: "1.2rem" }}>✦</span>
            <div
              className="flex-1 h-px"
              style={{
                background:
                  "linear-gradient(90deg, transparent, #fda4af80, transparent)",
              }}
            />
          </div>

          {/* Date */}
          <p
            className="text-right mb-8 tracking-widest uppercase text-xs"
            style={{
              fontFamily: "var(--font-lato)",
              color: "#d4a0aa",
              letterSpacing: "0.18em",
            }}
          >
            {new Date().toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>

          {/* Title */}
          <h1
            className="text-4xl sm:text-5xl mb-10 leading-tight text-center"
            style={{
              fontFamily: "var(--font-playfair)",
              color: "#881337",
              fontStyle: "italic",
            }}
          >
            {title}
          </h1>

          {/* Divider ornament */}
          <div className="flex justify-center mb-10">
            <svg width="180" height="18" viewBox="0 0 180 18" fill="none">
              <line
                x1="0"
                y1="9"
                x2="72"
                y2="9"
                stroke="#fda4af"
                strokeWidth="1"
                strokeDasharray="3 4"
              />
              <path
                d="M84 2 Q90 9 84 16 Q90 9 96 2 Q90 9 96 16 Q90 9 84 2Z"
                fill="#f9a8d4"
              />
              <circle cx="90" cy="9" r="3" fill="#fda4af" />
              <line
                x1="108"
                y1="9"
                x2="180"
                y2="9"
                stroke="#fda4af"
                strokeWidth="1"
                strokeDasharray="3 4"
              />
            </svg>
          </div>

          {/* Body paragraphs */}
          <div className="space-y-6">
            {paragraphs.length > 0 ? (
              paragraphs.map((para, i) => (
                <p
                  key={i}
                  className="leading-8 text-lg"
                  style={{
                    fontFamily: "var(--font-lato)",
                    color: "#4a2030",
                    fontWeight: 300,
                    textIndent: "2em",
                  }}
                >
                  {para}
                </p>
              ))
            ) : (
              <p
                className="leading-8 text-lg text-center"
                style={{
                  fontFamily: "var(--font-lato)",
                  color: "#d4a0aa",
                  fontStyle: "italic",
                }}
              >
                The letter is being written…
              </p>
            )}
          </div>

          {/* Sign-off */}
          <div className="mt-14 text-right">
            <p
              className="text-sm mb-3 tracking-widest uppercase"
              style={{
                fontFamily: "var(--font-lato)",
                color: "#d4a0aa",
                letterSpacing: "0.15em",
              }}
            >
              With all my love,
            </p>
            <p
              className="text-3xl"
              style={{
                fontFamily: "var(--font-playfair)",
                color: "#881337",
                fontStyle: "italic",
              }}
            >
              {signoff}
            </p>
          </div>

          {/* Bottom decorative line */}
          <div className="flex items-center gap-3 mt-10">
            <div
              className="flex-1 h-px"
              style={{
                background:
                  "linear-gradient(90deg, transparent, #fda4af80, transparent)",
              }}
            />
            <span style={{ color: "#fda4af", fontSize: "1.2rem" }}>✦</span>
            <div
              className="flex-1 h-px"
              style={{
                background:
                  "linear-gradient(90deg, transparent, #fda4af80, transparent)",
              }}
            />
          </div>
        </div>

        {/* Wax seal */}
        <div className="flex justify-center mt-[-28px] relative z-20">
          <div
            className="wax-seal w-16 h-16 rounded-full flex items-center justify-center text-2xl select-none cursor-default"
            style={{
              background:
                "radial-gradient(ellipse at 35% 35%, #e11d48, #881337 60%, #4c0519)",
              border: "3px solid rgba(190,18,60,0.25)",
            }}
            title="Sealed with love"
          >
            ❤
          </div>
        </div>
      </article>

      {/* Subtle footer */}
      <div
        className="fixed bottom-4 left-0 right-0 text-center text-xs z-10"
        style={{
          fontFamily: "var(--font-lato)",
          color: "#d4a0aa",
          letterSpacing: "0.15em",
        }}
      >
        written with love ✦
      </div>

      {/* Decorative bottom gradient */}
      <div
        className="fixed bottom-0 left-0 w-full h-1.5 z-10"
        style={{
          background:
            "linear-gradient(90deg, #fda4af, #f9a8d4, #fbbf24, #f9a8d4, #fda4af)",
        }}
      />
    </main>
  );
}
