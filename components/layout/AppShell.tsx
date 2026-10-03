"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import CursorGlow from "@/components/effects/CursorGlow";
import AmbientBackground from "@/components/effects/AmbientBackground";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const [navigationOpen, setNavigationOpen] = useState(false);

  const openNavigation = useCallback(() => {
    setNavigationOpen(true);
  }, []);

  const closeNavigation = useCallback(() => {
    setNavigationOpen(false);
  }, []);

  useEffect(() => {
    if (!navigationOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeNavigation();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [navigationOpen, closeNavigation]);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#05070d] text-zinc-100">
      <a
        href="#main-content"
        className={[
          "fixed left-4 top-4 z-[100] -translate-y-24 rounded-xl",
          "border border-cyan-300/20 bg-[#0a1018] px-4 py-2",
          "text-xs font-medium text-cyan-100 shadow-2xl",
          "transition-transform duration-200",
          "focus:translate-y-0 focus:outline-none",
          "focus-visible:ring-2 focus-visible:ring-cyan-300/50",
        ].join(" ")}
      >
        Skip to main content
      </a>

      <AmbientBackground />

      <Sidebar open={navigationOpen} onClose={closeNavigation} />

      <div className="relative z-10 min-h-screen min-w-0 lg:pl-64">
        <Topbar onOpenNavigation={openNavigation} />

        <main
          id="main-content"
          tabIndex={-1}
          className={[
            "mx-auto w-full min-w-0 max-w-[1600px]",
            "px-3.5 py-4 sm:px-5 sm:py-5 md:px-6",
            "lg:px-7 lg:py-7 xl:px-8 xl:py-8",
            "focus:outline-none",
          ].join(" ")}
        >
          {children}
        </main>
      </div>
      <CursorGlow />
    </div>
  );
}
