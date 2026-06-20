import React from "react";
import { CheckCircle2, XCircle, AlertTriangle, Rocket } from "lucide-react";

export function FeatureTable() {
  const features = [
    {
      name: "Primary Use Case",
      standard: { text: "General concept practice", type: "text" },
      premium: { text: "Company-focused prep", type: "text" },
      codolio: { text: "Company-specific interview readiness", type: "text" },
    },
    {
      name: "Company Targeting",
      standard: { text: "Not available", type: "cross" },
      premium: { text: "Available", type: "check" },
      codolio: { text: "Available", type: "check" },
    },
    {
      name: "Recent Question Visibility",
      standard: { text: "Static list", type: "cross" },
      premium: { text: "Limited", type: "warn" },
      codolio: { text: "Strong focus on recency", type: "check" },
    },
    {
      name: "Time-Based Filters",
      standard: { text: "None", type: "cross" },
      premium: { text: "Last 30 days / 6 months / 1 year", type: "check" },
      codolio: {
        text: "Last 45 days, 6 months & all-time favorites",
        type: "check",
      },
    },
    {
      name: "Question Frequency Signal",
      standard: { text: "Not available", type: "cross" },
      premium: { text: "Raw frequency numbers", type: "warn" },
      codolio: {
        text: "Very Hot / Hot / Warm / Cold (Popularity)",
        type: "fire",
      },
    },
    {
      name: "Question Source",
      standard: { text: 'Generic "Top DSA" problems', type: "text" },
      premium: { text: "Industry interview reports", type: "text" },
      codolio: {
        text: "Industry-standard interview patterns & experiences",
        type: "text",
      },
    },
    {
      name: "Update Frequency",
      standard: { text: "No updates", type: "cross" },
      premium: { text: "Irregular", type: "warn" },
      codolio: { text: "Weekly synced updates", type: "check" },
    },
    {
      name: "Effort Required by Candidate",
      standard: { text: "High (manual filtering)", type: "cross" },
      premium: { text: "Medium", type: "warn" },
      codolio: { text: "Minimal — already curated", type: "check" },
    },
    // {
    //   name: 'Pricing Model',
    //   standard: { text: 'Free (time cost is high)', type: 'text' },
    //   premium: { text: '₹13,500+ / year (recurring)', type: 'text' },
    //   codolio: { text: '₹1,499 lifetime (one-time)', type: 'text' },
    // },
    {
      name: "Value for Money",
      standard: { text: "Low", type: "cross" },
      premium: { text: "Moderate", type: "warn" },
      codolio: { text: "Best value", type: "check" },
    },
  ];

  const renderIcon = (type) => {
    switch (type) {
      case "check":
        return <CheckCircle2 className="text-green-500 w-5 h-5 shrink-0" />;
      case "cross":
        return <XCircle className="text-red-500 w-5 h-5 shrink-0" />;
      case "warn":
        return <AlertTriangle className="text-amber-500 w-5 h-5 shrink-0" />;
      case "fire":
        return (
          <span className="text-orange-500 text-lg leading-none shrink-0">
            🔥
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="pt-16 space-y-12">
      <div className="text-center space-y-2">
        <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
          Kompile - <span className="text-orange-500">Your Best Choice</span>{" "}
          for <br />
          Company-Specific Preparation
        </h2>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[900px] bg-[#0f0f0f] rounded-2xl shadow-sm border border-gray-800 overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-4 border-b border-gray-800 bg-[#1a1a1a]">
            <div className="p-6 font-bold text-white flex items-center">
              Feature
            </div>
            <div className="p-6 font-bold text-gray-300 flex items-center">
              Standard Free DSA Sheets
            </div>
            <div className="p-6 font-bold text-gray-300 flex items-center">
              Premium Interview Subscriptions
            </div>
            <div className="p-6 font-bold text-orange-500 bg-orange-500/10 flex items-center gap-2">
              <Rocket className="w-5 h-5" /> Kompile Company-Wise Kit
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-800">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="grid grid-cols-4 hover:bg-[#1a1a1a] transition-colors"
              >
                <div className="p-6 font-semibold text-white text-sm flex items-center">
                  {feature.name}
                </div>
                <div className="p-6 text-gray-400 text-sm flex items-center gap-3">
                  {renderIcon(feature.standard.type)}
                  <span>{feature.standard.text}</span>
                </div>
                <div className="p-6 text-gray-400 text-sm flex items-center gap-3">
                  {renderIcon(feature.premium.type)}
                  <span>{feature.premium.text}</span>
                </div>
                <div className="p-6 text-white font-medium text-sm flex items-center gap-3 bg-orange-500/10">
                  {renderIcon(feature.codolio.type)}
                  <span>{feature.codolio.text}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
