"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  Bot,
  Fingerprint,
  LayoutDashboard,
  Network,
  Play,
  ShieldCheck,
  X,
  type LucideIcon,
} from "lucide-react";
import { motion } from "motion/react";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

interface NavigationItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const navigation: NavigationItem[] = [
  {
    label: "Overview",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Incidents",
    href: "/incidents",
    icon: Activity,
  },
  {
    label: "Invariants",
    href: "/invariants",
    icon: Fingerprint,
  },
  {
    label: "Transfers",
    href: "/transfers",
    icon: Network,
  },
  {
    label: "Validation",
    href: "/validation",
    icon: ShieldCheck,
  },
  {
    label: "Agents",
    href: "/agents",
    icon: Bot,
  },
  {
    label: "Live Demo",
    href: "/demo",
    icon: Play,
  },
];

interface SidebarContentProps {
  pathname: string;
  onNavigate?: () => void;
}

function isActiveRoute(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function SidebarContent({ pathname, onNavigate }: SidebarContentProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex min-h-[88px] items-center border-b border-white/[0.06] px-4 py-3">
        <Link
          href="/"
          onClick={onNavigate}
          aria-label="InvariantX home"
          className={[
            "group/brand flex min-w-0 flex-1",
            "items-center",
            "transition-opacity duration-300",
            "hover:opacity-95",
          ].join(" ")}
        >
          <Image
            src="/invariant.png"
            alt="InvariantX — Security Knowledge That Transfers"
            width={2048}
            height={672}
            priority
            sizes="220px"
            className={[
              "h-auto w-full max-w-[205px] sm:max-w-[220px]",
              "object-contain object-left",
              "transition-[transform,filter]",
              "duration-300 ease-out",
              "group-hover/brand:scale-[1.012]",
              "group-hover/brand:drop-shadow-[0_0_7px_rgba(34,211,238,0.16)]",
            ].join(" ")}
          />
        </Link>

        {onNavigate ? (
          <button
            type="button"
            onClick={onNavigate}
            aria-label="Close navigation"
            className={[
              "ml-2 flex size-8 shrink-0",
              "items-center justify-center",
              "rounded-lg text-zinc-500",
              "transition-colors duration-200",
              "hover:bg-white/[0.06]",
              "hover:text-white",
              "lg:hidden",
            ].join(" ")}
          >
            <X className="size-4" />
          </button>
        ) : null}
      </div>

      <nav aria-label="Primary navigation" className="flex-1 px-3 py-5">
        <div className="mb-3 px-3 text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-600">
          Workspace
        </div>

        <div className="space-y-1.5">
          {navigation.map((item) => {
            const Icon = item.icon;

            const active = isActiveRoute(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className={[
                  "group/nav relative flex w-full",
                  "items-center gap-2.5",
                  "overflow-hidden rounded-xl border",
                  "px-2.5 py-2.5 text-sm",
                  "transition-[background-color,border-color,color,box-shadow,transform]",
                  "duration-200 ease-out",
                  active
                    ? [
                        "border-cyan-300/[0.11]",
                        "bg-cyan-300/[0.055]",
                        "text-zinc-100",
                        "shadow-[inset_0_1px_0_rgba(255,255,255,0.025)]",
                      ].join(" ")
                    : [
                        "border-transparent",
                        "text-zinc-500",
                        "hover:translate-x-[2px]",
                        "hover:border-cyan-300/[0.11]",
                        "hover:bg-cyan-300/[0.04]",
                        "hover:text-zinc-200",
                      ].join(" "),
                ].join(" ")}
              >
                <span
                  className={[
                    "pointer-events-none",
                    "absolute inset-0",
                    "bg-gradient-to-r",
                    "from-cyan-400/[0.07]",
                    "via-violet-400/[0.02]",
                    "to-transparent",
                    "transition-opacity duration-200",
                    active
                      ? "opacity-100"
                      : ["opacity-0", "group-hover/nav:opacity-100"].join(" "),
                  ].join(" ")}
                />

                <span
                  className={[
                    "pointer-events-none",
                    "absolute inset-y-2 left-0",
                    "w-px rounded-full",
                    "bg-gradient-to-b",
                    "from-cyan-200",
                    "via-cyan-400",
                    "to-violet-400",
                    "shadow-[0_0_8px_rgba(34,211,238,0.5)]",
                    "transition-opacity duration-200",
                    active
                      ? "opacity-100"
                      : ["opacity-0", "group-hover/nav:opacity-45"].join(" "),
                  ].join(" ")}
                />

                <span
                  className={[
                    "relative flex size-8",
                    "shrink-0 items-center",
                    "justify-center rounded-lg",
                    "transition-[background-color,color,transform]",
                    "duration-200",
                    active
                      ? ["bg-cyan-300/[0.08]", "text-cyan-200"].join(" ")
                      : [
                          "text-zinc-600",
                          "group-hover/nav:bg-cyan-300/[0.06]",
                          "group-hover/nav:text-cyan-200",
                        ].join(" "),
                  ].join(" ")}
                >
                  <Icon className="size-[16px] transition-transform duration-200 group-hover/nav:scale-105" />
                </span>

                <span className="relative truncate">{item.label}</span>

                <span
                  className={[
                    "relative ml-auto size-1",
                    "rounded-full bg-cyan-300",
                    "shadow-[0_0_7px_rgba(103,232,249,0.7)]",
                    "transition-opacity duration-200",
                    active
                      ? "opacity-80"
                      : ["opacity-0", "group-hover/nav:opacity-40"].join(" "),
                  ].join(" ")}
                />
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="border-t border-white/[0.06] p-4">
        <div
          className={[
            "rounded-xl border",
            "border-white/[0.06]",
            "bg-black/25 p-3",
            "transition-colors duration-200",
            "hover:border-emerald-300/[0.10]",
          ].join(" ")}
        >
          <div className="flex items-center gap-2">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-300 opacity-40" />

              <span className="relative inline-flex size-2 rounded-full bg-emerald-300" />
            </span>

            <span className="text-xs font-medium text-zinc-300">
              Security engine online
            </span>
          </div>

          <p className="mt-2 text-[11px] leading-4 text-zinc-600">
            Deterministic enforcement with human-controlled policy activation.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      <aside
        className={[
          "fixed inset-y-0 left-0 z-30",
          "hidden w-64",
          "border-r border-white/[0.06]",
          "bg-[#070910]/95",
          "backdrop-blur-md",
          "lg:block",
        ].join(" ")}
      >
        <SidebarContent pathname={pathname} />
      </aside>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <motion.button
            type="button"
            aria-label="Close navigation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
          />

          <motion.aside
            initial={{ x: -288 }}
            animate={{ x: 0 }}
            transition={{
              type: "spring",
              stiffness: 320,
              damping: 32,
            }}
            className={[
              "relative h-full w-[min(18rem,calc(100vw-2rem))] max-w-full",
              "border-r border-white/[0.08]",
              "bg-[#070910]/98",
              "backdrop-blur-md",
            ].join(" ")}
          >
            <SidebarContent pathname={pathname} onNavigate={onClose} />
          </motion.aside>
        </div>
      ) : null}
    </>
  );
}
