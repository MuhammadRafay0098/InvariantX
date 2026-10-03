import CursorGlow from "@/components/effects/CursorGlow";
import SecurityGrid from "@/components/effects/SecurityGrid";

export default function AmbientBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[#05070d]" />

      <div className="ambient-orb ambient-orb-primary" />
      <div className="ambient-orb ambient-orb-secondary" />
      <div className="ambient-orb ambient-orb-tertiary" />

      <SecurityGrid />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(5,7,13,0.12)_42%,rgba(5,7,13,0.92)_100%)]" />

      <div className="noise-layer absolute inset-0" />

      <CursorGlow />
    </div>
  );
}
