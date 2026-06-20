import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { cn } from "../../lib/utils";

export function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What exactly is the Company-Wise Kit?",
      answer:
        "The kit provides a curated list of recent, highly-frequent interview questions from top tech companies.",
    },
    {
      question: "How often do you update the Company-wise Kit?",
      answer:
        "We update the sheets weekly with new questions reported by our community and industry sources.",
    },
    {
      question: "Are there premium questions that I won't be able to access?",
      answer:
        "No, your one-time purchase or subscription gives you access to all questions in the kit.",
    },
    {
      question: "How is this different from other free resources?",
      answer:
        "Unlike generic lists, we focus purely on recency and company-specific patterns, saving you hundreds of hours of filtering.",
    },
    {
      question: "Do I solve questions directly on Kompile?",
      answer:
        "We provide the problem descriptions, hints, and optimal solutions. You can track your progress right here.",
    },
  ];

  return (
    <div className="pt-24 pb-16 max-w-3xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-extrabold text-center text-white tracking-tight uppercase mb-12">
        Frequently Asked Questions
      </h2>

      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div key={idx} className="border-b border-gray-800">
            <button
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              className="w-full py-6 flex items-center justify-between text-left focus:outline-none"
            >
              <span className="text-lg font-bold text-white">
                {faq.question}
              </span>
              <span className="text-gray-400 ml-4 shrink-0">
                {openIndex === idx ? (
                  <Minus className="w-5 h-5" />
                ) : (
                  <Plus className="w-5 h-5" />
                )}
              </span>
            </button>
            <div
              className={cn(
                "overflow-hidden transition-all duration-300 ease-in-out",
                openIndex === idx
                  ? "max-h-40 opacity-100 pb-6"
                  : "max-h-0 opacity-0",
              )}
            >
              <p className="text-gray-400 leading-relaxed">{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
