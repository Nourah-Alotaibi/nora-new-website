import { useRef, useId } from "react";
import { PA_PROJECTS } from "@/data/portfolio";

export const artColors = [
  ["#dfdfc4", "#9db178", "#526c49"],
  ["#e8dbd1", "#cf9f83", "#85708d"],
  ["#dbddef", "#999fc9", "#626b91"],
  ["#e6e8c6", "#b8c975", "#608150"],
  ["#dce6dd", "#a4cbb9", "#52746c"],
];
export function ProjectArt({ index }: { index: number }) {
  const [bg, mid, dark] = artColors[index];
  const id = `gallery-art-${useId().replace(/:/g, "")}`;
  return (
    <svg
      viewBox="0 0 300 340"
      role="img"
      aria-label={`${PA_PROJECTS[index].title} conceptual artwork`}
    >
      <defs>
        <linearGradient id={`${id}-g`} x1="0" x2="1" y1="0" y2="1">
          <stop stopColor={mid} />
          <stop offset="1" stopColor={dark} />
        </linearGradient>
        <radialGradient id={`${id}-s`} cx=".3" cy=".2">
          <stop stopColor="#fffce9" />
          <stop offset=".4" stopColor={mid} />
          <stop offset="1" stopColor={dark} />
        </radialGradient>
        <filter id={`${id}-shadow`}>
          <feDropShadow
            dx="7"
            dy="13"
            stdDeviation="7"
            floodColor={dark}
            floodOpacity=".23"
          />
        </filter>
        <filter id={`${id}-grain`}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency=".65"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncA type="linear" slope=".08" />
          </feComponentTransfer>
          <feBlend in="SourceGraphic" mode="multiply" />
        </filter>
      </defs>
      <rect width="300" height="340" fill={bg} />
      <circle cx="230" cy="55" r="60" fill="#fffbe3" opacity=".6" />
      <g filter={`url(#${id}-shadow)`}>
        {index === 0 ? (
          <>
            <ellipse
              cx="150"
              cy="251"
              rx="85"
              ry="20"
              fill={dark}
              opacity=".15"
            />
            <g transform="translate(150 160) rotate(-30)">
              <rect
                x="-62"
                y="-90"
                width="124"
                height="190"
                rx="62"
                fill={`url(#${id}-g)`}
              />
              <path d="M-62 8H62v30a62 62 0 0 1-124 0z" fill="#ece8d3" />
              <path
                d="M-40 -55q15-20 40-20"
                stroke="#f0f1d4"
                strokeWidth="7"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M-21 -30H21M0-51v42"
                stroke="#f9f6df"
                strokeWidth="10"
                strokeLinecap="round"
              />
            </g>
          </>
        ) : index === 1 ? (
          <>
            <ellipse
              cx="150"
              cy="250"
              rx="85"
              ry="18"
              fill={dark}
              opacity=".15"
            />
            <rect
              x="56"
              y="98"
              width="188"
              height="130"
              rx="38"
              fill={`url(#${id}-g)`}
            />
            <rect
              x="72"
              y="112"
              width="150"
              height="92"
              rx="28"
              fill="#f0e7de"
            />
            <circle cx="116" cy="151" r="17" fill={`url(#${id}-s)`} />
            <circle cx="181" cy="151" r="17" fill={`url(#${id}-s)`} />
            <path
              d="M139 179q12 9 25 0M150 97V73"
              stroke={dark}
              strokeWidth="5"
              fill="none"
              strokeLinecap="round"
            />
            <circle cx="150" cy="65" r="11" fill={mid} />
          </>
        ) : index === 2 ? (
          <>
            <circle cx="152" cy="144" r="86" fill="#f3edcf" />
            <path
              d="M62 79 L112 115 Q150 96 188 115 L238 79 L229 175 L249 196 L217 208 L202 252 L150 285 L98 252 L83 208 L51 196 L71 175 Z"
              fill={`url(#${id}-g)`}
            />
            <path
              d="M75 98L105 132L81 150ZM225 98L195 132L219 150Z"
              stroke="#ece5d0"
              strokeWidth="4"
              fill="none"
            />
            <path
              d="M91 175L129 187L119 199ZM209 175L171 187L181 199Z"
              fill="#f7efce"
            />
            <path d="M150 191L113 238L150 268L187 238Z" fill="#c7cbe0" />
            <path d="M133 231Q150 224 167 231L150 246Z" fill="#414c69" />
            <path
              d="M150 245V256M138 260L150 256L162 260"
              stroke="#414c69"
              strokeWidth="3"
              fill="none"
            />
          </>
        ) : index === 3 ? (
          <>
            <ellipse cx="150" cy="217" rx="107" ry="44" fill="#f5f0d9" />
            <ellipse cx="150" cy="205" rx="85" ry="34" fill={`url(#${id}-g)`} />
            <path
              d="M144 201C79 143 111 82 172 72c14 48 14 94-28 129z"
              fill={`url(#${id}-s)`}
            />
            <path d="M156 190c-8-57 29-87 78-74-2 40-36 71-78 74z" fill={mid} />
            <path
              d="M144 207l24-112M153 187l60-52"
              stroke="#eceac2"
              strokeWidth="3"
              fill="none"
            />
          </>
        ) : (
          <>
            <ellipse
              cx="150"
              cy="270"
              rx="100"
              ry="19"
              fill={dark}
              opacity=".13"
            />
            {[70, 110, 150, 190].map((x, i) => (
              <g key={x}>
                <path
                  d={`M${x} ${233 - i * 33}l24-13 21 12-24 13z`}
                  fill={mid}
                />
                <path
                  d={`M${x} ${233 - i * 33}l21 12v${32 + i * 33}l-21-12z`}
                  fill={dark}
                />
                <path
                  d={`M${x + 21} ${245 - i * 33}l24-13v${32 + i * 33}l-24 13z`}
                  fill={`url(#${id}-g)`}
                />
              </g>
            ))}
            <path
              d="M58 178l65-30 57-52 54-13"
              stroke="#fff7de"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
            />
          </>
        )}
      </g>
      <rect
        width="300"
        height="340"
        fill="transparent"
        filter={`url(#${id}-grain)`}
      />
      <text
        x="18"
        y="318"
        fill={dark}
        fontFamily="Georgia,serif"
        fontStyle="italic"
        fontSize="13"
      >
        {
          [
            "care, made personal.",
            "a little more possibility.",
            "an adventure in the making.",
            "a healthier everyday.",
            "a clearer perspective.",
          ][index]
        }
      </text>
    </svg>
  );
}
export default function ProjectGallery({
  active,
  onChange,
}: {
  active: number;
  onChange: (i: number) => void;
}) {
  const pointer = useRef<{ x: number; y: number } | null>(null),
    dragged = useRef(false);
  const change = (delta: number) =>
    onChange((active + delta + PA_PROJECTS.length) % PA_PROJECTS.length);
  return (
    <div
      className="art-gallery"
      role="group"
      aria-roledescription="carousel"
      aria-label="Project cover gallery"
      onKeyDown={e => {
        if (e.key === "ArrowRight") {
          e.preventDefault();
          change(1);
        }
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          change(-1);
        }
      }}
    >
      <div
        className="gallery-wall"
        onPointerDown={e => {
          pointer.current = { x: e.clientX, y: e.clientY };
          dragged.current = false;
        }}
        onPointerMove={e => {
          if (pointer.current && Math.abs(e.clientX - pointer.current.x) > 12)
            dragged.current = true;
        }}
        onPointerUp={e => {
          const p = pointer.current;
          pointer.current = null;
          if (!p) return;
          const dx = e.clientX - p.x,
            dy = e.clientY - p.y;
          if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy))
            change(dx < 0 ? 1 : -1);
        }}
        onPointerCancel={() => {
          pointer.current = null;
        }}
      >
        <div className="gallery-window-light" aria-hidden="true" />
        {PA_PROJECTS.map((project, i) => {
          let delta = i - active;
          if (delta > 2) delta -= 5;
          if (delta < -2) delta += 5;
          return (
            <button
              type="button"
              key={project.id}
              className={`gallery-canvas${delta === 0 ? " is-current" : ""}`}
              style={
                {
                  "--position": delta,
                  "--distance": Math.abs(delta),
                  "--angle": delta === 0 ? -2 : delta > 0 ? -24 : 24,
                  zIndex: 5 - Math.abs(delta),
                } as React.CSSProperties
              }
              aria-label={`View ${project.title}`}
              aria-pressed={active === i}
              aria-controls="studio-project"
              onClick={() => {
                if (!dragged.current) {
                  if (i === active)
                    document
                      .getElementById("studio-project")
                      ?.scrollIntoView({
                        behavior: matchMedia("(prefers-reduced-motion: reduce)")
                          .matches
                          ? "instant"
                          : "smooth",
                        block: "start",
                      });
                  else onChange(i);
                }
                dragged.current = false;
              }}
            >
              <div className="canvas-frame">
                <svg className="project-film-reel" viewBox="0 0 240 240" aria-hidden="true">
                  <defs>
                    <linearGradient id={`reel-metal-${i}`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#fff4d9"/><stop offset=".32" stopColor="#b5a383"/><stop offset=".52" stopColor="#e9dbbc"/><stop offset="1" stopColor="#86775e"/></linearGradient>
                    <radialGradient id={`reel-film-${i}`}><stop stopColor="#292b25"/><stop offset=".8" stopColor="#494438"/><stop offset="1" stopColor="#242720"/></radialGradient>
                  </defs>
                  <circle cx="122" cy="123" r="113" fill="#796c54"/>
                  <circle cx="120" cy="118" r="112" fill={`url(#reel-metal-${i})`} stroke="#8c7e63" strokeWidth="2"/>
                  <circle cx="120" cy="118" r="104" fill={`url(#reel-film-${i})`} stroke="#fff0ce" strokeWidth="2"/>
                  {[38,44,50,56,62,68,74,80,86,92,98].map(r=><circle key={r} cx="120" cy="118" r={r} fill="none" stroke="#b4a17d" strokeWidth=".6" opacity=".35"/>)}
                  {[0,60,120,180,240,300].map(angle=><path key={angle} d="M110 94 L105 25 Q120 19 135 25 L130 94 Z" transform={`rotate(${angle} 120 118)`} fill={`url(#reel-metal-${i})`} stroke="#eedfbc" strokeWidth="1.5"/>)}
                  <circle cx="120" cy="118" r="31" fill={`url(#reel-metal-${i})`} stroke="#f3e6c7" strokeWidth="2"/>
                  <circle cx="120" cy="118" r="12" fill="#4c483c" stroke="#948466" strokeWidth="3"/>
                  <circle cx="120" cy="118" r="108" fill="none" stroke="#fff2d3" strokeWidth="2" opacity=".75"/>
                </svg>
                <ProjectArt index={i} />
                <span className="frame-edge" aria-hidden="true" />
              </div>
              <span className="gallery-label">
                <span>
                  {project.number} / {project.badge}
                </span>
                <strong>{project.title}</strong>
                <span className="gallery-open">
                  {delta === 0 ? "Open film & story ↓" : "Bring into view ↗"}
                </span>
              </span>
            </button>
          );
        })}
        <div className="gallery-shelf" aria-hidden="true" />
      </div>
      <div className="gallery-controls">
        <button
          type="button"
          aria-label="Previous cover"
          onClick={() => change(-1)}
        >
          ←
        </button>
        <p>
          <strong>{String(active + 1).padStart(2, "0")}</strong> / 05{" "}
          <span>Drag to wander. Pick a cover.</span>
        </p>
        <button
          type="button"
          aria-label="Next cover"
          onClick={() => change(1)}
        >
          →
        </button>
      </div>
    </div>
  );
}
