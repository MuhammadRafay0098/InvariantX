function SkeletonBlock({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={[
        "animate-pulse rounded-lg bg-white/[0.045]",
        "motion-reduce:animate-none",
        className,
      ].join(" ")}
    />
  );
}

export default function WorkspaceSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading InvariantX workspace"
      className="space-y-5"
    >
      <section
        className={[
          "relative overflow-hidden rounded-[24px]",
          "border border-white/[0.06]",
          "bg-white/[0.02] p-6 sm:p-8",
        ].join(" ")}
      >
        <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-cyan-400/[0.04] blur-[100px]" />

        <div className="relative">
          <SkeletonBlock className="h-3 w-36" />
          <SkeletonBlock className="mt-5 h-8 w-[32rem] max-w-[90%]" />
          <SkeletonBlock className="mt-3 h-3 w-[40rem] max-w-full" />
          <SkeletonBlock className="mt-2 h-3 w-[31rem] max-w-[85%]" />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={index}
            className={[
              "rounded-2xl border border-white/[0.06]",
              "bg-white/[0.02] p-5",
            ].join(" ")}
          >
            <SkeletonBlock className="size-9" />
            <SkeletonBlock className="mt-7 h-6 w-20" />
            <SkeletonBlock className="mt-3 h-3 w-32" />
            <SkeletonBlock className="mt-2 h-2.5 w-48 max-w-full" />
          </div>
        ))}
      </section>

      <section
        className={[
          "rounded-2xl border border-white/[0.06]",
          "bg-white/[0.02] p-5",
        ].join(" ")}
      >
        <SkeletonBlock className="h-4 w-44" />
        <SkeletonBlock className="mt-2 h-2.5 w-72 max-w-full" />

        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {Array.from({ length: 4 }, (_, index) => (
            <div
              key={index}
              className="rounded-xl border border-white/[0.05] p-4"
            >
              <SkeletonBlock className="size-8" />
              <SkeletonBlock className="mt-5 h-3 w-28" />
              <SkeletonBlock className="mt-2 h-2.5 w-40 max-w-full" />
            </div>
          ))}
        </div>
      </section>

      <span className="sr-only">Loading workspace.</span>
    </div>
  );
}
