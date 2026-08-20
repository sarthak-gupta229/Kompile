import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const STATIC_RAILS = [
  "M388 96L388 68C388 65.7909 386.209 64 384 64L310 64",
  "M349 150L73 150C70.7909 150 69 151.791 69 154L69 174",
  "M412 96L412 0",
  "M436 96L436 0",
  "M436 214L436 184",
  "M460 96L460 64",
  "M460 239L460 184",
  "M484 96L484 24C484 21.7909 485.791 20 488 20L554 20",
  "M484 184L484 210C484 212.209 485.791 214 488 214L560 214",
  "M508 184L508 193C508 195.209 509.791 197 512 197L560 197",
];

const VIA_DOTS = [
  [460, 64],
  [308, 64],
  [69, 173],
  [436, 214],
  [460, 240],
  [560, 214],
  [560, 197],
];

const TRACES = [
  {
    id: "blue-pulse-1",
    path: "M349 130L5.00002 130C2.79088 130 1.00001 131.791 1.00001 134L1.00001 264",
    from: "#2EB9DF",
    to: "#2EB9DF",
    duration: 2200,
    delay: 0,
    reverse: true,
  },
  {
    id: "blue-pulse-2",
    path: "M388 184L388 194C388 196.209 386.209 198 384 198L77 198C74.7909 198 73 199.791 73 202L73 264",
    from: "#2EB9DF",
    to: "#2EB9DF",
    duration: 2600,
    delay: 500,
    reverse: true,
  },
  {
    id: "pink-pulse-1",
    path: "M412 263.5L412 184",
    from: "#FF4A81",
    to: "#DF6CF6",
    duration: 1500,
    delay: 1000,
    reverse: false,
  },
  {
    id: "pink-pulse-2",
    path: "M547 150L633 150C635.209 150 637 151.791 637 154L637 236C637 238.209 635.209 240 633 240L488 240C485.791 240 484 241.791 484 244L484 264",
    from: "#FF4A81",
    to: "#DF6CF6",
    duration: 3000,
    delay: 1500,
    reverse: true,
  },
  {
    id: "orange-pulse-1",
    path: "M547 130L822 130C824.209 130 826 131.791 826 134L826 264",
    from: "#FF7432",
    to: "#F7CC4B",
    duration: 2400,
    delay: 2000,
    reverse: true,
  },
  {
    id: "orange-pulse-2",
    path: "M508 96L508 88C508 85.7909 509.791 84 512 84L886 84C888.209 84 890 85.7909 890 88L890 264",
    from: "#FF7432",
    to: "#F7CC4B",
    duration: 2800,
    delay: 2500,
    reverse: true,
  },
];

