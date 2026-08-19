import { CircleCheck, ListChecks } from "lucide-react";
import { useNavigate } from "react-router-dom";

function MysheetsCard({ sheet }) {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => sheet.slug && navigate(`/workspace/sheets/${sheet.slug}`)}
      className={`relative bg-[#111111] border border-gray-800  hover:border-t-orange-500 rounded-xl p-2 cursor-pointer group transition-all duration-300 shadow-lg hover:shadow-xl overflow-hidden w-120 `}
    >
      <div className="relative h-8 bg-[#2b2b2f] flex">
        <div
          className="absolute left-0 top-0 h-full bg-[#ff9d3c]"
          style={{ width: `${sheet.percentSolved}%` }}
        ></div>

        <span className="absolute right-4 top-2 font-bold text-white">
          {sheet.percentSolved}%
        </span>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start">
          <h2 className="text-2xl font-bold text-white leading-tight">
            {sheet.name}
          </h2>
        </div>

        <p className="mt-6  text-gray-400 line-clamp-2 leading-relaxed">
          {sheet.description}
        </p>

        <hr className="my-4 border-[#3a3a3f]" />

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3 text-gray-400">
            <ListChecks size={22} />
            <span>{sheet.totalQuestions} Questions</span>
          </div>

          <div className="flex items-center gap-2 text-green-400 font-semibold">
            <CircleCheck size={24} />
            <span>{sheet.solvedCount} Solved</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MysheetsCard;
