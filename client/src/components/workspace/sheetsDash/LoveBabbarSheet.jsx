import React from "react";
import LoveBabbarTopicCard from "./loveBabbartopicCard.jsx";
import { useEffect, useState } from "react";
import { getSheetBySlug } from "../../../api/sheets.api.js";
import { toast, Toaster } from "react-hot-toast";
export default function LoveBabbarSheet() {
  const [sheets, setSheets] = useState([]);

  const fetchSheets = async () => {
    try {
      const res = await getSheetBySlug("love-babbar-450");
      setSheets(res.data);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchSheets();
  }, []);

  const slugify = (str) =>
    str
      ? str
          .toLowerCase()
          .trim()
          .replace(/&/g, "and")
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-")
      : "";

  return (
    <>
      <section>
        <Toaster position="top-right" />
        <div
          className={`relative bg-[#111111] border border-gray-800  hover:border-t-orange-500 rounded-xl p-4 cursor-pointer group transition-all duration-300 shadow-lg hover:shadow-xl overflow-hidden  w-full`}
        >
          <h1 className="text-3xl font-bold text-white mb-2">
            Love Babbar Sheet
          </h1>
          <p className="text-gray-400">
            The DSA sheet by Love Babbar is designed to cover almost every
            concept in Data Structures and Algorithms. It is an excellent
            resource for mastering DSA, succeeding in technical interviews at
            companies like Amazon, Microsoft, and Google, and improving
            programming skills in languages such as C++, Java, or Python. We
            acknowledge and appreciate Love Babbar's efforts in creating this
            detailed guide for the developer community.
          </p>
        </div>
      </section>
      <section className="flex flex-col gap-2 mt-4">
        {sheets?.topics?.map((obj, index) => (
          <LoveBabbarTopicCard
            key={index}
            topic={obj.name}
            totalQuestions={obj.totalCount}
            completedQuestions={obj.solvedCount}
            route={slugify(obj.name)}
            questions={obj.questions}
          />
        ))}
      </section>
    </>
  );
}
