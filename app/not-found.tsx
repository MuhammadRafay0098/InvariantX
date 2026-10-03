import Link from "next/link";
import { ArrowLeft, FileQuestion, LayoutDashboard } from "lucide-react";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#05070d] px-4 text-zinc-100">
      <div className="pointer-events-none absolute left-1/2 top-1/2 size-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/[0.045] blur-[130px]" />

      <section
        className={[
          "relative w-full max-w-xl overflow-hidden rounded-[24px]",
          "border border-white/[0.07]",
          "bg-white/[0.025] p-7 text-center sm:p-9",
        ].join(" ")}
      >
        <div className="mx-auto flex size-12 items-center justify-center rounded-2xl border border-cyan-300/15 bg-cyan-300/[0.055]">
          <FileQuestion aria-hidden="true" className="size-5 text-cyan-200" />
        </div>

        <p className="mt-6 text-[10px] font-medium uppercase tracking-[0.2em] text-cyan-200/65">
          Unknown Security Route
        </p>

        <h1 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-white sm:text-3xl">
          This workspace does not exist.
        </h1>

        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-zinc-500">
          The requested InvariantX resource may no longer exist or the route may
          be invalid.
        </p>

        <div className="mt-7 flex flex-col justify-center gap-2 sm:flex-row">
          <Link
            href="/"
            className={[
              "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl",
              "border border-cyan-300/15 bg-cyan-300/[0.06] px-4",
              "text-xs font-medium text-cyan-100",
              "transition duration-200",
              "hover:border-cyan-300/25 hover:bg-cyan-300/[0.1]",
              "focus:outline-none",
              "focus-visible:ring-2 focus-visible:ring-cyan-300/40",
            ].join(" ")}
          >
            <LayoutDashboard aria-hidden="true" className="size-3.5" />
            Security overview
          </Link>

          <Link
            href="/demo"
            className={[
              "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl",
              "border border-white/[0.08] bg-white/[0.025] px-4",
              "text-xs font-medium text-zinc-300",
              "transition duration-200",
              "hover:bg-white/[0.05] hover:text-white",
              "focus:outline-none",
              "focus-visible:ring-2 focus-visible:ring-white/20",
            ].join(" ")}
          >
            <ArrowLeft aria-hidden="true" className="size-3.5" />
            Live demo
          </Link>
        </div>
      </section>
    </main>
  );
}
