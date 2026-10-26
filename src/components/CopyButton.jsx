import { useCopy } from "../hooks/useCopy";

export default function CopyButton({
  text,
  label = "Copy",
  copiedLabel = "Copied",
  className = "",
}) {
  const { copied, copy } = useCopy();

  return (
    <button
      type="button"
      className={`copy-button ${className}`.trim()}
      onClick={() => copy(text)}
      aria-live="polite"
    >
      {copied ? copiedLabel : label}
    </button>
  );
}
