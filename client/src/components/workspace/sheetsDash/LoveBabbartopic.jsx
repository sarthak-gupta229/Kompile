import React from "react";
import { useParams, useLocation } from "react-router-dom";
import QuestionRow from "./QuestionRow";

function slugToTitle(slug = "") {
  return slug
    .split("-")
    .map((w) => (w === "and" ? "&" : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(" ");
}

export default function LoveBabbartopic() {
  const { topicSlug } = useParams();
  const { state } = useLocation();
  const questions = state?.questions ?? [];
  const topicTitle = slugToTitle(topicSlug);

  return (
    <div className="text-white">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{topicTitle}</h1>
        <p className="text-gray-400 text-sm mt-1">
          {questions.length} Questions
        </p>
      </div>

      <div className="flex items-center gap-4 px-4 pb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
        <span className="shrink-0 w-5" />
      
        <span className="flex-1">Problem</span>
        <span className="shrink-0 w-24 text-center">Platform</span>
        <span className="shrink-0 w-[18px]" />
        
        <span className="shrink-0 w-[18px]" />
     
      </div>

      {questions.length > 0 ? (
        <div className="flex flex-col gap-2">
          {questions.map((q, i) => (
            <QuestionRow key={i} data={q} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-sm mt-8 text-center">
          No questions found for "{topicTitle}".
        </p>
      )}
    </div>
  );
}
