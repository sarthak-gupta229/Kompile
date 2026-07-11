import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import GridComponent from "../../components/GridComponent";
import { cn } from "../../lib/utils";
import { companies } from "../../config/companyConfig";

import { DashboardNavbar } from "../../components/CompanyWiseKit/DashboardNavbar";
import { CompanyHero } from "../../components/CompanyWiseKit/CompanyHero";
import { AnalyticsSection } from "../../components/CompanyWiseKit/AnalyticsSection";
import { QuestionsTable } from "../../components/CompanyWiseKit/QuestionsTable";
import { PremiumLocked } from "../../components/CompanyWiseKit/PremiumLocked";
import { Footer } from "../../components/CompanyWiseKit/Footer";

export default function CompanyDashboard() {
  const { companySlug } = useParams();
  const navigate = useNavigate();
  const [companyData, setCompanyData] = useState([]);
  const [loading, setLoading] = useState(true);

  const company = companies.find((c) => c.slug === companySlug);

  const normalizeData = (rawData) => {
    if (!Array.isArray(rawData)) return [];
    return rawData.map((item) => ({
      id: item.id || item.ID,
      title: item.title || item.Title,
      url: item.url || item.URL,
      difficulty: item.difficulty || item.Difficulty,
      frequency:
        item.frequency || item["Frequency %"] || item.frequency_percent || "0%",
    }));
  };

  useEffect(() => {
    if (!company) {
      navigate("/company");
      return;
    }

    setLoading(true);

    import(`../../Company_wise_Kit/${companySlug}.json`)
      .then((module) => {
        const normalized = normalizeData(module.default);
        setCompanyData(normalized);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load company data:", err);
        setLoading(false);
      });
  }, [companySlug, company, navigate]);

  if (!company) return null;

  return (
    <div className="dark bg-black min-h-screen">
      <Navbar />

      <GridComponent>
        <div className="flex flex-col min-h-screen pt-34 pb-12">
          <main className="flex-1 w-full max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 space-y-12">
            <CompanyHero company={company} />

            {/* <AnalyticsSection data={companyData} companyName={company.name} /> */}

            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-1">
                  <h2 className="text-3xl font-black text-white tracking-tight">
                    Questions
                  </h2>
                  <p className="text-gray-500 font-medium">
                    Practice most frequent {company.name} questions
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs font-bold">
                  <span className="text-orange-500 bg-orange-500/10 px-3 py-1.5 rounded-full border border-orange-500/20">
                    UPDATED WEEKLY
                  </span>
                  <span className="text-gray-400 bg-white/5 px-3 py-1.5 rounded-full border border-gray-800">
                    {loading ? "..." : `${companyData.length}+ TOTAL`}
                  </span>
                </div>
              </div>

              {!loading && <QuestionsTable data={companyData} />}
              {loading && (
                <div className="h-64 flex items-center justify-center bg-[#0f0f0f] border border-gray-800 rounded-3xl">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
                </div>
              )}
            </div>
          </main>

          <div className="mt-20">
            <Footer />
          </div>
        </div>
      </GridComponent>
    </div>
  );
}
