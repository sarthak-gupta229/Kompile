import React from "react";
import { CompanySheets } from "../../components/CompanyWiseKit/CompanySheets";
import ShinyText from "../../components/ShinyText";

export default function WorkspaceCompanyKit() {
  return (
    <div className="w-full space-y-2">
      <div className="flex justify-center pt-4">
        <div className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#161616] border border-white/10 backdrop-blur-md shadow-xl hover:border-orange-500/30 transition-colors">
          <ShinyText
            text="✨ +25 Company Sheets!"
            speed={2}
            delay={0}
            color="#a3a3a3"
            shineColor="#ffffff"
            spread={120}
            direction="left"
            yoyo={false}
            pauseOnHover={false}
            disabled={false}
            className="text-lg sm:text-xl md:text-2xl font-bold tracking-wide"
          />
        </div>
      </div>

      <CompanySheets show={true} />
    </div>
  );
}
