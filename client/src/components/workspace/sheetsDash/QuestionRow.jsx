import React, { useState } from "react";
import { Star, FileText } from "lucide-react";

// Platform icon components
const GFGIcon = () => (
  <svg width="22" height="22" viewBox="0 0 40 40" fill="none">
    <text x="50%" y="58%" dominantBaseline="middle" textAnchor="middle"
      fontSize="18" fontWeight="bold" fill="#2f8d46" fontFamily="Arial">
      G8
    </text>
  </svg>
);

const LeetCodeIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="#f89f1b">
    <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.02-2.164A1.382 1.382 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" />
  </svg>
);

const PLATFORM_ICONS = {
  gfg: { icon: <GFGIcon />, label: "GFG" },
  leetcode: { icon: <LeetCodeIcon />, label: "LeetCode" },
};

const DIFFICULTY_STYLES = {
  Easy: "text-green-400",
  Medium: "text-yellow-400",
  Hard: "text-red-400",
};

export default function QuestionRow({
  title,
  link,
  platform = "gfg",       
  difficulty = "Easy",   
  completed: initCompleted = false,
  bookmarked: initBookmarked = false,
}) {
  const [completed, setCompleted] = useState(initCompleted);
  const [bookmarked, setBookmarked] = useState(initBookmarked);

  const handleRowClick = () => {
    if (link) window.open(link, "_blank", "noopener,noreferrer");
  };

  const stop = (fn) => (e) => {
    e.stopPropagation();
    fn();
  };

  const platformInfo = PLATFORM_ICONS[platform] ?? PLATFORM_ICONS.gfg;
  const diffClass = DIFFICULTY_STYLES[difficulty] ?? "text-green-400";

  return (
    <div
      onClick={handleRowClick}
      className="group flex items-center gap-4 bg-[#111111] border border-gray-800 hover:border-orange-500/60 rounded-xl px-4 py-3 cursor-pointer transition-all duration-200 hover:bg-[#161616]"
    >
      
      <button
        onClick={stop(() => setCompleted((v) => !v))}
        className="shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200"
        style={{
          borderColor: completed ? "#22c55e" : "#4b5563",
          backgroundColor: completed ? "#22c55e22" : "transparent",
        }}
        title={completed ? "Mark incomplete" : "Mark complete"}
      >
        {completed && (
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 5l2.5 2.5L8 3" stroke="#22c55e" strokeWidth="1.8"
              strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

     
      <span
        className={`flex-1 text-sm font-medium transition-colors duration-200 ${
          completed ? "text-gray-500 line-through" : "text-white"
        }`}
      >
        {title}
      </span>

   
      <div className="shrink-0 flex items-center justify-center w-8" title={platformInfo.label}>
        {platformInfo.icon}
      </div>


      <span className={`shrink-0 text-sm font-medium w-16 text-center ${diffClass}`}>
        {difficulty}
      </span>

      
      <button
        onClick={stop(() => setBookmarked((v) => !v))}
        className="shrink-0 transition-colors duration-200"
        title={bookmarked ? "Remove bookmark" : "Bookmark"}
      >
        <Star
          size={18}
          className={bookmarked ? "text-yellow-400 fill-yellow-400" : "text-gray-500 hover:text-yellow-400"}
        />
      </button>

      
      <button
        onClick={stop(() => {})}
        className="shrink-0 text-gray-500 hover:text-gray-300 transition-colors duration-200"
        title="Add note"
      >
        <FileText size={18} />
      </button>
    </div>
  );
}
