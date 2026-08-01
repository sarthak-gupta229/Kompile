import React, { useState } from "react";
import { Star, FileText } from "lucide-react";
import {
  toggleSheetQuestion,
  toggleBookmarkQuestion,
} from "../../../api/sheets.api";

const YoutubeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#ff0000">
    <path d="M23.498 6.186a2.99 2.99 0 0 0-2.107-2.117C19.379 3.5 12 3.5 12 3.5s-7.379 0-9.391.569A2.99 2.99 0 0 0 .502 6.186 31.37 31.37 0 0 0 0 12a31.37 31.37 0 0 0 .502 5.814 2.99 2.99 0 0 0 2.107 2.117C4.621 20.5 12 20.5 12 20.5s7.379 0 9.391-.569a2.99 2.99 0 0 0 2.107-2.117A31.37 31.37 0 0 0 24 12a31.37 31.37 0 0 0-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const DIFFICULTY_STYLES = {
  Easy: "text-green-400",
  Medium: "text-yellow-400",
  Hard: "text-red-400",
};

function LinkButton({ href, icon, title }) {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={title}
      onClick={(e) => e.stopPropagation()}
      className="shrink-0 opacity-70 hover:opacity-100 transition-opacity duration-150"
    >
      {icon}
    </a>
  );
}

export default function Strivera2zQuestionRow({ data }) {
  const [completed, setCompleted] = useState(
    data.completed ?? data.solved ?? false,
  );
  const [bookmarked, setBookmarked] = useState(
    data.bookmarked ?? data.bookmark ?? false,
  );

  const diffClass = DIFFICULTY_STYLES[data.difficulty] ?? "text-green-400";
  const sheetId = data.sheetId;
  const questionId = data._id;

  const handleToggleProgress = async (e) => {
    e.stopPropagation();
    const prev = completed;
    setCompleted((v) => !v);
    try {
      const res = await toggleSheetQuestion(sheetId, questionId);
      setCompleted(res?.data?.completed ?? !prev);
    } catch (err) {
      console.error("Failed to toggle progress:", err);
      setCompleted(prev);
    }
  };

  const handleToggleBookmark = async (e) => {
    e.stopPropagation();
    const prev = bookmarked;
    setBookmarked((v) => !v);
    try {
      const res = await toggleBookmarkQuestion(sheetId, questionId);
      setBookmarked(res?.data?.bookmarked ?? !prev);
    } catch (err) {
      console.error("Failed to toggle bookmark:", err);
      setBookmarked(prev);
    }
  };

  const primaryLink =
    data.links?.primary ||
    data.links?.leetcode ||
    data.links?.gfg ||
    data.links?.article ||
    null;

  const videoLink = data.links?.video ?? data.video_link;
  const articleLink = data.links?.article ?? data.article_link;
  const gfgLink = data.links?.gfg ?? data.gfg_link;
  const leetcodeLink = data.links?.leetcode ?? data.leetcode_link;

  const rowClass =
    "group flex items-center gap-4 bg-[#111111] border border-gray-800 hover:border-orange-500/60 rounded-xl px-4 py-3 transition-all duration-200 hover:bg-[#161616] no-underline mb-2";

  const content = (
    <>
      <button
        onClick={handleToggleProgress}
        className="shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200"
        style={{
          borderColor: completed ? "#22c55e" : "#4b5563",
          backgroundColor: completed ? "#22c55e22" : "transparent",
        }}
        title={completed ? "Mark incomplete" : "Mark complete"}
      >
        {completed && (
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path
              d="M2 5l2.5 2.5L8 3"
              stroke="#22c55e"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>

      <span
        className={`flex-1 text-sm font-medium transition-colors duration-200 ${
          completed ? "text-gray-500 line-through" : "text-gray-300"
        }`}
      >
        {data.title ?? data.name}
      </span>

      <div className="shrink-0 flex items-center gap-3">
        <LinkButton
          href={videoLink}
          icon={<YoutubeIcon />}
          title="Watch video"
        />

        {articleLink && (
          <a
            href={articleLink}
            target="_blank"
            rel="noopener noreferrer"
            title="Read article"
            onClick={(e) => e.stopPropagation()}
            className="text-xs text-gray-400 hover:text-orange-400 transition-colors duration-150"
          >
            Article
          </a>
        )}

        {gfgLink && (
          <a
            href={gfgLink}
            target="_blank"
            rel="noopener noreferrer"
            title="Solve on GFG"
            onClick={(e) => e.stopPropagation()}
            className="text-xs text-gray-400 hover:text-green-400 transition-colors duration-150"
          >
            GFG
          </a>
        )}

        {leetcodeLink && (
          <a
            href={leetcodeLink}
            target="_blank"
            rel="noopener noreferrer"
            title="Solve on LeetCode"
            onClick={(e) => e.stopPropagation()}
            className="text-xs text-gray-400 hover:text-yellow-400 transition-colors duration-150"
          >
            LC
          </a>
        )}
      </div>

      {data.difficulty && (
        <span
          className={`shrink-0 text-xs font-medium w-14 text-center ${diffClass}`}
        >
          {data.difficulty}
        </span>
      )}

      <button
        onClick={handleToggleBookmark}
        className="shrink-0 transition-colors duration-200"
        title={bookmarked ? "Remove bookmark" : "Bookmark"}
      >
        <Star
          size={16}
          className={
            bookmarked
              ? "text-yellow-400 fill-yellow-400"
              : "text-gray-600 hover:text-yellow-400"
          }
        />
      </button>

      <button
        onClick={(e) => e.stopPropagation()}
        className="shrink-0 text-gray-600 hover:text-gray-300 transition-colors duration-200"
        title="Add note"
      >
        <FileText size={16} />
      </button>
    </>
  );

  return primaryLink ? (
    <a
      href={primaryLink}
      target="_blank"
      rel="noopener noreferrer"
      className={rowClass}
    >
      {content}
    </a>
  ) : (
    <div className={rowClass}>{content}</div>
  );
}
