import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import KompileCard from "../../components/Profile/subprofiles/KompileCard.jsx";

export default function DashboardPage({ userStats }) {
  const cardRef = useRef(null);

  const handlePrint = useReactToPrint({
    contentRef: cardRef,
    documentTitle: `${userStats?.username || "user"}-kompile-profile`,
    pageStyle: `
      @page {
        size: A4;
        margin: 0;
      }
      @media print {
        html, body {
          width: 100% !important;
          height: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
          background-color: #060807 !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        .no-print {
          display: none !important;
        }
        .print-fullpage {
          width: 100vw !important;
          height: 100vh !important;
          min-height: 100vh !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          background-color: #060807 !important;
          box-sizing: border-box !important;
          overflow: hidden !important;
        }
        .print-fullpage > * {
          transform: scale(1.45) !important;
          transform-origin: center center !important;
        }
      }
    `,
  });

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-[#0a0a0a] text-white">
      <button
        className="no-print mb-4 px-5 py-2.5 bg-[#00e575] hover:bg-[#00c766] text-black font-semibold text-sm rounded-xl shadow-lg hover:shadow-[#00e575]/20 transition-all cursor-pointer flex items-center gap-2"
        onClick={handlePrint}
      >
        Download PDF
      </button>

      <div
        ref={cardRef}
        className="print-fullpage flex justify-center items-center w-full"
      >
        <KompileCard stats={userStats} />
      </div>
    </div>
  );
}
