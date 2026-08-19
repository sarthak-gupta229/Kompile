import React from "react";
import { useEffect, useState } from "react";
import { getSheetBySlug } from "../../../api/sheets.api.js";
import { toast, Toaster } from "react-hot-toast";
import StriversA2Ztopics from "./StriversA2Ztopics";

function StriversA2ZSheet() {
  const [rawSheetData, setRawSheetData] = useState(null);
  const [sheetData, setSheetData] = useState([]);

  useEffect(() => {
    if (!rawSheetData?.topics) return;

    const steps = rawSheetData.topics.filter((topic) => !topic.parentTopicId);

    const stepTree = steps.map((step) => ({
      ...step,
      subSteps: rawSheetData.topics.filter(
        (topic) => topic.parentTopicId === step._id,
      ),
    }));

    setSheetData(stepTree);
  }, [rawSheetData]);

  const fetchSheets = async () => {
    try {
      const res = await getSheetBySlug("strivers-a2z");
      setRawSheetData(res.data);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchSheets();
  }, []);

  useEffect(() => {
    console.log("sheetData:", sheetData);
  }, [sheetData]);

  return (
    <>
      <section className="mb-3">
        <Toaster position="top-right" />
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
      <section>
        {sheetData.map((step) => (
          <StriversA2Ztopics step={step} key={step._id} />
        ))}
      </section>
    </>
  );
}

export default StriversA2ZSheet;
