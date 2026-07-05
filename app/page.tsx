"use client";

import { useMemo, useState, type ChangeEvent } from "react";

type ScanStatus = "safe" | "warning" | "danger" | "error";

type ScanResult = {
  title: string;
  summary: string;
  status: ScanStatus;
  details: string[];
  scanUrl: string;
  source: string;
};

const suspiciousTerms = [
  "free",
  "bonus",
  "winner",
  "gift",
  "verify",
  "urgent",
  "click",
  "crypto",
  "wallet",
  "bank",
  "login",
  "password",
];

function normalizeUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function buildPrefixedUrl(value: string, domain: string) {
  const normalized = normalizeUrl(value);
  if (!normalized) return "";
  const cleanDomain = domain.trim().replace(/^https?:\/\//i, "").replace(/\/+$/, "");
  if (!cleanDomain || cleanDomain === "your-domain.com") {
    return normalized;
  }
  return `https://${cleanDomain}/scan?target=${encodeURIComponent(normalized)}`;
}

function createFallbackResult(title: string, summary: string, status: ScanStatus, details: string[], scanUrl: string, source: string): ScanResult {
  return { title, summary, status, details, scanUrl, source };
}

export default function Home() {
  const [domain, setDomain] = useState(process.env.NEXT_PUBLIC_APP_DOMAIN || "your-domain.com");
  const [urlInput, setUrlInput] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [urlResult, setUrlResult] = useState<ScanResult | null>(null);
  const [messageResult, setMessageResult] = useState<ScanResult | null>(null);
  const [fileResult, setFileResult] = useState<ScanResult | null>(null);
  const [imageResult, setImageResult] = useState<ScanResult | null>(null);

  const prefixedPreview = useMemo(() => buildPrefixedUrl(urlInput, domain), [domain, urlInput]);

  const handleUrlScan = async () => {
    const normalized = normalizeUrl(urlInput);
    if (!normalized) {
      setUrlResult(createFallbackResult("Missing target", "Please enter a website URL to scan.", "warning", ["A URL is required before scanning."], "", "Local validation"));
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "url", targetUrl: normalized, domainPrefix: domain }),
      });
      const data = await response.json();
      setUrlResult(data);
    } catch {
      setUrlResult(createFallbackResult("Scan failed", "The scanner could not complete the request right now.", "error", ["Please check your connection and try again."], prefixedPreview, "Local fallback"));
    } finally {
      setLoading(false);
    }
  };

  const handleMessageScan = async () => {
    if (!messageInput.trim()) {
      setMessageResult(createFallbackResult("No message provided", "Add a suspicious message or text snippet to inspect it.", "warning", ["Paste the message you want to review."], "", "Local validation"));
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "text", message: messageInput }),
      });
      const data = await response.json();
      setMessageResult(data);
    } catch {
      setMessageResult(createFallbackResult("Message scan failed", "We could not analyze the message at the moment.", "error", ["Please try again shortly."], "", "Local fallback"));
    } finally {
      setLoading(false);
    }
  };

  const handleFileScan = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      let textPreview = "";
      if (file.type.startsWith("text/") || /\.(txt|md|json|csv)$/i.test(file.name)) {
        textPreview = await file.text();
      }

      const response = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "file", fileName: file.name, mimeType: file.type, size: file.size, textPreview }),
      });
      const data = await response.json();
      setFileResult(data);
    } catch {
      setFileResult(createFallbackResult("File scan failed", "The file could not be analyzed right now.", "error", ["Please try another file or retry."], "", "Local fallback"));
    } finally {
      setLoading(false);
    }
  };

  const handleImageScan = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const response = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "image", fileName: file.name, mimeType: file.type, size: file.size }),
      });
      const data = await response.json();
      setImageResult(data);
    } catch {
      setImageResult(createFallbackResult("Image scan failed", "The image could not be analyzed right now.", "error", ["Please try another image or retry."], "", "Local fallback"));
    } finally {
      setLoading(false);
    }
  };

  const renderResultCard = (result: ScanResult | null) => {
    if (!result) {
      return (
        <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-6 text-left text-sm text-slate-400">
          Results will appear here after you run a check.
        </div>
      );
    }

    const toneStyles: Record<ScanStatus, string> = {
      safe: "border-emerald-500/40 bg-emerald-500/10 text-emerald-200",
      warning: "border-amber-500/40 bg-amber-500/10 text-amber-200",
      danger: "border-rose-500/40 bg-rose-500/10 text-rose-200",
      error: "border-slate-500/40 bg-slate-500/10 text-slate-300",
    };

    return (
      <div className={`rounded-2xl border p-6 ${toneStyles[result.status]}`}>
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] opacity-70">{result.source}</p>
            <h3 className="mt-1 text-xl font-semibold">{result.title}</h3>
          </div>
          <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em]">
            {result.status}
          </span>
        </div>
        <p className="mt-4 text-sm leading-6">{result.summary}</p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm">
          {result.details.map((detail) => (
            <li key={detail}>{detail}</li>
          ))}
        </ul>
        {result.scanUrl ? <p className="mt-4 break-all text-xs opacity-80">Preview: {result.scanUrl}</p> : null}
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_32%),linear-gradient(120deg,_#020617_0%,_#0f172a_45%,_#111827_100%)] px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <section className="overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-900/80 shadow-2xl shadow-cyan-950/40 backdrop-blur">
          <div className="grid gap-8 p-8 lg:grid-cols-[1.1fr_0.9fr] lg:p-12">
            <div>
              <span className="inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-sm font-medium text-cyan-300">
                Google-backed threat analysis
              </span>
              <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                HoaxShield checks links, messages, files, and images before they reach your users.
              </h1>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-400">
                Scan suspicious URLs with Google Safe Browsing, then inspect messages and uploads with built-in heuristics that flag phishing language, risky file types, and obvious malware signals.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                  URL scanning with your own domain prefix
                </div>
                <div className="rounded-2xl border border-violet-500/20 bg-violet-500/10 px-4 py-3 text-sm text-violet-200">
                  Message and file/image inspection
                </div>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-slate-800 bg-slate-950/60 p-6">
              <label className="text-sm font-medium text-slate-300" htmlFor="domain">
                Your domain prefix
              </label>
              <input
                id="domain"
                value={domain}
                onChange={(event) => setDomain(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900/90 px-4 py-3 text-slate-100 outline-none ring-0"
                placeholder="your-domain.com"
              />
              <p className="mt-3 text-sm leading-6 text-slate-400">
                When you scan a URL, HoaxShield can build a prefixed inspection link such as https://your-domain.com/scan?target=https://example.com.
              </p>
              <div className="mt-5 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-4 text-sm text-cyan-100">
                Preview: <span className="break-all font-mono text-xs">{prefixedPreview || "https://your-domain.com/scan?target=https://example.com"}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/30 backdrop-blur">
            <div className="flex flex-wrap gap-2">
              {[
                { id: "url", label: "Website URL" },
                { id: "message", label: "Message text" },
                { id: "file", label: "File scan" },
                { id: "image", label: "Image scan" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${tab.id === "url" ? "bg-cyan-500 text-slate-950" : "bg-slate-800 text-slate-300 hover:bg-slate-700"}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                <label className="text-sm font-medium text-slate-300" htmlFor="website-url">
                  Enter a website URL
                </label>
                <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                  <input
                    id="website-url"
                    value={urlInput}
                    onChange={(event) => setUrlInput(event.target.value)}
                    className="flex-1 rounded-2xl border border-slate-700 bg-slate-900/90 px-4 py-3 text-slate-100 outline-none"
                    placeholder="https://example.com"
                  />
                  <button
                    type="button"
                    onClick={handleUrlScan}
                    className="rounded-2xl bg-cyan-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400"
                  >
                    {loading ? "Scanning..." : "Scan URL"}
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                <label className="text-sm font-medium text-slate-300" htmlFor="message">
                  Paste a suspicious message or SMS snippet
                </label>
                <textarea
                  id="message"
                  value={messageInput}
                  onChange={(event) => setMessageInput(event.target.value)}
                  className="mt-3 min-h-28 w-full rounded-2xl border border-slate-700 bg-slate-900/90 px-4 py-3 text-slate-100 outline-none"
                  placeholder="Urgent! Verify your account now..."
                />
                <div className="mt-3 flex justify-end">
                  <button
                    type="button"
                    onClick={handleMessageScan}
                    className="rounded-2xl border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-700"
                  >
                    Scan message
                  </button>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                  <label className="text-sm font-medium text-slate-300" htmlFor="file-upload">
                    Upload a file
                  </label>
                  <input id="file-upload" type="file" className="mt-3 block w-full text-sm text-slate-400" onChange={handleFileScan} />
                  <p className="mt-3 text-sm leading-6 text-slate-400">Text files and common executable-style names are inspected for malware cues.</p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                  <label className="text-sm font-medium text-slate-300" htmlFor="image-upload">
                    Upload an image
                  </label>
                  <input id="image-upload" type="file" accept="image/*" className="mt-3 block w-full text-sm text-slate-400" onChange={handleImageScan} />
                  <p className="mt-3 text-sm leading-6 text-slate-400">Images are checked for suspicious filenames, oversized payloads, and obvious phishing indicators.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/30 backdrop-blur">
              <h2 className="text-xl font-semibold text-white">What the scanner looks for</h2>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-400">
                <li>• Known phishing language such as urgency, prizes, and account verification requests.</li>
                <li>• Risky URL patterns, suspicious prefixes, and domain-based impersonation clues.</li>
                <li>• File names and content that resemble malware payloads or executable files.</li>
                <li>• Message and image uploads that look like social-engineering traps.</li>
              </ul>
            </div>

            <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/30 backdrop-blur">
              <h2 className="text-xl font-semibold text-white">Latest results</h2>
              <div className="mt-4 space-y-4">
                {renderResultCard(urlResult)}
                {renderResultCard(messageResult)}
                {renderResultCard(fileResult)}
                {renderResultCard(imageResult)}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
