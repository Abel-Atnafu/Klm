import PetalBackground from "./components/PetalBackground";
import EnvelopeLetter from "./components/EnvelopeLetter";

const LETTER = {
  title: "My Dearest Love",
  signoff: "Yours, always",
  body: `From the very first moment I saw you, something shifted inside me — quietly, the way dawn arrives before you notice the sky has changed. You were simply there, and yet everything felt different.

I have tried, many times, to put into words what you mean to me. I reach for language and find it too small. How do you describe a feeling that lives in the space between heartbeats? How do you explain that someone has become the reason a morning feels like a gift?

You make the ordinary extraordinary. A cup of coffee shared with you tastes better. A walk down a familiar street becomes an adventure. Laughter comes easier, and the hard days feel lighter, because somewhere in them there is always you.

I want you to know that you are loved — not for what you do or what you achieve, but simply for being who you are. You are enough. More than enough. You are everything.

Thank you for choosing me. Thank you for every quiet moment, every smile, every hand held. I carry you with me always — in every good thing I do and every hopeful thought I have.

This letter could never say it all, but I hope it says at least this: I love you, completely and without reservation, today and all the days after.`,
};

export default function Home() {
  return (
    <main
      className="relative min-h-screen"
      style={{
        background:
          "linear-gradient(135deg, #fff1f5 0%, #fce7f3 30%, #fffbeb 60%, #fff0f6 100%)",
      }}
    >
      <PetalBackground />

      <div
        className="fixed top-0 left-0 w-full h-1.5 z-30"
        style={{ background: "linear-gradient(90deg, #fda4af, #f9a8d4, #fbbf24, #f9a8d4, #fda4af)" }}
      />

      <EnvelopeLetter
        title={LETTER.title}
        body={LETTER.body}
        signoff={LETTER.signoff}
      />

      <div
        className="fixed bottom-6 left-0 right-0 text-center text-xs z-10 pointer-events-none"
        style={{ fontFamily: "var(--font-lato)", color: "#d4a0aa", letterSpacing: "0.15em" }}
      >
        written with love ✦
      </div>

      <div
        className="fixed bottom-0 left-0 w-full h-1.5 z-30"
        style={{ background: "linear-gradient(90deg, #fda4af, #f9a8d4, #fbbf24, #f9a8d4, #fda4af)" }}
      />
    </main>
  );
}
