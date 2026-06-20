import React from "react";
import sheetsImg from "../../../Assets/Sheets.png";

export function Hero() {
  return (
    <div className="flex flex-col items-center text-center space-y-12">
      <div className="flex flex-col items-center space-y-6 max-w-4xl mx-auto">
        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-orange-50 border border-orange-100 text-orange-600 text-sm font-semibold shadow-sm">
          100K+ Engineers Trust Kompile
        </div>

        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-white">
          10x your <span className="text-orange-500">selection</span> chances{" "}
          <br />
          Kom<span className="text-orange-500">pile</span> Company wise Kit
        </h1>

        <p className="text-xl text-gray-400 max-w-2xl">
          Unlock recently asked interview questions at top product companies.
          Practice what actually matters and land your dream job
        </p>

        <div className="flex items-center gap-4 pt-4">
          <button
            onClick={() => document.getElementById("explore")?.scrollIntoView({ behavior: "smooth" })}
            className="px-8 py-3 rounded-md border border-gray-600 bg-[#0f0f0f] text-gray-300 font-bold hover:bg-[#2a2a2a] transition-colors shadow-sm"
          >
            Explore Companies
          </button>
        </div>
      </div>

      <div className="w-full pt-16 grid lg:grid-cols-12 gap-12 lg:gap-8 items-center text-left">
        <div className="lg:col-span-5 space-y-8">
          <div>
            <h2 className="text-4xl font-extrabold text-white">
              Crack Top Companies
            </h2>
            <p className="text-lg text-gray-400 mt-2">
              15+ Company-Specific Prep Sheets
            </p>
          </div>

          <div className="space-y-6">
            <div className="border-l-4 border-orange-500 pl-6 space-y-2 py-1">
              <h3 className="text-xl font-bold text-white">
                No Outdated Content
              </h3>
              <p className="text-gray-400 text-base leading-relaxed">
                Our team constantly aggregates and verifies questions from
                trusted platforms and Kompile user suggestions.
              </p>
            </div>
            <div className="border-l-4 border-gray-700 pl-6 py-1 opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
              <h3 className="text-xl font-bold text-gray-400">
                Filter by Recency
              </h3>
            </div>
            <div className="border-l-4 border-gray-700 pl-6 py-1 opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
              <h3 className="text-xl font-bold text-gray-400">
                Prioritize by Frequency
              </h3>
            </div>
          </div>
        </div>

        <img
          src={sheetsImg}
          alt="Dashboard Preview"
          className="lg:col-span-7 w-full h-auto rounded-xl shadow-2xl border border-gray-800 transform lg:scale-105 origin-left"
        />
      </div>
    </div>
  );
}
