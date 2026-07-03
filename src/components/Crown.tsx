type Props = { className?: string; style?: React.CSSProperties };

export default function Crown({ className, style }: Props) {
  return (
    <svg className={className} style={style} viewBox="0 0 64 42" fill="currentColor" aria-hidden>
      <path d="M3 36 7 13 20 25 32 5 44 25 57 13 61 36Z" />
      <rect x="3" y="36" width="58" height="5" />
      <circle cx="7" cy="12" r="3.4" />
      <circle cx="32" cy="4.5" r="3.6" />
      <circle cx="57" cy="12" r="3.4" />
    </svg>
  );
}
