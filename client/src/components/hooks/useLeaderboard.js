import { useState, useEffect, useCallback } from "react";
import {
  fetchGlobalLeaderboard,
  fetchRoomLeaderboard,
} from "../../api/leaderboard.api";

export const useLeaderboard = ({
  scope,
  roomId = null,
  metric,
  limit = 20,
}) => {
  const [entries, setEntries] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const load = useCallback(
    async (targetPage) => {
      setLoading(true);
      setError(null);
      try {
        const data =
          scope === "room"
            ? await fetchRoomLeaderboard({ roomId, metric })
            : await fetchGlobalLeaderboard({ metric, page: targetPage, limit });

        setEntries(data);
        setHasMore(scope === "global" && data.length === limit);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load leaderboard");
      } finally {
        setLoading(false);
      }
    },
    [scope, roomId, metric, limit],
  );

  useEffect(() => {
    setPage(1);
    load(1);
  }, [metric, scope, roomId]);

  const nextPage = () => {
    const next = page + 1;
    setPage(next);
    load(next);
  };

  const prevPage = () => {
    const prev = Math.max(page - 1, 1);
    setPage(prev);
    load(prev);
  };

  return {
    entries,
    page,
    loading,
    error,
    hasMore,
    nextPage,
    prevPage,
    refresh: () => load(page),
  };
};
