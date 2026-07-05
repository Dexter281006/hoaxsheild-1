import SiteShell from "../components/site-shell";

export default function ScanImagePage() {
  return (
    <SiteShell title="Scan images" emoji="🖼️" description="Review uploaded images for suspicious filenames and visual phishing signals.">
      <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6 text-slate-300">
        <p className="text-lg">Upload an image from the homepage to check it for suspicious markers.</p>
      </div>
    </SiteShell>
  );
}
