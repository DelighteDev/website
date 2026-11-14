import { useEffect, useRef, useState } from "react";
import { wordMutations } from "../data/home";

const phrases = Object.keys(wordMutations).sort((a, b) => b.length - a.length);
const escaped = phrases.map((phrase) => phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
const phrasePattern = new RegExp(`(${escaped.join("|")})`, "g");

export default function MutatingParagraph({ text }) {
  const [swapped, setSwapped] = useState(() => new Set());
  const swappedRef = useRef(swapped);
  swappedRef.current = swapped;
  const parts = text.split(phrasePattern).filter(Boolean);

  const mutate = (part) => {
    if (!wordMutations[part]) return;
    setSwapped((current) => new Set(current).add(part));
  };

  useEffect(() => {
    let lastMutation = 0;
    const onScroll = () => {
      const now = performance.now();
      if (now - lastMutation < 1500) return;
      const available = phrases.filter((phrase) => text.includes(phrase) && !swappedRef.current.has(phrase));
      if (!available.length || Math.random() > 0.42) return;
      lastMutation = now;
      mutate(available[Math.floor(Math.random() * available.length)]);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [text]);

  return (
    <p className="mutating-paragraph">
      {parts.map((part, index) =>
        wordMutations[part] ? (
          <span
            key={`${part}-${index}`}
            className="mutating-word"
            onMouseEnter={() => mutate(part)}
          >
            {swapped.has(part) ? wordMutations[part] : part}
          </span>
        ) : (
          <span key={index}>{part}</span>
        ),
      )}
    </p>
  );
}
