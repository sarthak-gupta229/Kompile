import React, { useEffect, useState } from "react";
import { ArrowUpRight, Info, FileCode2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAllSheetsStats } from "../../api/sheets.api";
import { getAllCompanies } from "../../api/company.api";

export default function MyWorkspace() {
  const navigate = useNavigate();
  const [sheets, setSheets] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  const bookmarkedCount = 0;

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const [sheetsRes, companiesRes] = await Promise.allSettled([
          getAllSheetsStats(),
          getAllCompanies(),
        ]);

        if (sheetsRes.status === "fulfilled") {
          const rawSheets = sheetsRes.value?.data || sheetsRes.value || [];
          setSheets(Array.isArray(rawSheets) ? rawSheets : []);
        }

        if (companiesRes.status === "fulfilled") {
          const rawCompanies =
            companiesRes.value?.data?.companies ||
            companiesRes.value?.companies ||
            companiesRes.value?.data ||
            [];
          setCompanies(Array.isArray(rawCompanies) ? rawCompanies : []);
        }
      } catch (err) {
        console.error("Error fetching workspace stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Calculate total questions solved across DSA sheets + company sheets
  const dsaSolved = sheets.reduce(
    (acc, sheet) => acc + (Number(sheet.solvedCount) || 0),
    0,
  );
  const companySolved = companies.reduce(
    (acc, company) => acc + (Number(company.solvedCount) || 0),
    0,
  );
  const totalSolved = dsaSolved + companySolved;

  // Combine items for the list
  // 1. All DSA Sheets
  const dsaItems = sheets.map((s) => ({
    id: `sheet-${s._id || s.slug}`,
    name: s.name || s.heading,
    solvedCount: s.solvedCount ?? 0,
    totalQuestions: s.totalQuestions ?? 0,
    route: `/workspace/sheets/${s.slug}`,
    type: "dsa",
  }));

  // 2. Company Sheets: show top companies (prioritize active/solved, then default popular ones)
  const sortedCompanies = [...companies].sort((a, b) => {
    if ((b.solvedCount || 0) !== (a.solvedCount || 0)) {
      return (b.solvedCount || 0) - (a.solvedCount || 0);
    }
    return (b.totalQuestions || 0) - (a.totalQuestions || 0);
  });

  const companyItems = sortedCompanies.slice(0, 4).map((c) => ({
    id: `company-${c._id || c.slug}`,
    name: c.name,
    solvedCount: c.solvedCount ?? 0,
    totalQuestions: c.totalQuestions ?? 0,
    route: `/workspace/company-kit/${c.slug}`,
    type: "company",
  }));

  const allItems = [...dsaItems, ...companyItems];

  return (
    <div className="bg-[#0e0e0e] border border-white/[0.08] rounded-2xl p-6 shadow-2xl relative overflow-hidden">
      {/* Header */}
      <div
        onClick={() => navigate("/workspace/sheets")}
        className="flex items-center gap-1.5 text-sm font-semibold text-gray-300 hover:text-white cursor-pointer transition-colors w-fit mb-5 group"
      >
        <span>My Workspace</span>
        <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {/* Questions Solved */}
        <div className="bg-[#141414] border border-white/[0.06] rounded-xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between text-[#c4b5a0] text-xs font-mono tracking-wider">
            <span>Questions Solved</span>
            <Info className="w-3.5 h-3.5 text-gray-500 cursor-pointer hover:text-gray-300 transition-colors" />
          </div>
          <div className="mt-3">
            {loading ? (
              <div className="h-9 w-16 bg-white/10 rounded animate-pulse" />
            ) : (
              <span className="text-4xl font-bold font-mono text-white tracking-tight">
                {totalSolved}
              </span>
            )}
          </div>
        </div>

        {/* Bookmarked Questions */}
        <div className="bg-[#141414] border border-white/[0.06] rounded-xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between text-[#c4b5a0] text-xs font-mono tracking-wider">
            <span>Bookmarked Questions</span>
            <Info className="w-3.5 h-3.5 text-gray-500 cursor-pointer hover:text-gray-300 transition-colors" />
          </div>
          <div className="mt-3">
            {loading ? (
              <div className="h-9 w-16 bg-white/10 rounded animate-pulse" />
            ) : (
              <span className="text-4xl font-bold font-mono text-white tracking-tight">
                {bookmarkedCount}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Sheets & Company List */}
      <div className="space-y-1">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-2.5 px-3 rounded-lg animate-pulse"
            >
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-white/10 rounded" />
                <div className="h-4 w-40 bg-white/10 rounded" />
              </div>
              <div className="h-4 w-12 bg-white/10 rounded" />
            </div>
          ))
        ) : allItems.length === 0 ? (
          <div className="text-center py-6 text-gray-500 text-sm">
            No sheets found
          </div>
        ) : (
          allItems.map((item) => (
            <div
              key={item.id}
              onClick={() => item.route && navigate(item.route)}
              className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-white/[0.04] transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <FileCode2 className="w-4 h-4 text-gray-400 group-hover:text-orange-400 shrink-0 transition-colors" />
                <span className="text-sm font-medium text-gray-300 group-hover:text-white truncate transition-colors">
                  {item.name}
                </span>
              </div>
              <span className="text-sm font-bold font-mono text-white shrink-0 ml-4">
                {item.solvedCount}/{item.totalQuestions}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
