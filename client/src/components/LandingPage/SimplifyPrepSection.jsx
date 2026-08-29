import React from "react";
import { useNavigate } from "react-router-dom";

export default function SimplifyPrepSection() {
  const navigate = useNavigate();

  return (
    <section className="w-full py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="relative rounded-2xl sm:rounded-3xl border border-zinc-800/80 bg-[#070709] p-6 sm:p-8 md:p-10 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.7)]">
        <div
          className="absolute inset-0 pointer-events-none opacity-40 bg-[size:24px_24px] bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)]"
          aria-hidden="true"
        />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
          <div className="lg:w-5/12 flex flex-col">
            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-12 h-12 rounded-xl bg-zinc-900/90 border border-orange-500/60 shadow-[0_0_20px_rgba(249,115,22,0.35)] flex items-center justify-center flex-shrink-0">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-orange-500"
                >
                  <path
                    d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z"
                    fill="#f97316"
                  />
                  <path
                    d="M19 2.5L20.2 6.3L24 7.5L20.2 8.7L19 12.5L17.8 8.7L14 7.5L17.8 6.3L19 2.5Z"
                    fill="#ea580c"
                    opacity="0.9"
                  />
                </svg>
              </div>

              <div className="grid grid-cols-4 gap-1 opacity-60">
                {[...Array(16)].map((_, i) => (
                  <div key={i} className="w-1 h-1 rounded-full bg-orange-400" />
                ))}
              </div>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-3">
              Simplify Your <span className="text-orange-500">Prep</span>
            </h2>

            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-md mb-6">
              Say goodbye to last-minute stress. Track all your questions and
              notes in one place for easy review and revision.
            </p>

            <div>
              <button
                onClick={() => navigate("/workspace")}
                className="group relative inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl border border-orange-500/90 bg-zinc-950/80 text-orange-500 font-semibold text-sm sm:text-base shadow-[0_0_18px_rgba(249,115,22,0.22)] hover:bg-orange-500 hover:text-white hover:shadow-[0_0_25px_rgba(249,115,22,0.45)] transition-all duration-300 cursor-pointer"
              >
                <span>Try Question Tracker</span>
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </button>
            </div>

            <div className="relative w-full max-w-[280px] h-8 mt-2 pointer-events-none select-none">
              <svg
                className="w-full h-full overflow-visible"
                viewBox="0 0 280 32"
                fill="none"
              >
                <path
                  d="M 8 6 Q 65 30 145 26 T 255 10"
                  stroke="#f97316"
                  strokeWidth="1.8"
                  strokeDasharray="4 4"
                  strokeLinecap="round"
                  opacity="0.85"
                />

                <g transform="translate(255, 10) rotate(-30)">
                  <path d="M -2 -6 L 13 0 L -2 6 L 2 0 Z" fill="#f97316" />
                </g>
              </svg>
            </div>
          </div>

          <div className="lg:w-7/12 grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
            <div
              onClick={() => navigate("/workspace")}
              className="group relative rounded-2xl p-5 sm:p-6 bg-[#09090b]/95 border border-zinc-800 hover:border-orange-500/50 transition-all duration-300 shadow-[0_8px_24px_rgba(0,0,0,0.5)] flex flex-col justify-between cursor-pointer overflow-hidden before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-orange-500/70 before:to-transparent hover:shadow-[0_0_30px_rgba(249,115,22,0.18)] hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-zinc-900/90 border border-orange-500/60 shadow-[0_0_18px_rgba(249,115,22,0.3)] flex items-center justify-center flex-shrink-0">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#f97316"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="4" width="9" height="7" rx="1" />
                      <path d="M7.5 11v3" />
                      <path d="M5.5 14h4" />
                      <rect x="14" y="8" width="7" height="9" rx="1" />
                      <circle cx="17.5" cy="11" r="0.5" fill="#f97316" />
                      <path d="M2 17h11" />
                    </svg>
                  </div>

                  <div className="grid grid-cols-4 gap-1 opacity-60">
                    {[...Array(16)].map((_, i) => (
                      <div
                        key={i}
                        className="w-1 h-1 rounded-full bg-orange-400"
                      />
                    ))}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mt-5 mb-1.5">
                  My Workspace
                </h3>

                <div className="w-9 h-0.5 bg-orange-500 rounded-full mb-2.5" />

                <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                  Tag & filter questions for easy organization
                </p>
              </div>

              <div className="mt-5">
                <div className="w-10 h-10 rounded-full border border-orange-500/70 flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white group-hover:shadow-[0_0_18px_rgba(249,115,22,0.4)] transition-all duration-300 shadow-[0_0_10px_rgba(249,115,22,0.15)]">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-transform duration-300 group-hover:translate-x-0.5"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </div>
              </div>
            </div>

            <div
              onClick={() => navigate("/workspace/sheets")}
              className="group relative rounded-2xl p-5 sm:p-6 bg-[#09090b]/95 border border-zinc-800 hover:border-orange-500/50 transition-all duration-300 shadow-[0_8px_24px_rgba(0,0,0,0.5)] flex flex-col justify-between cursor-pointer overflow-hidden before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-orange-500/70 before:to-transparent hover:shadow-[0_0_30px_rgba(249,115,22,0.18)] hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-zinc-900/90 border border-orange-500/60 shadow-[0_0_18px_rgba(249,115,22,0.3)] flex items-center justify-center flex-shrink-0">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#f97316"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="4" y="3" width="16" height="18" rx="2" />
                      <line x1="8" y1="7" x2="16" y2="7" />
                      <line x1="8" y1="11" x2="16" y2="11" />
                      <line x1="8" y1="15" x2="13" y2="15" />
                    </svg>
                  </div>

                  <div className="grid grid-cols-4 gap-1 opacity-60">
                    {[...Array(16)].map((_, i) => (
                      <div
                        key={i}
                        className="w-1 h-1 rounded-full bg-orange-400"
                      />
                    ))}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mt-5 mb-1.5">
                  Sheet Tracker
                </h3>

                <div className="w-9 h-0.5 bg-orange-500 rounded-full mb-2.5" />

                <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                  Track all coding sheets in one place
                </p>
              </div>

              <div className="mt-5">
                <div className="w-10 h-10 rounded-full border border-orange-500/70 flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white group-hover:shadow-[0_0_18px_rgba(249,115,22,0.4)] transition-all duration-300 shadow-[0_0_10px_rgba(249,115,22,0.15)]">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-transform duration-300 group-hover:translate-x-0.5"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
