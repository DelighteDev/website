export default function HiddenPhotoDetail({ variant }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
  };

  return (
    <svg className="lightbox-hidden-detail" viewBox="0 0 480 600" aria-hidden="true">
      {variant === 0 && (
        <g {...common}>
          <path d="M196 170h88v250h-88Z" />
          <path d="M196 170l53 29v221h-53Z" />
          <path d="M249 199h35v221h-35Z" fill="currentColor" opacity="0.35" />
        </g>
      )}
      {variant === 1 && (
        <g fill="currentColor">
          {[0, 1, 2, 3, 4].map((step) => (
            <g key={step} transform={`translate(${205 + (step % 2) * 55} ${220 + step * 62}) rotate(${step % 2 ? 13 : -9})`}>
              <ellipse rx="12" ry="25" />
              <circle cy="-30" r="7" />
            </g>
          ))}
        </g>
      )}
      {variant === 2 && (
        <g {...common}>
          <rect x="309" y="184" width="36" height="54" fill="currentColor" opacity="0.42" />
          <path d="M327 184v54M309 211h36" />
        </g>
      )}
      {variant === 3 && (
        <text x="240" y="190" textAnchor="middle" fill="currentColor" fontSize="27" letterSpacing="8" transform="rotate(-4 240 190)">
          EMPTY
        </text>
      )}
      {variant === 4 && (
        <g {...common}>
          <path d="M95 194h258M95 214h258M95 248h258M95 286h258" opacity="0.45" />
          <text x="225" y="325" textAnchor="middle" fill="currentColor" stroke="none" fontSize="16" letterSpacing="5">
            NO SIGNAL
          </text>
        </g>
      )}
      {variant === 5 && (
        <g {...common}>
          <path d="M82 520c89-83 131-140 161-238M243 282l-42 61M243 282l31 74" />
          <path d="M211 367l-32 8m32-8 5 34" />
        </g>
      )}
      {variant === 6 && (
        <g fill="currentColor" transform="translate(244 176) rotate(-12)">
          <ellipse rx="28" ry="37" />
          <ellipse cx="-35" cy="-29" rx="8" ry="24" transform="rotate(-25 -35 -29)" />
          <ellipse cx="-15" cy="-50" rx="8" ry="29" />
          <ellipse cx="7" cy="-55" rx="8" ry="31" />
          <ellipse cx="29" cy="-46" rx="8" ry="27" transform="rotate(13 29 -46)" />
          <ellipse cx="43" cy="-20" rx="7" ry="21" transform="rotate(29 43 -20)" />
        </g>
      )}
      {variant === 7 && (
        <text x="250" y="235" textAnchor="middle" fill="currentColor" fontSize="92" fontWeight="400">
          0
        </text>
      )}
      {variant === 8 && (
        <g {...common}>
          <ellipse cx="247" cy="456" rx="47" ry="18" />
          <ellipse cx="247" cy="456" rx="31" ry="10" opacity="0.5" />
          <path d="M302 435v48m8-48v48" />
        </g>
      )}
      {variant === 9 && (
        <text x="240" y="495" textAnchor="middle" fill="currentColor" fontSize="17" letterSpacing="4" transform="rotate(3 240 495)">
          DO NOT LOOK UP
        </text>
      )}
    </svg>
  );
}
