import React, { useRef } from "react";
import { ChevronLeft, ChevronRight, Lock, List, Unlock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { companies } from "../../config/companyConfig";

export function CompanySheets({ show, className }) {
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 324;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div id={className} className="pt-16 text-center space-y-12 relative">
      <h2
        className={`text-4xl font-extrabold text-white uppercase tracking-tight ${show === false ? "hidden" : ""}`}
      >
        Explore Company-Wise Sheets
      </h2>

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
          {companies.map((company, idx) => (
            <div
              key={company.slug}
              onClick={() => navigate(`/company/${company.slug}`)}
              className="min-w-[300px] flex-1 bg-[#0f0f0f] border border-gray-800 rounded-xl shadow-sm text-left flex flex-col snap-start hover:border-orange-500/50 hover:bg-white/[0.02] transition-all cursor-pointer group"
            >
              <div
                className={`h-2 w-full ${company.accent} rounded-t-xl opacity-80 group-hover:opacity-100 transition-opacity`}
              ></div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-white">
                    {company.name}
                  </h3>
                  <div className="w-8 h-8 rounded-lg bg-white/5 p-1.5 flex items-center justify-center">
                    <img
                      src={company.logo}
                      alt={company.name}
                      className="w-full h-auto"
                    />
                  </div>
                </div>
                <p className="text-gray-400 text-sm flex-1 leading-relaxed">
                  {company.description}
                </p>

                <div className="mt-6 pt-4 border-t border-gray-800 flex items-center justify-between">
                  <div className="flex items-center gap-4 text-gray-500">
                    <List className="w-4 h-4" />
                    <span className="text-xs font-medium">100+ Questions</span>
                  </div>
                  <Unlock className="w-4 h-4 text-orange-500/50" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
