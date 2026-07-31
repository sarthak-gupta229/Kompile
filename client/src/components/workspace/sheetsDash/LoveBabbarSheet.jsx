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
      // Inspect the shape of topics to find the correct field names
      console.log("Full response data:", res.data);
      console.log("First topic object:", res.data?.topics?.[0]);
      toast.success(res.message);
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

  const dsaTopics = [
    { topic: "Array", totalQuestions: 36, route: "array" },
    { topic: "Matrix", totalQuestions: 10, route: "matrix" },
    { topic: "String", totalQuestions: 41, route: "string" },
    {
      topic: "Searching & Sorting",
      totalQuestions: 35,
      route: "searching-and-sorting",
    },
    { topic: "LinkedList", totalQuestions: 34, route: "linkedlist" },
    { topic: "Binary Trees", totalQuestions: 35, route: "binary-trees" },
    {
      topic: "Binary Search Trees",
      totalQuestions: 22,
      route: "binary-search-trees",
    },
    { topic: "Greedy", totalQuestions: 36, route: "greedy" },
    { topic: "BackTracking", totalQuestions: 19, route: "backtracking" },
    {
      topic: "Stacks & Queues",
      totalQuestions: 38,
      route: "stacks-and-queues",
    },
    { topic: "Heap", totalQuestions: 18, route: "heap" },
    { topic: "Graph", totalQuestions: 44, route: "graph" },
    { topic: "Trie", totalQuestions: 6, route: "trie" },
    {
      topic: "Dynamic Programming",
      totalQuestions: 61,
      route: "dynamic-programming",
    },
    {
      topic: "Bit Manipulation",
      totalQuestions: 10,
      route: "bit-manipulation",
    },
  ];

  return (
    <>
      <section>
        <Toaster position="top-center" />
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
