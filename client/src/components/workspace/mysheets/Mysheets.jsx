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
