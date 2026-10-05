"use client";

import { useEffect, useId, useRef, useState } from "react";

export type GatedBlob = {
  v: number;
  kdf: string;
  iterations: number;
  salt: string;
  iv: string;
  ct: string;
};

function b64(s: string): Uint8Array<ArrayBuffer> {
  const bin = atob(s);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function decrypt(blob: GatedBlob, passphrase: string): Promise<string> {
  const enc = new TextEncoder();
  const base = await crypto.subtle.importKey("raw", enc.encode(passphrase), "PBKDF2", false, [
    "deriveKey",
  ]);
  const key = await crypto.subtle.deriveKey(
    { name: "PBKDF2", hash: "SHA-256", salt: b64(blob.salt), iterations: blob.iterations },
    base,
    { name: "AES-GCM", length: 256 },
    false,
    ["decrypt"],
  );
  const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv: b64(blob.iv) }, key, b64(blob.ct));
  return new TextDecoder().decode(plain);
}

const SESSION_KEY = "gate-passphrase";

export function Gate({ blob, title }: { blob: GatedBlob; title: string }) {
  const [html, setHtml] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  async function tryPass(pass: string, remember: boolean) {
    setBusy(true);
    setError(null);
    try {
      const out = await decrypt(blob, pass);
      setHtml(out);
      if (remember) {
        try {
          sessionStorage.setItem(SESSION_KEY, pass);
        } catch {}
      }
    } catch {
      setError("That passphrase didn't unlock this page. Check the spacing and try again.");
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = sessionStorage.getItem(SESSION_KEY);
    } catch {}
    if (!saved) return;
    const pass = saved;
    const t = setTimeout(() => void tryPass(pass, false), 0);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (html) {
    return (
      <iframe
        title={title}
        sandbox="allow-scripts"
        srcDoc={html}
        className="bubble block h-[80vh] w-full border border-rule bg-surface"
      />
    );
  }

  return (
    <form
      className="bubble grid max-w-md gap-3 border border-rule bg-surface p-5"
      onSubmit={(e) => {
        e.preventDefault();
        const v = inputRef.current?.value ?? "";
        if (v) void tryPass(v, true);
      }}
    >
      <label htmlFor={inputId} className="text-[15px] font-semibold text-ink">
        This case study is passphrase protected.
      </label>
      <p className="text-[14px]">
        It recreates work from inside Vibes with mock data. The passphrase is in my resume
        and in any email I&apos;ve sent you.
      </p>
      <input
        id={inputId}
        ref={inputRef}
        type="password"
        autoComplete="off"
        placeholder="four words, separated by spaces"
        className="bubble-sm border border-rule bg-bg px-3 py-2 text-[15px] text-ink"
        disabled={busy}
      />
      {error && (
        <p role="alert" className="text-[13px] text-warn">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={busy}
        className="bubble-sm justify-self-start bg-accent px-4 py-2 text-[14px] font-semibold text-white disabled:opacity-60"
      >
        {busy ? "Unlocking…" : "Unlock"}
      </button>
    </form>
  );
}
