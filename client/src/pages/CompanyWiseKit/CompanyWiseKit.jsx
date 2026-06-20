import React from "react";
import Navbar from "../../components/Navbar";
import GridComponent from "../../components/GridComponent";

// Import the original landing page components
import { Hero } from "../../components/CompanyWiseKit/Hero";
import { FeatureTable } from "../../components/CompanyWiseKit/FeatureTable";
import { CompanyLogos } from "../../components/CompanyWiseKit/CompanyLogos";
import { CompanySheets } from "../../components/CompanyWiseKit/CompanySheets";
import { Pricing } from "../../components/CompanyWiseKit/Pricing";
import { FAQ } from "../../components/CompanyWiseKit/FAQ";
import { Footer } from "../../components/CompanyWiseKit/Footer";

export default function CompanyWiseKit() {
  return (
    <div className="dark bg-black min-h-screen">
      <Navbar />
      <GridComponent>
        <div className="flex flex-col min-h-screen pt-20">
          <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-32">
            <CompanySheets show={false} />
            <Hero />
            <FeatureTable />
            <CompanyLogos />
            <CompanySheets show={true} className="explore"/>
           
            <FAQ />
          </main>
          <Footer />
        </div>
      </GridComponent>
    </div>
  );
}
