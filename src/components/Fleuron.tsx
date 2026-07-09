// Small filigree glyph used instead of the Crown wherever a decorative
// marker is wanted but the full brand mark would dilute the Crown's meaning.
// Rule of thumb: Crown = brand/ornament dividers/editorial signatures only.
// Fleuron = every other decorative moment (section prefixes, editorial marks).
export default function Fleuron({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z" />
    </svg>
  );
}
