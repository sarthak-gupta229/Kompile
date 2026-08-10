import React from "react";
import MysheetsCard from "./MysheetsCard";
import { useState, useEffect } from "react";
import { getAllSheetsStats } from "../../../api/sheets.api";

function Mysheets() {
  const [sheetsData, setSheetsdata] = useState([]);

  const fetchMySheets = async () => {
    try {
      const { data } = await getAllSheetsStats();
      setSheetsdata(data);
    } catch (err) {
      console.error("Error fetching my sheets:", err);
    }
  };

  useEffect(() => {
    fetchMySheets();
  }, []);
  useEffect(() => {
    console.log(sheetsData);
  }, [sheetsData]);

  const data = [
    {
      heading: "Strivers A2Z DSA Sheet",
      text: "This course is made for people who want to learn DSA from A to Z for free in a well-organized and structured manner. The lecture quality is better than what you get in paid courses, the only thing we don't provide is doubt support, but trust me our YouTube video comments resolve that as well, we have a wonderful community of 250K+ people who engage in all of the videos.",
      solved: "0",
      totalQuestions: 445,
      route: "/workspace/sheets/strivers-a2z",
    },
    {
      heading: "Love Babbar Sheet",
      text: "The DSA sheet by Love Babbar is designed to cover almost every concept in Data Structures and Algorithms. It is an excellent resource for mastering DSA, succeeding in technical interviews at companies like Amazon, Microsoft, and Google, and improving programming skills in languages such as C++, Java, or Python. We acknowledge and appreciate Love Babbar's efforts in creating this detailed guide for the developer community.",
      solved: "0",
      totalQuestions: 445,
      route: "/workspace/sheets/love-babbar-450",
    },
  ];

  return (
    <div className="text-white">
      <h1 className="text-5xl font-bold mb-10">My Sheets</h1>

      <div className="flex flex-wrap flex-row gap-4">
        {sheetsData.map((sheet, index) => (
          <MysheetsCard key={index} sheet={sheet} />
        ))}
      </div>
    </div>
  );
}

export default Mysheets;
