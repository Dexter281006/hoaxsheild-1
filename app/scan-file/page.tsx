import SiteShell from "../components/site-shell";

export default function ScanFilePage() {
  return (
    <SiteShell title="Scan files" emoji="📁" description="Inspect uploaded files for risky names, script-like content, and malware cues.">
      <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6 text-slate-300">
        <p className="text-lg">Upload a file from the homepage to review it for suspicious indicators.</p>
      </div>
    </SiteShell>
  );
}
