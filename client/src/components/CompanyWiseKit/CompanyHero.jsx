import React from "react";
import { ExternalLink, Users, Briefcase, Star, Clock } from "lucide-react";

export function CompanyHero({ company }) {
  if (!company) return null;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-gray-800 p-4 md:p-6">
      <div
        className={`absolute top-0 right-0 w-96 h-96 ${company.accent}/5 blur-[100px] rounded-full -mr-48 -mt-48`}
      ></div>

      <div className="relative z-10 flex flex-col md:flex-row items-center gap-5">
        <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white flex items-center justify-center p-3 shadow-2xl shadow-orange-500/10 shrink-0">
          <img
            src={company.logo}
            alt={`${company.name} Logo`}
            className="w-full h-auto"
          />
        </div>

        <div className="flex-1 text-center md:text-left space-y-2">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              {company.name}{" "}
              <span className="text-orange-500">Interview Kit</span>
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-500 text-xs font-bold border border-orange-500/30">
              PREMIUM
            </span>
          </div>

          <p className="text-gray-400 text-sm max-w-2xl leading-relaxed">
            {company.description ||
              `Get interview-ready for ${company.name} with this dedicated sheet of DSA problems.`}
          </p>
        </div>
      </div>
    </div>
  );
}
