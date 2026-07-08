import React from "react";
import { useParams } from "react-router-dom";
import QuestionRow from "./QuestionRow";

const TOPIC_QUESTIONS = {
  trie: [
    {
      title: "Construct a trie from scratch",
      difficulty: "",
      platform: "gfg",
      link: "https://www.geeksforgeeks.org/trie-insert-and-search/",
      completed: false,
    },
    {
      title: "Find shortest unique prefix for every word in a given list",
      difficulty: "",
      platform: "gfg",
      link: "https://www.geeksforgeeks.org/find-all-shortest-unique-prefixes-to-represent-each-word-in-a-given-list/",
      completed: false,
    },
    {
      title: "Word Break Problem | (Trie solution)",
      difficulty: "",
      platform: "gfg",
      link: "https://www.geeksforgeeks.org/word-break-problem-trie-solution/",
      completed: false,
    },
    {
      title: "Given a sequence of words, print all anagrams together",
      difficulty: "",
      platform: "gfg",
      link: "https://practice.geeksforgeeks.org/problems/k-anagrams-1/0",
      completed: false,
    },
    {
      title: "Implement a Phone Directory",
      difficulty: "",
      platform: "gfg",
      link: "https://practice.geeksforgeeks.org/problems/phone-directory/0",
      completed: false,
    },
    {
      title: "Print unique rows in a given boolean matrix",
      difficulty: "",
      platform: "gfg",
      link: "https://practice.geeksforgeeks.org/problems/unique-rows-in-boolean-matrix/1",
      completed: false,
    },
  ],
  array: [
    {
      title: "Two Sum",
      difficulty: "Easy",
      platform: "leetcode",
      link: "https://leetcode.com/problems/two-sum/",
      completed: false,
    },
    {
      title: "Best Time to Buy and Sell Stock",
      difficulty: "Easy",
      platform: "leetcode",
      link: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
      completed: false,
    },
    {
      title: "Maximum Subarray (Kadane's)",
      difficulty: "Medium",
      platform: "gfg",
      link: "https://www.geeksforgeeks.org/largest-sum-contiguous-subarray/",
      completed: false,
    },
    {
      title: "Sort an Array of 0s, 1s, and 2s",
      difficulty: "Easy",
      platform: "gfg",
      link: "https://www.geeksforgeeks.org/sort-an-array-of-0s-1s-and-2s/",
      completed: false,
    },
    {
      title: "Next Permutation",
      difficulty: "Medium",
      platform: "leetcode",
      link: "https://leetcode.com/problems/next-permutation/",
      completed: false,
    },
  ],
  matrix: [
    {
      title: "Spiral Matrix",
      difficulty: "Medium",
      platform: "leetcode",
      link: "https://leetcode.com/problems/spiral-matrix/",
      completed: false,
    },
    {
      title: "Set Matrix Zeroes",
      difficulty: "Medium",
      platform: "leetcode",
      link: "https://leetcode.com/problems/set-matrix-zeroes/",
      completed: false,
    },
    {
      title: "Rotate Image",
      difficulty: "Medium",
      platform: "leetcode",
      link: "https://leetcode.com/problems/rotate-image/",
      completed: false,
    },
  ],
  string: [
    {
      title: "Reverse Words in a String",
      difficulty: "Medium",
      platform: "leetcode",
      link: "https://leetcode.com/problems/reverse-words-in-a-string/",
      completed: false,
    },
    {
      title: "Longest Palindromic Substring",
      difficulty: "Medium",
      platform: "leetcode",
      link: "https://leetcode.com/problems/longest-palindromic-substring/",
      completed: false,
    },
    {
      title: "Valid Anagram",
      difficulty: "Easy",
      platform: "leetcode",
      link: "https://leetcode.com/problems/valid-anagram/",
      completed: false,
    },
    {
      title: "KMP Algorithm",
      difficulty: "Hard",
      platform: "gfg",
      link: "https://www.geeksforgeeks.org/kmp-algorithm-for-pattern-searching/",
      completed: false,
    },
  ],
  "searching-and-sorting": [
    {
      title: "Binary Search",
      difficulty: "Easy",
      platform: "leetcode",
      link: "https://leetcode.com/problems/binary-search/",
      completed: false,
    },
    {
      title: "Merge Sort",
      difficulty: "Medium",
      platform: "gfg",
      link: "https://www.geeksforgeeks.org/merge-sort/",
      completed: false,
    },
    {
      title: "Quick Sort",
      difficulty: "Medium",
      platform: "gfg",
      link: "https://www.geeksforgeeks.org/quick-sort/",
      completed: false,
    },
  ],
  linkedlist: [
    {
      title: "Reverse Linked List",
      difficulty: "Easy",
      platform: "leetcode",
      link: "https://leetcode.com/problems/reverse-linked-list/",
      completed: false,
    },
    {
      title: "Detect a Loop in Linked List",
      difficulty: "Easy",
      platform: "gfg",
      link: "https://www.geeksforgeeks.org/detect-loop-in-a-linked-list/",
      completed: false,
    },
    {
      title: "Merge Two Sorted Lists",
      difficulty: "Easy",
      platform: "leetcode",
      link: "https://leetcode.com/problems/merge-two-sorted-lists/",
      completed: false,
    },
    {
      title: "LRU Cache",
      difficulty: "Medium",
      platform: "leetcode",
      link: "https://leetcode.com/problems/lru-cache/",
      completed: false,
    },
  ],
  "binary-trees": [
    {
      title: "Inorder Traversal",
      difficulty: "Easy",
      platform: "leetcode",
      link: "https://leetcode.com/problems/binary-tree-inorder-traversal/",
      completed: false,
    },
    {
      title: "Level Order Traversal",
      difficulty: "Medium",
      platform: "leetcode",
      link: "https://leetcode.com/problems/binary-tree-level-order-traversal/",
      completed: false,
    },
    {
      title: "Diameter of Binary Tree",
      difficulty: "Easy",
      platform: "leetcode",
      link: "https://leetcode.com/problems/diameter-of-binary-tree/",
      completed: false,
    },
  ],
  "binary-search-trees": [
    {
      title: "Search in a BST",
      difficulty: "Easy",
      platform: "leetcode",
      link: "https://leetcode.com/problems/search-in-a-binary-search-tree/",
      completed: false,
    },
    {
      title: "Validate BST",
      difficulty: "Medium",
      platform: "leetcode",
      link: "https://leetcode.com/problems/validate-binary-search-tree/",
      completed: false,
    },
    {
      title: "Lowest Common Ancestor of BST",
      difficulty: "Medium",
      platform: "leetcode",
      link: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/",
      completed: false,
    },
  ],
  greedy: [
    {
      title: "Activity Selection Problem",
      difficulty: "Medium",
      platform: "gfg",
      link: "https://www.geeksforgeeks.org/activity-selection-problem-greedy-algo-1/",
      completed: false,
    },
    {
      title: "Jump Game",
      difficulty: "Medium",
      platform: "leetcode",
      link: "https://leetcode.com/problems/jump-game/",
      completed: false,
    },
    {
      title: "Fractional Knapsack",
      difficulty: "Medium",
      platform: "gfg",
      link: "https://www.geeksforgeeks.org/fractional-knapsack-problem/",
      completed: false,
    },
  ],
  backtracking: [
    {
      title: "N-Queens",
      difficulty: "Hard",
      platform: "leetcode",
      link: "https://leetcode.com/problems/n-queens/",
      completed: false,
    },
    {
      title: "Sudoku Solver",
      difficulty: "Hard",
      platform: "leetcode",
      link: "https://leetcode.com/problems/sudoku-solver/",
      completed: false,
    },
    {
      title: "Rat in a Maze",
      difficulty: "Medium",
      platform: "gfg",
      link: "https://www.geeksforgeeks.org/rat-in-a-maze-backtracking-2/",
      completed: false,
    },
    {
      title: "Permutations",
      difficulty: "Medium",
      platform: "leetcode",
      link: "https://leetcode.com/problems/permutations/",
      completed: false,
    },
  ],
  "stacks-and-queues": [
    {
      title: "Valid Parentheses",
      difficulty: "Easy",
      platform: "leetcode",
      link: "https://leetcode.com/problems/valid-parentheses/",
      completed: false,
    },
    {
      title: "Min Stack",
      difficulty: "Medium",
      platform: "leetcode",
      link: "https://leetcode.com/problems/min-stack/",
      completed: false,
    },
    {
      title: "Next Greater Element",
      difficulty: "Easy",
      platform: "gfg",
      link: "https://www.geeksforgeeks.org/next-greater-element/",
      completed: false,
    },
  ],
  heap: [
    {
      title: "Kth Largest Element",
      difficulty: "Medium",
      platform: "leetcode",
      link: "https://leetcode.com/problems/kth-largest-element-in-an-array/",
      completed: false,
    },
    {
      title: "Merge K Sorted Lists",
      difficulty: "Hard",
      platform: "leetcode",
      link: "https://leetcode.com/problems/merge-k-sorted-lists/",
      completed: false,
    },
    {
      title: "Top K Frequent Elements",
      difficulty: "Medium",
      platform: "leetcode",
      link: "https://leetcode.com/problems/top-k-frequent-elements/",
      completed: false,
    },
  ],
  graph: [
    {
      title: "BFS of Graph",
      difficulty: "Easy",
      platform: "gfg",
      link: "https://www.geeksforgeeks.org/breadth-first-search-or-bfs-for-a-graph/",
      completed: false,
    },
    {
      title: "DFS of Graph",
      difficulty: "Easy",
      platform: "gfg",
      link: "https://www.geeksforgeeks.org/depth-first-search-or-dfs-for-a-graph/",
      completed: false,
    },
    {
      title: "Number of Islands",
      difficulty: "Medium",
      platform: "leetcode",
      link: "https://leetcode.com/problems/number-of-islands/",
      completed: false,
    },
  ],
  "dynamic-programming": [
    {
      title: "Climbing Stairs",
      difficulty: "Easy",
      platform: "leetcode",
      link: "https://leetcode.com/problems/climbing-stairs/",
      completed: false,
    },
    {
      title: "Longest Common Subsequence",
      difficulty: "Medium",
      platform: "leetcode",
      link: "https://leetcode.com/problems/longest-common-subsequence/",
      completed: false,
    },
    {
      title: "0/1 Knapsack Problem",
      difficulty: "Medium",
      platform: "gfg",
      link: "https://www.geeksforgeeks.org/0-1-knapsack-problem-dp-10/",
      completed: false,
    },
    {
      title: "Coin Change",
      difficulty: "Medium",
      platform: "leetcode",
      link: "https://leetcode.com/problems/coin-change/",
      completed: false,
    },
    {
      title: "Edit Distance",
      difficulty: "Hard",
      platform: "leetcode",
      link: "https://leetcode.com/problems/edit-distance/",
      completed: false,
    },
  ],
  "bit-manipulation": [
    {
      title: "Single Number",
      difficulty: "Easy",
      platform: "leetcode",
      link: "https://leetcode.com/problems/single-number/",
      completed: false,
    },
    {
      title: "Number of 1 Bits",
      difficulty: "Easy",
      platform: "leetcode",
      link: "https://leetcode.com/problems/number-of-1-bits/",
      completed: false,
    },
    {
      title: "Power of Two",
      difficulty: "Easy",
      platform: "leetcode",
      link: "https://leetcode.com/problems/power-of-two/",
      completed: false,
    },
    {
      title: "Reverse Bits",
      difficulty: "Easy",
      platform: "leetcode",
      link: "https://leetcode.com/problems/reverse-bits/",
      completed: false,
    },
  ],
};

function slugToTitle(slug = "") {
  return slug
    .split("-")
    .map((w) => (w === "and" ? "&" : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(" ");
}

export default function LoveBabbartopic() {
  const { topicSlug } = useParams();
  const questions = TOPIC_QUESTIONS[topicSlug] ?? [];
  const topicTitle = slugToTitle(topicSlug);

  return (
    <div className="text-white">
    
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{topicTitle}</h1>
        <p className="text-gray-400 text-sm mt-1">
          {questions.length} Questions
        </p>
      </div>

  
      <div className="flex items-center gap-4 px-5 pb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
        <span className="w-5" />
        <span className="flex-1">Problem</span>
        <span className="w-8 text-center">Platform</span>
        <span className="w-16 text-center">Difficulty</span>
        <span className="w-5" />
        <span className="w-5" />
      </div>


      {questions.length > 0 ? (
        <div className="flex flex-col gap-2">
          {questions.map((q, i) => (
            <QuestionRow key={i} {...q} />
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
