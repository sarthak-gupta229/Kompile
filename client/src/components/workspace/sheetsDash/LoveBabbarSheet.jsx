import React from "react";
import LoveBabbarTopicCard from "./LoveBabbarTopicCard";

export default function LoveBabbarSheet() {
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
        {dsaTopics.map((e, index) => (
          <LoveBabbarTopicCard
            key={index}
            topic={e.topic}
            totalQuestions={e.totalQuestions}
            route={e.route}
          />
        ))}
      </section>
    </>
  );
}
