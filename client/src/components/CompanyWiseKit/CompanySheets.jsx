import React, { useRef, useEffect, useState, useContext } from "react";
import { ChevronLeft, ChevronRight, List, Lock, Unlock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAllCompanies } from "../../api/company.api.js";
import { UserContext } from "../../context/UserContext.jsx";

const ACCENTS = [
  "bg-blue-500",
  "bg-orange-500",
  "bg-blue-600",
  "bg-gray-600",
  "bg-gray-900",
  "bg-red-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-yellow-500",
  "bg-pink-500",
];

// Shown to guests userss
const GUEST_CARDS = [
  { _id: "g0", name: "Google", totalQuestions: 172 },
  { _id: "g1", name: "Amazon", totalQuestions: 145 },
  { _id: "g2", name: "Meta", totalQuestions: 100 },
  { _id: "g3", name: "Microsoft", totalQuestions: 47 },
  { _id: "g4", name: "Apple", totalQuestions: 258 },
  { _id: "g5", name: "Adobe", totalQuestions: 148 },
  { _id: "g6", name: "Netflix", totalQuestions: 29 },
  { _id: "g7", name: "Nvidia", totalQuestions: 136 },
];

export function CompanySheets({ show, className }) {
  const navigate = useNavigate();
  const { user, isAuthLoading } = useContext(UserContext);
  const isLoggedIn = !!user?.email;

  const scrollRef = useRef(null);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthLoading) return;

    if (!isLoggedIn) {
      setLoading(false);
      return;
    }

    getAllCompanies()
      .then((res) => setCompanies(res.data?.companies ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [isLoggedIn, isAuthLoading]);

  const handleCardClick = (company) => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    navigate(`/workspace/company-kit/${company.slug}`);
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -324 : 324,
        behavior: "smooth",
      });
    }
  };

  const displayCards = isLoggedIn ? companies : GUEST_CARDS;
  const showSkeleton = loading || isAuthLoading;

  return (
    <div id={className} className="pt-16 text-center space-y-12 relative">
      <h2
        className={`text-4xl font-extrabold text-white uppercase tracking-tight ${
          show === false ? "hidden" : ""
        }`}
      >
        Explore Company-Wise Sheets
      </h2>

      {/* Guest banner */}
      {!isAuthLoading && !isLoggedIn && (
        <div className="max-w-xl mx-auto flex items-center justify-center gap-3 bg-orange-500/10 border border-orange-500/30 rounded-xl px-5 py-3 text-sm text-orange-300">
          <Lock className="w-4 h-4 shrink-0" />
          <span>
            <span className="font-semibold">Login required</span> to access
            company sheets.{" "}
            <button
              onClick={() => navigate("/login")}
              className="underline underline-offset-2 hover:text-orange-200 transition-colors font-medium"
            >
              Sign in →
            </button>
          </span>
        </div>
      )}

      <div className="relative max-w-6xl mx-auto px-4">
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-10 p-3 bg-[#1f1f1f] border border-gray-700 rounded-full shadow-lg text-gray-400 hover:text-white hover:scale-110 transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-10 p-3 bg-[#1f1f1f] border border-gray-700 rounded-full shadow-lg text-gray-400 hover:text-white hover:scale-110 transition-all"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-8 snap-x hide-scrollbar"
          style={{ scrollbarWidth: "none" }}
        >
          {showSkeleton
            ? Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="min-w-[300px] flex-1 bg-[#0f0f0f] border border-gray-800 rounded-xl animate-pulse h-52"
                />
              ))
            : displayCards.map((company, idx) => {
                const locked = !isLoggedIn;
                return (
                  <div
                    key={company._id}
                    onClick={() => handleCardClick(company)}
                    className={`min-w-[300px] flex-1 bg-[#0f0f0f] border border-gray-800 rounded-xl shadow-sm text-left flex flex-col snap-start transition-all cursor-pointer group relative overflow-hidden
                      ${
                        locked
                          ? "hover:border-orange-500/40"
                          : "hover:border-orange-500/50 hover:bg-white/[0.02]"
                      }`}
                  >
                    <div
                      className={`h-2 w-full ${ACCENTS[idx % ACCENTS.length]} rounded-t-xl opacity-80 group-hover:opacity-100 transition-opacity`}
                    />

                    {/* Lock overlay */}
                    {locked && (
                      <div className="absolute inset-0 top-2 bg-black/50 backdrop-blur-[2px] flex flex-col items-center justify-center gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-b-xl">
                        <Lock className="w-6 h-6 text-orange-400" />
                        <span className="text-xs font-semibold text-orange-300 tracking-wide">
                          Login to access
                        </span>
                      </div>
                    )}

                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-2xl font-bold text-white">
                          {company.name}
                        </h3>
                        <div className="w-8 h-8 rounded-lg bg-white/5 p-1.5 flex items-center justify-center">
                          {locked ? (
                            <Lock className="w-4 h-4 text-gray-600" />
                          ) : company.logo ? (
                            <img
                              src={company.logo}
                              alt={company.name}
                              className="w-full h-auto"
                            />
                          ) : (
                            <Unlock className="w-4 h-4 text-orange-500/50" />
                          )}
                        </div>
                      </div>

                      <p className="text-gray-400 text-sm flex-1 leading-relaxed">
                        {company.description ||
                          `Practice top ${company.name} interview questions.`}
                      </p>

                      <div className="mt-6 pt-4 border-t border-gray-800 flex items-center justify-between">
                        <div className="flex items-center gap-4 text-gray-500">
                          <List className="w-4 h-4" />
                          <span className="text-xs font-medium">
                            {company.totalQuestions}+ Questions
                          </span>
                          {!locked && company.solvedCount > 0 && (
                            <span className="text-xs font-medium text-green-400">
                              {company.percentSolved}% done
                            </span>
                          )}
                        </div>
                        {locked ? (
                          <Lock className="w-4 h-4 text-gray-700" />
                        ) : (
                          <Unlock className="w-4 h-4 text-orange-500/50" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
        </div>
      </div>
    </div>
  );
}
