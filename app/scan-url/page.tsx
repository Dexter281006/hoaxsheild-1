import SiteShell from "../components/site-shell";

export default function ScanUrlPage() {
  return (
    <SiteShell title="Scan a website URL" emoji="🔗" description="Inspect a website link before a user clicks it.">
      <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6 text-slate-300">
        <p className="text-lg">Use the homepage scanner to enter a URL and check it with the same threat analysis flow.</p>
      </div>
    </SiteShell>
  );
}
