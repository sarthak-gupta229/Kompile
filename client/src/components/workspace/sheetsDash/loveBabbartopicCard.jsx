import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LoveBabbarTopicCard({
  topic,
  totalQuestions,
  route,
  completedQuestions,
  questions,
}) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (route)
      navigate(`/workspace/sheets/love-babbar-450/${route}`, {
        state: { questions },
      });
  };

  return (
    <div
      onClick={handleClick}
      className="relative bg-[#111111] border border-gray-800 hover:border-orange-500 rounded-xl px-5 py-4 cursor-pointer transition-all duration-300 shadow-lg hover:shadow-xl w-full flex justify-between items-center"
    >
      <div className="flex flex-row gap-3">
        <h2 className="text-xl font-bold text-white">{topic}</h2>
        <p className="text-gray-400 text-sm mt-1">
          Total Questions: {totalQuestions}
        </p>
      </div>

      <div className="flex flex-row gap-3 items-center">
        <p className="text-gray-400 text-sm mt-1">
          {completedQuestions}/{totalQuestions}
        </p>
        <ChevronRight className="text-gray-400 shrink-0" size={20} />
      </div>
    </div>
  );
}
//ending
