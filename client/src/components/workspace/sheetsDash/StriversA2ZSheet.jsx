import React from "react";

function StriversA2ZSheet() {
  const dsaSteps = [
    {
      step: 1,
      title: "Learn the Basics",
      totalQuestions: 31,
      route: "/basics",
    },
    {
      step: 2,
      title: "Learn Important Sorting Techniques",
      totalQuestions: 7,
      route: "/sorting",
    },
    {
      step: 3,
      title: "Solve Problems on Arrays (Easy → Medium → Hard)",
      totalQuestions: 40,
      route: "/arrays",
    },
    {
      step: 4,
      title: "Binary Search (1D, 2D Arrays, Search Space)",
      totalQuestions: 32,
      route: "/binary-search",
    },
    {
      step: 5,
      title: "Strings (Basic and Medium)",
      totalQuestions: 15,
      route: "/strings-basic",
    },
    {
      step: 6,
      title: "Linked List (Single LL, Double LL, Medium, Hard)",
      totalQuestions: 31,
      route: "/linked-list",
    },
    {
      step: 7,
      title: "Recursion (Pattern Wise)",
      totalQuestions: 25,
      route: "/recursion",
    },
    {
      step: 8,
      title: "Bit Manipulation (Concepts & Problems)",
      totalQuestions: 18,
      route: "/bit-manipulation",
    },
    {
      step: 9,
      title: "Stack and Queues",
      totalQuestions: 30,
      route: "/stack-queue",
    },
    {
      step: 10,
      title: "Sliding Window & Two Pointer",
      totalQuestions: 12,
      route: "/sliding-window",
    },
    {
      step: 11,
      title: "Heaps",
      totalQuestions: 17,
      route: "/heaps",
    },
    {
      step: 12,
      title: "Greedy Algorithms",
      totalQuestions: 16,
      route: "/greedy",
    },
    {
      step: 13,
      title: "Binary Trees",
      totalQuestions: 39,
      route: "/binary-trees",
    },
    {
      step: 14,
      title: "Binary Search Trees",
      totalQuestions: 16,
      route: "/binary-search-trees",
    },
    {
      step: 15,
      title: "Graphs",
      totalQuestions: 54,
      route: "/graphs",
    },
    {
      step: 16,
      title: "Dynamic Programming",
      totalQuestions: 56,
      route: "/dynamic-programming",
    },
    {
      step: 17,
      title: "Tries",
      totalQuestions: 7,
      route: "/tries",
    },
    {
      step: 18,
      title: "Strings",
      totalQuestions: 9,
      route: "/advanced-strings",
    },
  ];
  return (
    <>
      <section>
        <div
          className={`relative bg-[#111111] border border-gray-800  hover:border-t-orange-500 rounded-xl p-4 cursor-pointer group transition-all duration-300 shadow-lg hover:shadow-xl overflow-hidden  w-full`}
        >
          <h1 className="text-3xl font-bold text-white mb-2">
            Strivers A2Z DSA Sheet
          </h1>
          <p className="text-gray-400">
            This course is made for people who want to learn DSA from A to Z for
            free in a well-organized and structured manner. The lecture quality
            is better than what you get in paid courses, the only thing we don’t
            provide is doubt support, but trust me our YouTube video comments
            resolve that as well, we have a wonderful community of 250K+ people
            who engage in all of the videos.
          </p>
        </div>
      </section>
    </>
  );
}

export default StriversA2ZSheet;
