import React, { useEffect } from "react";
import { useBookmarks } from "../hooks/useBookmarks";

export default function Bookmarks() {
  const { bookmarks, loading, error } = useBookmarks();

  useEffect(() => {
    console.log(bookmarks);
  }, [bookmarks]);

  if (loading) return <div>Loading...</div>;

  if (error) return <div>Error: {error}</div>;
  return (
    <div>
      <h1>Bookmarks</h1>
      <ul>
        {bookmarks.map((bookmark) => (
          <li key={bookmark.questionId}>
            <a
              href={bookmark.links?.[0]?.url ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
            >
              {bookmark.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
