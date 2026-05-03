import { prisma } from "@/lib/prisma";
import PetalBackground from "./components/PetalBackground";
import EnvelopeLetter from "./components/EnvelopeLetter";

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

  return (
    <main
      className="relative min-h-screen"
      style={{
        background:
          "linear-gradient(135deg, #fff1f5 0%, #fce7f3 30%, #fffbeb 60%, #fff0f6 100%)",
      }}
    >
      <PetalBackground />

      {/* Top gradient bar */}
      <div
        className="fixed top-0 left-0 w-full h-1.5 z-30"
        style={{
          background:
            "linear-gradient(90deg, #fda4af, #f9a8d4, #fbbf24, #f9a8d4, #fda4af)",
        }}
      />

      <EnvelopeLetter title={title} body={body} signoff={signoff} />

      {/* Footer */}
      <div
        className="fixed bottom-6 left-0 right-0 text-center text-xs z-10 pointer-events-none"
        style={{
          fontFamily: "var(--font-lato)",
          color: "#d4a0aa",
          letterSpacing: "0.15em",
        }}
      >
        written with love ✦
      </div>

      {/* Bottom gradient bar */}
      <div
        className="fixed bottom-0 left-0 w-full h-1.5 z-30"
        style={{
          background:
            "linear-gradient(90deg, #fda4af, #f9a8d4, #fbbf24, #f9a8d4, #fda4af)",
        }}
      />
    </main>
  );
}
