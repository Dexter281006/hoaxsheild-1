import SiteShell from "../components/site-shell";

export default function ScanMessagePage() {
  return (
    <SiteShell title="Scan suspicious messages" emoji="💬" description="Review SMS, chat, or email text for phishing and scam cues.">
      <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6 text-slate-300">
        <p className="text-lg">Paste a message into the homepage scanner to inspect it for phishing markers.</p>
      </div>
    </SiteShell>
  );
}
