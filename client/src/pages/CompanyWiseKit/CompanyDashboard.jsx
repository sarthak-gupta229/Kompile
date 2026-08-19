import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CompanyHero } from "../../components/CompanyWiseKit/CompanyHero";
import { QuestionsTable } from "../../components/CompanyWiseKit/QuestionsTable";
import {
  getAllCompanies,
  getCompanyQuestions,
  toggleCompanyQuestion,
} from "../../api/company.api.js";
import toast from "react-hot-toast";

export default function CompanyDashboard() {
  const { companySlug } = useParams();
  const navigate = useNavigate();

  const [company, setCompany] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);

  // filters
  const [difficulty, setDifficulty] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("frequency");
  const [page, setPage] = useState(1);

  // Resolve companyId from slug
  const [companyId, setCompanyId] = useState(null);

  // Step 1 — resolve company by slug from the /companies list
  useEffect(() => {
    getAllCompanies()
      .then((res) => {
        const list = res.data?.companies ?? [];
        const found = list.find(
          (c) => c.slug === companySlug || c.name?.toLowerCase() === companySlug?.toLowerCase(),
        );
        if (!found) {
          toast.error("Company not found");
          navigate("/workspace/company-kit");
          return;
        }
        setCompany(found);
        setCompanyId(found._id);
      })
      .catch(() => {
        toast.error("Failed to load companies");
        navigate("/workspace/company-kit");
      });
  }, [companySlug, navigate]);

  // Step 2 — fetch paginated questions whenever companyId or filters change
  const fetchQuestions = useCallback(async () => {
    if (!companyId) return;
    setLoading(true);
    try {
      const res = await getCompanyQuestions(companyId, {
        difficulty: difficulty || undefined,
        search: search || undefined,
        sortBy,
        page,
        limit: 50,
      });
      const payload = res.data ?? {};
      setCompany(payload.company); // updated solvedCount / percentSolved
      setQuestions(payload.questions ?? []);
      setPagination(payload.pagination ?? null);
    } catch {
      toast.error("Failed to load questions");
    } finally {
      setLoading(false);
    }
  }, [companyId, difficulty, search, sortBy, page]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const handleToggle = async (questionId) => {
    try {
      const res = await toggleCompanyQuestion(companyId, questionId);
      const completed = res.data?.completed;
      // optimistically update question list
      setQuestions((prev) =>
        prev.map((q) =>
          q._id === questionId ? { ...q, completed } : q,
        ),
      );
      // update company solved count
      setCompany((prev) => {
        if (!prev) return prev;
        const delta = completed ? 1 : -1;
        const newSolved = (prev.solvedCount ?? 0) + delta;
        return {
          ...prev,
          solvedCount: newSolved,
          percentSolved: prev.totalQuestions
            ? Math.round((newSolved / prev.totalQuestions) * 100)
            : 0,
        };
      });
    } catch {
      toast.error("Failed to update progress");
    }
  };

  return (
    <div className="space-y-8 w-full max-w-[1400px]">
      {company && <CompanyHero company={company} />}

      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-white tracking-tight">
              Questions
            </h2>
            <p className="text-gray-500 font-medium">
              Practice most frequent {company?.name ?? ""} questions
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-bold">
            <span className="text-orange-500 bg-orange-500/10 px-3 py-1.5 rounded-full border border-orange-500/20">
              UPDATED WEEKLY
            </span>
            <span className="text-gray-400 bg-white/5 px-3 py-1.5 rounded-full border border-gray-800">
              {loading ? "…" : `${company?.totalQuestions ?? questions.length}+ TOTAL`}
            </span>
            {company && (
              <span className="text-green-400 bg-green-500/10 px-3 py-1.5 rounded-full border border-green-500/20">
                {company.solvedCount ?? 0} / {company.totalQuestions ?? 0} SOLVED
              </span>
            )}
          </div>
        </div>

        {!loading && (
          <QuestionsTable
            data={questions}
            onToggle={handleToggle}
            difficulty={difficulty}
            onDifficultyChange={setDifficulty}
            search={search}
            onSearchChange={setSearch}
            sortBy={sortBy}
            onSortChange={setSortBy}
            pagination={pagination}
            onPageChange={setPage}
          />
        )}
        {loading && (
          <div className="h-64 flex items-center justify-center bg-[#0f0f0f] border border-gray-800 rounded-3xl">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        )}
      </div>
    </div>
  );
}
