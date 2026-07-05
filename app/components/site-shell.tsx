import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

type SiteShellProps = {
  children: ReactNode;
  title: string;
  emoji: string;
  description?: string;
};

const navigation = [
  { href: "/", label: "Home", emoji: "🏠" },
  { href: "/scan-url", label: "URL", emoji: "🔗" },
  { href: "/scan-message", label: "Message", emoji: "💬" },
  { href: "/scan-file", label: "File", emoji: "📁" },
  { href: "/scan-image", label: "Image", emoji: "🖼️" },
];

export default function SiteShell({ children, title, emoji, description }: SiteShellProps) {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.16),_transparent_30%),linear-gradient(120deg,_#020617_0%,_#0f172a_45%,_#111827_100%)] px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="animate-[fadeIn_0.6s_ease-out] rounded-[1.25rem] border border-slate-800 bg-slate-900/80 px-4 py-4 shadow-lg shadow-slate-950/30 backdrop-blur sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-3 transition duration-300 hover:scale-[1.02]">
              <Image src="/hoaxshield-logo.svg" alt="HoaxShield logo" width={44} height={44} priority />
              <div>
                <p className="text-lg font-semibold text-white">HoaxShield</p>
                <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Threat scanner</p>
              </div>
            </Link>

            <nav className="flex flex-wrap items-center gap-2">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-full border border-slate-700 bg-slate-800/70 px-3 py-2 text-sm text-slate-200 transition duration-300 hover:-translate-y-0.5 hover:border-cyan-400/50 hover:bg-slate-700 hover:text-white"
                >
                  <span className="mr-2">{item.emoji}</span>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>

        <section className="animate-[fadeInUp_0.8s_ease-out] rounded-[1.5rem] border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">{emoji}</p>
              <h1 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">{title}</h1>
              {description ? <p className="mt-3 max-w-2xl text-base leading-7 text-slate-400">{description}</p> : null}
            </div>
            <Link href="/" className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-200 transition duration-300 hover:-translate-y-0.5 hover:bg-cyan-400/20">
              🏠 Back to home
            </Link>
          </div>

          <div className="mt-8">{children}</div>
        </section>
      </div>
    </main>
  );
}
