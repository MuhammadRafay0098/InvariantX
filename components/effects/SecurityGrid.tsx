export default function SecurityGrid() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div className="security-grid absolute inset-0" />
      <div className="security-grid-mask absolute inset-0" />
    </div>
  );
}
