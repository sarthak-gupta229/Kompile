import { useEffect, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const GAP_BETWEEN_TOASTS_MS = 4000;
export const useTodayContestToasts = () => {
  const hasRunRef = useRef(false);

  useEffect(() => {
    if (hasRunRef.current) return;
    hasRunRef.current = true;

    const showAllTodayContests = async () => {
      let contests;
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/events/contests/today`,
        );
        contests = res.data.data;
      } catch (err) {
        console.error("Failed to fetch today's contests:", err);
        return;
      }
      if (!contests?.length) return;

      contests.forEach((contest, index) => {
        setTimeout(() => {
          const startTime = new Date(contest.start).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });

          toast((t) => (
            <div
              onClick={() => {
                window.open(contest.href, "_blank", "noopener,noreferrer");
                toast.dismiss(t.id);
              }}
              style={{ cursor: "pointer" }}
            >
              <span style={{ fontSize: "11px", opacity: 0.6 }}>Today · {startTime}</span>
              <div style={{ fontWeight: 600, fontSize: "12px", marginTop: "2px" }}>
                🏆 {contest.event}
              </div>
            </div>
          ));
        }, index * GAP_BETWEEN_TOASTS_MS);
      });
    };

    showAllTodayContests();
  }, []);
};
