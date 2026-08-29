import Navbar from "../../components/Navbar";
import { useState, useEffect } from "react";
import axios from "axios";
import Calendar from "../../components/Calendar";
import ContestCard from "../../components/ContestCard";

export default function Contest() {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchContests() {
      try {
        setLoading(true);
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const monthEnd = new Date(
          now.getFullYear(),
          now.getMonth() + 2,
          0,
          23,
          59,
          59,
        );

        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/events/contests`,
          {
            params: {
              start: monthStart.toISOString(),
              end: monthEnd.toISOString(),
            },
          },
        );

        setContests(res.data.data); 
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchContests();
  }, []);


  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white flex flex-col font-sans">
      <Navbar />

      {/* main content container */}
      <div className="flex-1 pt-[88px] px-4 md:px-6 pb-6 max-w-[1600px] w-full mx-auto flex flex-col">
        {/* top controls row */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-6 relative z-10 w-full">
          {/* search bar */}
          {/* <div className="flex-1 max-w-md bg-[#141414] border border-[#2e2e2e] rounded-lg px-4 py-2.5 flex items-center shadow-sm">
            <span className="text-gray-500 mr-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search Contests"
              className="bg-transparent border-none outline-none text-sm w-full text-white placeholder-gray-500"
            />
          </div> */}
        </div>

        {/* layout */}
        <div className="flex w-full gap-6 items-stretch h-[calc(100vh-180px)] min-h-[600px]">
          <div className="hidden lg:flex w-[320px] xl:w-[400px] bg-[#141414] border border-[#2e2e2e] rounded-xl flex-shrink-0 flex-col overflow-hidden h-full">
            <div className="p-5 border-b border-[#2e2e2e] flex-shrink-0">
              <h2 className="text-xl font-bold text-[#e0e0e0]">
                Upcoming Contest
              </h2>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar scrollbar-thumb-orange-500 scrollbar-track-zinc-800">
              {loading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-gray-500"></div>
                </div>
              ) : error ? (
                <div className="text-red-500 text-sm text-center py-4">
                  {error}
                </div>
              ) : contests.length === 0 ? (
                <div className="text-gray-500 text-sm text-center py-4">
                  No contests available.
                </div>
              ) : (
                contests
                  .filter((contest) => {
                    const toUTC = (t) => (t && !t.endsWith("Z") ? t + "Z" : t);
                    const now = new Date();
                    const endTime = new Date(toUTC(contest.end));
                    const startTime = new Date(toUTC(contest.start));
                    return endTime > now || startTime > now;
                  })
                  .slice(0, 10)
                  .map((contest, index) => (
                    <ContestCard
                      key={index}
                      start={contest.start}
                      end={contest.end}
                      duration={contest.duration}
                      host={contest.host}
                      event={contest.event}
                      href={contest.href}
                    />
                  ))
              )}
            </div>
          </div>

          <div className="flex-1 relative h-full">
            {loading ? (
              <div className="flex justify-center items-center h-full bg-[#141414] border border-[#2e2e2e] rounded-xl">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-500"></div>
              </div>
            ) : error ? (
              <div className="flex justify-center items-center h-full bg-[#141414] border border-[#2e2e2e] rounded-xl text-red-500 text-sm">
                Failed to load contests: {error}
              </div>
            ) : (
              <Calendar eventInfo={contests} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
