import React, { useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Download } from "lucide-react";
import { fireConfetti } from "../../../utils/confetti.js";

const PLATFORM_MAP = {
  leetcode: {
    name: "LeetCode",
    logo: "/assets/platformLogos/leetcode-logo.png",
    baseUrl: "https://leetcode.com/u/",
  },
  geeksforgeeks: {
    name: "GeeksForGeeks",
    logo: "/assets/platformLogos/GeeksForGeeks.png",
    baseUrl: "https://www.geeksforgeeks.org/user/",
  },
  gfg: {
    name: "GeeksForGeeks",
    logo: "/assets/platformLogos/GeeksForGeeks.png",
    baseUrl: "https://www.geeksforgeeks.org/user/",
  },
  codeforces: {
    name: "CodeForces",
    logo: "/assets/platformLogos/codeforces-logo.png",
    baseUrl: "https://codeforces.com/profile/",
  },
  hackerrank: {
    name: "HackerRank",
    logo: "/assets/platformLogos/hackerrank-logo.png",
    baseUrl: "https://www.hackerrank.com/profile/",
  },
  github: {
    name: "GitHub",
    logo: "/assets/platformLogos/github-logo.png",
    baseUrl: "https://github.com/",
  },
};

const KompileCard = React.forwardRef(function KompileCard(
  { allStats, userData, stats },
  ref,
) {
  useEffect(() => {
    fireConfetti();
  }, []);

  const effectiveUserData = userData || stats || {};
  const effectiveAllStats = allStats || stats || {};

  const name =
    effectiveUserData?.name ||
    effectiveUserData?.fullname ||
    effectiveUserData?.username ||
    "-";
  const username = effectiveUserData?.username || "-";

  const totalQuestions =
    effectiveAllStats?.totalQuestions ??
    effectiveAllStats?.questionsSolved ??
    0;
  const totalActiveDays =
    effectiveAllStats?.totalActiveDays ?? effectiveAllStats?.activeDays ?? 0;

  const defaultSkills = [
    "JAVA",
    "C++",
    "DSA",
    "CP",
    "PYTHON",
    "TS",
    "SQL",
    "HTML",
    "CSS",
  ];
  const userSkills = effectiveUserData?.skills?.length
    ? effectiveUserData.skills
    : defaultSkills;

  const skillsToShow = userSkills.slice(0, 9);

  const formatLastUpdated = (dateInput) => {
    if (!dateInput) return "-";
    try {
      const d = new Date(dateInput);
      if (isNaN(d.getTime())) return String(dateInput);
      return d
        .toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
        .replace(/\//g, "-");
    } catch (e) {
      return "-";
    }
  };

  const lastUpdated = formatLastUpdated(
    effectiveAllStats?.lastSyncedAt || effectiveAllStats?.lastUpdated,
  );

  const getActivePlatforms = () => {
    const list = [];
    const connected = effectiveUserData?.connectedPlatforms || [];

    connected.forEach((cp) => {
      if (cp.platform && cp.username) {
        const key = cp.platform.toLowerCase();
        if (PLATFORM_MAP[key] && !list.some((p) => p.key === key)) {
          list.push({
            key,
            username: cp.username,
            ...PLATFORM_MAP[key],
          });
        }
      }
    });

    if (
      effectiveUserData?.leetcodeUsername &&
      !list.some((p) => p.key === "leetcode")
    ) {
      list.push({
        key: "leetcode",
        username: effectiveUserData.leetcodeUsername,
        ...PLATFORM_MAP.leetcode,
      });
    }
    if (
      effectiveUserData?.codeforcesUsername &&
      !list.some((p) => p.key === "codeforces")
    ) {
      list.push({
        key: "codeforces",
        username: effectiveUserData.codeforcesUsername,
        ...PLATFORM_MAP.codeforces,
      });
    }
    if (
      effectiveUserData?.githubUsername &&
      !list.some((p) => p.key === "github")
    ) {
      list.push({
        key: "github",
        username: effectiveUserData.githubUsername,
        ...PLATFORM_MAP.github,
      });
    }

    if (list.length === 0) {
      return [
        { key: "leetcode", ...PLATFORM_MAP.leetcode },
        { key: "gfg", ...PLATFORM_MAP.geeksforgeeks },
        { key: "github", ...PLATFORM_MAP.github },
        { key: "hackerrank", ...PLATFORM_MAP.hackerrank },
        { key: "codeforces", ...PLATFORM_MAP.codeforces },
      ];
    }

    return list;
  };

  const activePlatforms = getActivePlatforms();

  const renderAvatarContent = () => {
    if (
      effectiveUserData?.profileImage &&
      !effectiveUserData.profileImage.includes("placehold")
    ) {
      return (
        <img
          src={effectiveUserData.profileImage}
          alt={name}
          className="w-full h-full object-cover rounded-full bg-[#111]"
        />
      );
    }

    if (name === "Siddharth Singh") {
      return (
        <img
          src="/assets/kompileCard/face-removebg-preview 1.png"
          alt={name}
          className="w-full h-full object-cover rounded-full bg-[#111]"
        />
      );
    }

    const initials = (name || "UK")
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase())
      .join("");

    return (
      <div
        className="w-full h-full flex items-center justify-center text-white font-extrabold text-3xl md:text-4xl rounded-full select-none"
        style={{
          background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
        }}
      >
        {initials}
      </div>
    );
  };

  const internalCardRef = useRef(null);
  const cardRef = ref || internalCardRef;

  const handlePrint = useReactToPrint({
    contentRef: cardRef,
    documentTitle: `${username}-kompile-profile`,
    pageStyle: `
      @page {
        size: A4;
        margin: 0;
      }
      @media print {
        html, body {
          width: 100% !important;
          height: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
          background-color: #060807 !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        .no-print {
          display: none !important;
        }
        .print-fullpage {
          width: 100vw !important;
          height: 100vh !important;
          min-height: 100vh !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          background-color: #060807 !important;
          box-sizing: border-box !important;
          overflow: hidden !important;
        }
        .print-fullpage > * {
          transform: scale(1.45) !important;
          transform-origin: center center !important;
        }
      }
    `,
  });

  return (
    <div className="w-2/3 flex flex-col items-center gap-4">
      <button
        onClick={handlePrint}
        className="no-print flex items-center gap-2 px-5 py-2.5 bg-[#00e575] hover:bg-[#00c766] text-black font-semibold text-sm rounded-xl shadow-lg hover:shadow-[#00e575]/20 transition-all cursor-pointer"
      >
        <Download size={18} />
        Download PDF
      </button>

      <div ref={cardRef} className="print-fullpage flex justify-center items-center w-full">
        <div className="p-2 bg-[#080808] border-[5px] border-black rounded-[32px] shadow-2xl">
          <div className="relative w-full max-w-[380px] bg-[#070a08] border-2 border-[#00e575] rounded-[24px] p-1.5 md:p-2 text-white font-sans shadow-[0_0_20px_rgba(0,229,117,0.18)] overflow-hidden">
            <div className="absolute inset-0 bg-[#060807] z-0" />

            <div
              className="absolute top-0 left-0 w-full h-[210px] pointer-events-none opacity-40 mix-blend-screen bg-cover bg-top z-0"
              style={{
                backgroundImage: `url('/assets/kompileCard/green_circuit.png')`,
              }}
            />

            <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-[#060807] via-[#060807]/90 to-transparent pointer-events-none z-0" />

            <div className="relative z-10 pl-2 pt-1 mb-1">
              <div className="text-[#00e575] font-bold text-sm leading-tight tracking-wide">
                My
              </div>
              <div className="text-[#00e575] font-bold text-sm leading-tight tracking-wide">
                Card
              </div>
            </div>

            <div className="relative z-20 flex justify-center -mb-14 md:-mb-16">
              <div className="relative">
                <div className="w-32 h-32 md:w-36 md:h-36 rounded-full p-[4px] bg-gradient-to-b from-[#fce49c] via-[#e2b047] to-[#996e15] shadow-lg shadow-amber-500/20 flex items-center justify-center">
                  {renderAvatarContent()}
                </div>

                <div className="absolute -bottom-0.5 -right-0.5 w-10 h-10 md:w-11 md:h-11 rounded-full border-2 border-[#e2b047] bg-[#1a140d] overflow-hidden shadow-sm flex items-center justify-center z-20">
                  <img
                    src="/assets/kompileCard/face-removebg-preview 1.png"
                    alt="Mascot Badge"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            <div className="relative z-10 bg-[#060a08]/95 border border-[#00e575]/30 rounded-[20px] pt-14 md:pt-16 pb-3 px-3 flex flex-col items-center gap-2">
              <div className="flex items-center justify-center gap-1.5 text-center">
                <h2 className="text-lg md:text-xl font-bold text-[#00e575] tracking-wide">
                  {name}
                </h2>
                <svg
                  className="w-4 h-4 md:w-5 md:h-5 text-[#00e575] shrink-0"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                  />
                </svg>
              </div>

              <div className="bg-[#052212] border border-[#00e575]/40 text-[#00e575] text-xs font-medium px-3 py-0.5 rounded-full tracking-wide shadow-sm shadow-[#00e575]/10">
                @{username}
              </div>
              <div className="flex items-center gap-1.5 text-[#e5a93c] text-xs font-medium tracking-wide">
                <svg
                  className="w-3.5 h-3.5 text-[#e5a93c]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span>Last updated on {lastUpdated}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 w-full mt-0.5">
                <div className="bg-[#08130c] border border-[#00e575]/30 rounded-xl py-2 px-1.5 flex flex-col items-center justify-center text-center">
                  <span className="text-[11px] md:text-xs font-semibold text-[#00e575] border-b border-[#00e575]/40 pb-0.5 px-2 mb-1 tracking-wide">
                    Questions Solved
                  </span>
                  <span className="text-2xl md:text-3xl font-extrabold text-[#00e575] tracking-tight">
                    {totalQuestions}
                  </span>
                </div>

                <div className="bg-[#08130c] border border-[#00e575]/30 rounded-xl py-2 px-1.5 flex flex-col items-center justify-center text-center">
                  <span className="text-[11px] md:text-xs font-semibold text-[#00e575] border-b border-[#00e575]/40 pb-0.5 px-2 mb-1 tracking-wide">
                    Active Days
                  </span>
                  <span className="text-2xl md:text-3xl font-extrabold text-[#00e575] tracking-tight">
                    {totalActiveDays}
                  </span>
                </div>
              </div>

              <div className="bg-[#08130c] border border-[#00e575]/30 rounded-xl py-2 px-3 w-full flex flex-col items-center justify-center">
                <span className="text-[11px] md:text-xs font-semibold text-[#00e575] mb-2 tracking-wide">
                  You can find me on ...
                </span>
                <div className="flex items-center justify-center gap-3.5 flex-wrap">
                  {activePlatforms.map((item, index) => {
                    const href = item.username
                      ? `${item.baseUrl}${item.username}`
                      : item.baseUrl;
                    return (
                      <a
                        key={item.key || index}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={
                          item.username
                            ? `${item.name}: ${item.username}`
                            : item.name
                        }
                        className="hover:scale-110 transition-transform cursor-pointer"
                      >
                        <img
                          src={item.logo}
                          alt={item.name}
                          className="w-5 h-5 md:w-6 md:h-6 object-contain"
                        />
                      </a>
                    );
                  })}
                </div>
              </div>

              <div className="bg-[#08130c] border border-[#00e575]/30 rounded-xl py-2 px-2 w-full flex flex-col items-center justify-center">
                <span className="text-[11px] md:text-xs font-semibold text-[#00e575] mb-1.5 tracking-wide">
                  Skills
                </span>
                <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-full">
                  {skillsToShow.map((skill, index) => {
                    const tag = skill.startsWith("#")
                      ? skill.toUpperCase()
                      : `#${skill.toUpperCase()}`;
                    return (
                      <span
                        key={index}
                        className="bg-[#072414] border border-[#00e575]/40 text-[#00e575] text-[10px] font-semibold px-2.5 py-0.5 rounded-full tracking-wider shadow-sm hover:border-[#00e575] transition-all cursor-default"
                      >
                        {tag}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default KompileCard;
