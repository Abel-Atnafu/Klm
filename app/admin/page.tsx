"use client";

import { useState, useEffect, FormEvent } from "react";

type LetterData = {
  title: string;
  body: string;
  signoff: string;
};

type State = "locked" | "unlocked" | "loading";

export default function AdminPage() {
  const [authState, setAuthState] = useState<State>("locked");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  const [letter, setLetter] = useState<LetterData>({
    title: "",
    body: "",
    signoff: "",
  });
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [savedPassword, setSavedPassword] = useState("");

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setAuthState("loading");
    setAuthError("");

    const res = await fetch("/api/letter", {
      headers: { "x-admin-password": password },
    });

    if (res.status === 401) {
      setAuthError("Wrong password. Try again.");
      setAuthState("locked");
      return;
    }

    const data = await res.json();
    setSavedPassword(password);
    setLetter({
      title: data.title ?? "",
      body: data.body ?? "",
      signoff: data.signoff ?? "",
    });
    setAuthState("unlocked");
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setSaveStatus("saving");

    const res = await fetch("/api/letter", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-password": savedPassword,
      },
      body: JSON.stringify(letter),
    });

    if (res.ok) {
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } else {
      setSaveStatus("error");
    }
  }

  const inputClass =
    "w-full rounded-xl border border-rose-200 bg-white/80 px-4 py-3 text-rose-900 placeholder-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-300 transition";

  if (authState === "locked" || authState === "loading") {
    return (
      <main
        className="min-h-screen flex items-center justify-center px-4"
        style={{
          background:
            "linear-gradient(135deg, #fff1f5 0%, #fce7f3 40%, #fffbeb 100%)",
        }}
      >
        <div
          className="w-full max-w-sm rounded-2xl px-10 py-12 text-center"
          style={{
            background: "linear-gradient(160deg, #fffdf9, #fff5f7)",
            boxShadow:
              "0 4px 32px rgba(190,18,60,0.10), 0 1px 0 rgba(255,255,255,0.9) inset",
            border: "1px solid rgba(253,164,175,0.3)",
          }}
        >
          <div className="text-4xl mb-4 select-none">🔒</div>
          <h1
            className="text-2xl mb-2"
            style={{
              fontFamily: "var(--font-playfair)",
              color: "#881337",
              fontStyle: "italic",
            }}
          >
            Admin Access
          </h1>
          <p
            className="text-sm mb-8"
            style={{ fontFamily: "var(--font-lato)", color: "#d4a0aa" }}
          >
            Enter your password to edit the letter.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Password"
              className={inputClass}
              style={{ fontFamily: "var(--font-lato)" }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
            {authError && (
              <p
                className="text-sm"
                style={{ fontFamily: "var(--font-lato)", color: "#e11d48" }}
              >
                {authError}
              </p>
            )}
            <button
              type="submit"
              disabled={authState === "loading"}
              className="w-full py-3 rounded-xl text-white font-medium transition disabled:opacity-60"
              style={{
                fontFamily: "var(--font-lato)",
                background:
                  "linear-gradient(135deg, #e11d48, #881337)",
                boxShadow: "0 4px 14px rgba(190,18,60,0.3)",
              }}
            >
              {authState === "loading" ? "Checking…" : "Enter"}
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen flex items-center justify-center py-16 px-4"
      style={{
        background:
          "linear-gradient(135deg, #fff1f5 0%, #fce7f3 40%, #fffbeb 100%)",
      }}
    >
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-10">
          <h1
            className="text-4xl mb-2"
            style={{
              fontFamily: "var(--font-playfair)",
              color: "#881337",
              fontStyle: "italic",
            }}
          >
            Edit Your Letter
          </h1>
          <p
            className="text-sm"
            style={{ fontFamily: "var(--font-lato)", color: "#d4a0aa" }}
          >
            Changes are saved to the database and appear instantly.
          </p>
        </div>

        <form
          onSubmit={handleSave}
          className="rounded-2xl px-10 py-12 space-y-7"
          style={{
            background: "linear-gradient(160deg, #fffdf9, #fff5f7)",
            boxShadow:
              "0 4px 32px rgba(190,18,60,0.10), 0 1px 0 rgba(255,255,255,0.9) inset",
            border: "1px solid rgba(253,164,175,0.3)",
          }}
        >
          {/* Title */}
          <div>
            <label
              className="block text-xs uppercase tracking-widest mb-2"
              style={{ fontFamily: "var(--font-lato)", color: "#d4a0aa" }}
            >
              Letter Title
            </label>
            <input
              type="text"
              placeholder="My Dearest Love"
              className={inputClass}
              style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic" }}
              value={letter.title}
              onChange={(e) => setLetter({ ...letter, title: e.target.value })}
            />
          </div>

          {/* Body */}
          <div>
            <label
              className="block text-xs uppercase tracking-widest mb-2"
              style={{ fontFamily: "var(--font-lato)", color: "#d4a0aa" }}
            >
              Letter Body
            </label>
            <p
              className="text-xs mb-3"
              style={{ fontFamily: "var(--font-lato)", color: "#d4a0aa" }}
            >
              Separate paragraphs with a blank line.
            </p>
            <textarea
              rows={16}
              placeholder={`From the very first moment I saw you...\n\nEvery day with you is a gift I never expected...`}
              className={`${inputClass} resize-y leading-7`}
              style={{ fontFamily: "var(--font-lato)", fontWeight: 300 }}
              value={letter.body}
              onChange={(e) => setLetter({ ...letter, body: e.target.value })}
            />
          </div>

          {/* Sign-off */}
          <div>
            <label
              className="block text-xs uppercase tracking-widest mb-2"
              style={{ fontFamily: "var(--font-lato)", color: "#d4a0aa" }}
            >
              Sign-off Name
            </label>
            <input
              type="text"
              placeholder="Your Name"
              className={inputClass}
              style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic" }}
              value={letter.signoff}
              onChange={(e) =>
                setLetter({ ...letter, signoff: e.target.value })
              }
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            <a
              href="/"
              className="text-sm underline decoration-dotted underline-offset-4 transition hover:opacity-70"
              style={{ fontFamily: "var(--font-lato)", color: "#d4a0aa" }}
            >
              ← View letter
            </a>
            <button
              type="submit"
              disabled={saveStatus === "saving"}
              className="px-8 py-3 rounded-xl text-white font-medium transition disabled:opacity-60"
              style={{
                fontFamily: "var(--font-lato)",
                background: "linear-gradient(135deg, #e11d48, #881337)",
                boxShadow: "0 4px 14px rgba(190,18,60,0.3)",
              }}
            >
              {saveStatus === "saving"
                ? "Saving…"
                : saveStatus === "saved"
                ? "✓ Saved"
                : saveStatus === "error"
                ? "Error — try again"
                : "Save Letter"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
