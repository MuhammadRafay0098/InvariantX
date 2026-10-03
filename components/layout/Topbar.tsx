"use client";

import { Bell, Command, Menu, ShieldCheck } from "lucide-react";

interface TopbarProps {
  onOpenNavigation: () => void;
}

export default function Topbar({ onOpenNavigation }: TopbarProps) {
  return (
    <header className="sticky top-0 z-20 flex min-h-16 items-center border-b border-white/[0.055] bg-[#05070d]/90 px-3.5 py-3 backdrop-blur-md sm:px-5 md:px-6 lg:px-7 xl:px-8">
      <div className="flex w-full min-w-0 items-center justify-between gap-2 sm:gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onOpenNavigation}
            aria-label="Open navigation"
            className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.035] text-zinc-400 transition hover:bg-white/[0.07] hover:text-white lg:hidden"
          >
            <Menu className="size-[18px]" />
          </button>

          <div className="min-w-0">
            <div className="truncate text-sm font-medium text-zinc-100">
              Security Operations
            </div>
            <div className="hidden text-xs text-zinc-600 sm:block">
              Cross-agent invariant transfer workspace
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden shrink-0 items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.025] px-3 py-2 lg:flex">
            <ShieldCheck className="size-3.5 text-emerald-300" />
            <span className="text-[11px] text-zinc-400">Policy engine</span>
            <span className="text-[11px] font-medium text-emerald-200">
              Healthy
            </span>
          </div>

          <button
            type="button"
            aria-label="Command menu"
            className="hidden h-10 shrink-0 items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.03] px-3 text-xs text-zinc-500 transition hover:bg-white/[0.06] hover:text-zinc-300 xl:flex"
          >
            <Command className="size-3.5" />
            <span>Command</span>
            <kbd className="rounded-md border border-white/[0.07] bg-black/20 px-1.5 py-0.5 font-mono text-[9px] text-zinc-600">
              ⌘K
            </kbd>
          </button>

          <button
            type="button"
            aria-label="Notifications"
            className="relative flex size-10 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.03] text-zinc-500 transition hover:bg-white/[0.06] hover:text-white"
          >
            <Bell className="size-4" />
            <span className="absolute right-2.5 top-2.5 size-1.5 rounded-full bg-cyan-300 shadow-[0_0_8px_rgba(103,232,249,0.8)]" />
          </button>
        </div>
      </div>
    </header>
  );
}
