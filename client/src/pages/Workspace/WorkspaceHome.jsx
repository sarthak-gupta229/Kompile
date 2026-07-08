import React from "react";
import { FolderOpen, Users, Building2, Bookmark } from "lucide-react";
import { useNavigate } from "react-router-dom";

const cards = [
  {
    title: "My Sheets",
    desc: "Organise and track your custom DSA sheets. Monitor progress, flag hard problems, and revisit weak topics at a glance.",
    icon: FolderOpen,
    iconColor: "text-orange-500",
    iconBg: "bg-orange-500/10",
    accent: "border-orange-500/40",
    glow: "group-hover:shadow-orange-500/10",
    to: "/workspace/sheets",
  },
  {
    title: "Community",
    desc: "Discover and follow curated sheets from top contributors. Learn from the community and share your own approach.",
    icon: Users,
    iconColor: "text-blue-400",
    iconBg: "bg-blue-500/10",
    accent: "border-blue-500/40",
    glow: "group-hover:shadow-blue-500/10",
    to: "/workspace/community",
  },
  {
    title: "Company-Wise Kit",
    desc: "Targeted question sets tailored for top tech companies. Crack interviews with focused, high-signal practice.",
    icon: Building2,
    iconColor: "text-purple-400",
    iconBg: "bg-purple-500/10",
    accent: "border-purple-500/40",
    glow: "group-hover:shadow-purple-500/10",
    to: "/workspace/company-kit",
  },
  {
    title: "Bookmarks",
    desc: "Save problems, articles, and resources you want to revisit. Keep everything important in one searchable place.",
    icon: Bookmark,
    iconColor: "text-pink-400",
    iconBg: "bg-pink-500/10",
    accent: "border-pink-500/40",
    glow: "group-hover:shadow-pink-500/10",
    to: "/workspace/bookmarks",
  },
];

export default function WorkspaceHome() {
  const navigate = useNavigate();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          My <span className="text-orange-500">Workspace</span>
        </h1>
        <p className="text-gray-400 mt-1 text-sm">
          Your personal hub for sheets, community, and coding tools.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {cards.map(
          ({
            title,
            desc,
            icon: Icon,
            iconColor,
            iconBg,
            accent,
            glow,
            to,
          }) => (
            <div
              key={title}
              onClick={() => navigate(to)}
              className={`relative bg-[#111111] border border-gray-800 hover:border-gray-700 rounded-xl p-5 cursor-pointer group transition-all duration-300 shadow-lg ${glow} hover:shadow-xl overflow-hidden`}
            >
              <div
                className={`absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl border-t-2 ${accent} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              />

              <div
                className={`w-10 h-10 rounded-lg mb-4 flex items-center justify-center ${iconBg}`}
              >
                <Icon className={`w-5 h-5 ${iconColor}`} />
              </div>

              <h3 className="text-white font-semibold text-sm mb-1.5 group-hover:text-orange-400 transition-colors duration-200">
                {title}
              </h3>
              <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>

              <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-gray-600 group-hover:text-gray-300 transition-colors duration-200">
                <span>Open</span>
                <svg
                  className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M5 12h14M12 5l7 7-7 7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          ),
        )}
      </div>
    </div>
  );
}
