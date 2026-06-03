import React from "react";

const PageSpinner = ({ size = 44, color = "currentColor", className = "" }) => {
  const r = size / 2;
  const cx = r;
  const cy = r;
  const dotCount = 12;
  const dots = Array.from({ length: dotCount });
  const radius = Math.max(8, r * 0.65);
  const dotRadius = Math.max(2, size * 0.06);

  return (
    <div className={`inline-block ${className}`} role="status" aria-live="polite">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false"
      >
        {dots.map((_, i) => {
          const angle = (i / dotCount) * Math.PI * 2;
          const dx = cx + Math.cos(angle) * radius;
          const dy = cy + Math.sin(angle) * radius;
          const begin = `${(i * 0.08).toFixed(2)}s`;
          return (
            <g key={i} transform={`translate(${dx.toFixed(2)} ${dy.toFixed(2)})`}>
              <circle cx="0" cy="0" r={dotRadius} fill={color} opacity="0.3">
                <animate
                  attributeName="opacity"
                  values="0.3;1;0.3"
                  dur="1s"
                  repeatCount="indefinite"
                  begin={begin}
                />
                <animateTransform
                  attributeName="transform"
                  type="scale"
                  values="0.6;1;0.6"
                  dur="1s"
                  repeatCount="indefinite"
                  begin={begin}
                />
              </circle>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default PageSpinner;