export default function PoweredByChip() {
  const navigate = useNavigate();
  const railRefs = useRef({});
  const gradientRefs = useRef({});

  useEffect(() => {
    let raf;
    const start = performance.now();

    const LOOKAHEAD = 0.16;

    const toPathT = (p, reversed) => (reversed ? 1 - p : p);

    const frame = (now) => {
      const elapsed = now - start;

      TRACES.forEach((trace) => {
        const rail = railRefs.current[trace.id];
        const gradient = gradientRefs.current[trace.id];
        if (!rail || !gradient) return;

        const total = rail.getTotalLength();
        const local = (elapsed + trace.delay) % trace.duration;
        const p = local / trace.duration;

        const tCurrent = toPathT(p, trace.reverse);
        const tAhead = toPathT(Math.min(1, p + LOOKAHEAD), trace.reverse);

        const current = rail.getPointAtLength(tCurrent * total);
        const ahead = rail.getPointAtLength(tAhead * total);

        gradient.setAttribute("x1", current.x);
        gradient.setAttribute("y1", current.y);
        gradient.setAttribute("x2", ahead.x);
        gradient.setAttribute("y2", ahead.y);
      });

      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      style={{
        width: "100%",
        background: "#000",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        paddingBottom: 24,
        paddingTop: 24,
      }}
    >
      <style>{`
        .chip-cards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          width: 100%;
          max-width: 1100px;
          padding: 0;
        }
        @media (max-width: 767px) {
          .chip-cards-grid {
            grid-template-columns: 1fr;
          }
        }
        @media (min-width: 768px) and (max-width: 1024px) {
          .chip-cards-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
      <h2
        style={{
          color: "#fff",
          fontSize: "clamp(1.4rem, 3vw, 2rem)",
          fontWeight: 700,
          textAlign: "center",
          margin: "0 0 16px",
          letterSpacing: "-0.01em",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        Your all-in-one platform for coding success
      </h2>

      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 891,
          margin: "0 auto",
          padding: 0,
        }}
      >
        <svg
          viewBox="0 0 891 264"
          width="891"
          height="264"
          style={{ width: "100%", height: "auto", display: "block" }}
        >
          <defs>
            {TRACES.map((t) => (
              <linearGradient
                key={t.id}
                id={t.id}
                gradientUnits="userSpaceOnUse"
                ref={(el) => {
                  gradientRefs.current[t.id] = el;
                }}
              >
                <stop offset="0" stopColor={t.from} stopOpacity="0" />
                <stop offset="0.7" stopColor={t.to} stopOpacity="1" />
                <stop offset="0.94" stopColor={t.to} stopOpacity="1" />
                <stop offset="1" stopColor={t.to} stopOpacity="0" />
              </linearGradient>
            ))}
          </defs>

          {STATIC_RAILS.map((d, i) => (
            <path
              key={`static-${i}`}
              d={d}
              stroke="#fff"
              strokeOpacity="0.1"
              fill="none"
            />
          ))}

          {TRACES.map((t) => (
            <path
              key={`rail-${t.id}`}
              d={t.path}
              stroke="#fff"
              strokeOpacity="0.1"
              fill="none"
              ref={(el) => {
                railRefs.current[t.id] = el;
              }}
            />
          ))}

          {TRACES.map((t) => (
            <path
              key={`glow-${t.id}`}
              d={t.path}
              stroke={`url(#${t.id})`}
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
          ))}

          {VIA_DOTS.map(([x, y], i) => (
            <g key={`via-${i}`}>
              <circle cx={x} cy={y} r="4" fill="#000" />
              <circle
                cx={x}
                cy={y}
                r="3.5"
                stroke="#fff"
                strokeOpacity="0.1"
                fill="none"
              />
            </g>
          ))}
        </svg>

        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "53%",
            transform: "translate(-50%, -50%)",
            width: 110,
            height: 90,
            borderRadius: 14,
            background: "linear-gradient(180deg,#1a1a1f,#0e0e12)",
            border: "1px solid rgba(192,192,192,0.6)",
            boxShadow:
              "0 0 50px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.04)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {[14, 28, 42, 56, 70, 84].map((x, i) => (
            <span
              key={`top-${i}`}
              style={{
                position: "absolute",
                top: -6,
                left: x,
                width: 4,
                height: 6,
                background: "#c0c0c0",
              }}
            />
          ))}
          {[14, 28, 42, 56, 70, 84].map((x, i) => (
            <span
              key={`bottom-${i}`}
              style={{
                position: "absolute",
                bottom: -6,
                left: x,
                width: 4,
                height: 6,
                background: "#c0c0c0",
              }}
            />
          ))}
          {[24, 54].map((y, i) => (
            <span
              key={`left-${i}`}
              style={{
                position: "absolute",
                left: -6,
                top: y,
                width: 6,
                height: 4,
                background: "#c0c0c0",
              }}
            />
          ))}
          {[24, 54].map((y, i) => (
            <span
              key={`right-${i}`}
              style={{
                position: "absolute",
                right: -6,
                top: y,
                width: 6,
                height: 4,
                background: "#c0c0c0",
              }}
            />
          ))}

          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="38"
            height="38"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#f97316"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-1.66Z" />
            <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-1.66Z" />
          </svg>
        </div>
      </div>

      <div className="chip-cards-grid">
        <div
          onClick={() => navigate("/workspace/profile/sarthakgupta")}
          style={{
            background: "#111",
            border: "1px solid rgba(192,192,192,0.5)",
            borderRadius: 16,
            padding: "32px 28px 36px",
            cursor: "pointer",
            transition: "border-color 0.2s, transform 0.2s",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = "rgba(46,185,223,0.7)";
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = "rgba(192,192,192,0.5)";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <div style={{ marginBottom: 20 }}>
            <svg
              width="48"
              height="48"
              viewBox="0 0 36 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                width="36"
                height="36"
                rx="8"
                fill="rgba(46,185,223,0.12)"
              />
              <text
                x="18"
                y="24"
                textAnchor="middle"
                fontSize="16"
                fontWeight="bold"
                fill="#2EB9DF"
                fontFamily="monospace"
              >
                {"</>"}
              </text>
            </svg>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginBottom: 8,
            }}
          >
            <span
              style={{
                color: "#fff",
                fontWeight: 700,
                fontSize: 17,
                fontFamily: "Inter, system-ui, sans-serif",
              }}
            >
              Track your DSA preparation
            </span>
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#9a9aa5"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="7" y1="17" x2="17" y2="7" />
              <polyline points="7 7 17 7 17 17" />
            </svg>
          </div>
          <p
            style={{
              color: "#a1a1aa",
              fontSize: 14,
              lineHeight: 1.6,
              margin: 0,
              fontFamily: "Inter, system-ui, sans-serif",
            }}
          >
            Solve problems, track progress, and strengthen your data structures
            and algorithms skills.
          </p>
        </div>

        <div
          onClick={() => navigate("/company")}
          style={{
            background: "#111",
            border: "1px solid rgba(192,192,192,0.5)",
            borderRadius: 16,
            padding: "32px 28px 36px",
            cursor: "pointer",
            transition: "border-color 0.2s, transform 0.2s",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = "rgba(255,74,129,0.7)";
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = "rgba(192,192,192,0.5)";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <div style={{ marginBottom: 20 }}>
            <svg
              width="48"
              height="48"
              viewBox="0 0 36 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                width="36"
                height="36"
                rx="8"
                fill="rgba(255,74,129,0.12)"
              />
              <g
                transform="translate(7,7)"
                stroke="#FF4A81"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              >
                <circle cx="8" cy="7" r="3.5" />
                <path d="M2 18c0-3.3 2.7-6 6-6" />
                <rect x="11" y="11" width="9" height="7" rx="2" />
                <path d="M13 14h5M13 16h3" />
              </g>
            </svg>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginBottom: 8,
            }}
          >
            <span
              style={{
                color: "#fff",
                fontWeight: 700,
                fontSize: 17,
                fontFamily: "Inter, system-ui, sans-serif",
              }}
            >
              Prepare for interview
            </span>
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#9a9aa5"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="7" y1="17" x2="17" y2="7" />
              <polyline points="7 7 17 7 17 17" />
            </svg>
          </div>
          <p
            style={{
              color: "#a1a1aa",
              fontSize: 14,
              lineHeight: 1.6,
              margin: 0,
              fontFamily: "Inter, system-ui, sans-serif",
            }}
          >
            Practice real interview questions, get AI feedback, and boost your
            confidence.
          </p>
        </div>

        <div
          onClick={() => window.open("https://kompile-eight.vercel.app/workspace/profile/", "_blank")}
          style={{
            background: "#111",
            border: "1px solid rgba(192,192,192,0.5)",
            borderRadius: 16,
            padding: "32px 28px 36px",
            cursor: "pointer",
            transition: "border-color 0.2s, transform 0.2s",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = "rgba(247,204,75,0.7)";
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = "rgba(192,192,192,0.5)";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <div style={{ marginBottom: 20 }}>
            <svg
              width="48"
              height="48"
              viewBox="0 0 36 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                width="36"
                height="36"
                rx="8"
                fill="rgba(255,116,50,0.12)"
              />
              <g
                transform="translate(7,8)"
                stroke="#F7CC4B"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              >
                <rect x="1" y="1" width="20" height="14" rx="2" />
                <path d="M7 19h8M11 15v4" />
                <text
                  x="11"
                  y="11"
                  textAnchor="middle"
                  fontSize="6"
                  fontWeight="bold"
                  fill="#F7CC4B"
                  fontFamily="monospace"
                  stroke="none"
                >
                  {"</>"}
                </text>
              </g>
            </svg>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginBottom: 8,
            }}
          >
            <span
              style={{
                color: "#fff",
                fontWeight: 700,
                fontSize: 17,
                fontFamily: "Inter, system-ui, sans-serif",
              }}
            >
              Track your development
            </span>
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#9a9aa5"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="7" y1="17" x2="17" y2="7" />
              <polyline points="7 7 17 7 17 17" />
            </svg>
          </div>
          <p
            style={{
              color: "#a1a1aa",
              fontSize: 14,
              lineHeight: 1.6,
              margin: 0,
              fontFamily: "Inter, system-ui, sans-serif",
            }}
          >
            Monitor your coding journey, build consistency, and grow as a better
            developer every day.
          </p>
        </div>
      </div>
    </div>
  );
}
