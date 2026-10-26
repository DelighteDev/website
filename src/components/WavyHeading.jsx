export function WavyLine({ className = "" }) {
  return (
    <svg
      className={`wavy-line ${className}`.trim()}
      viewBox="0 0 180 14"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path d="M3 8.4C19 3.2 32 11.6 48 7.2S76 3.8 91 7.6s28 3.6 43-1.1 27-2.1 43 1.2" />
      <path d="M8 11.2c19-2.8 30 1.2 45-.8" />
    </svg>
  );
}

export default function WavyHeading({ as: Tag = "h2", children, className = "" }) {
  return (
    <div className={`wavy-heading ${className}`.trim()}>
      <Tag>{children}</Tag>
      <WavyLine />
    </div>
  );
}
