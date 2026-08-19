import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRoom, leaveRoom } from "../../../api/rooms.api.js";
import { toast } from "react-hot-toast";
import Community from "../community/Community.jsx";
import RoomContest from "./RoomContest.jsx";
import { Copy, CopyCheck, ArrowLeft, LogOut } from "lucide-react";

function RoomSpace() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [activeTabs, setActiveTabs] = useState("leaderboard");
  const [copied, setCopied] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  const fetchRoom = async () => {
    try {
      const result = await getRoom(roomId);
      setRoom(result.data?.room);
      toast.success("Room fetched successfully");
    } catch {
      toast.error("Failed to fetch room");
    }
  };

  useEffect(() => {
    fetchRoom();
  }, []);
  const tabs = [
    { key: "leaderboard", label: "Leaderboard" },
    { key: "Contest", label: "Contest" },
  ];

  const handleCopy = async (text) => {
    await navigator.clipboard.writeText(text);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleLeaveRoom = async () => {
    if (!window.confirm("Are you sure you want to leave this room?")) return;
    setIsLeaving(true);
    try {
      await leaveRoom(roomId);
      toast.success("Left the room");
      navigate(-1);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to leave room");
    } finally {
      setIsLeaving(false);
    }
  };

  return (
    <>
      <div className="flex justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors mb-4 group"
        >
          <ArrowLeft
            size={18}
            className="group-hover:-translate-x-0.5 transition-transform"
          />
          <span className="text-sm font-medium">Back</span>
        </button>

        <button
          onClick={handleLeaveRoom}
          disabled={isLeaving}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-red-400 border border-red-500/30 hover:bg-red-500/10 hover:text-red-300 hover:border-red-500/60 disabled:opacity-50 transition-all cursor-pointer"
        >
          <LogOut size={15} />
          {isLeaving ? "Leaving…" : "Exit Room"}
        </button>
      </div>
      <div className="flex justify-between">
        <h1 className="text-4xl font-bold mb-4">{room?.name}</h1>
        <span className="flex items-center gap-2">
          Invite Code :{" "}
          <span className="text-[#ff9d3c]">{room?.inviteCode}</span>
          <button onClick={() => handleCopy(room?.inviteCode)}>
            {copied ? (
              <CopyCheck size={20} className="text-green-500" />
            ) : (
              <Copy size={20} className="text-gray-400 hover:text-white" />
            )}
          </button>
        </span>
      </div>
      <div className="flex gap-2">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTabs(key)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeTabs === key
                ? "bg-[#ff9d3c] text-black shadow-lg shadow-orange-500/20"
                : "bg-[#111111] border border-gray-800 text-gray-400 hover:border-gray-600 hover:text-gray-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {activeTabs === "leaderboard" && <Community roomId={roomId} />}
      {activeTabs === "Contest" && <RoomContest roomId={roomId} />}
    </>
  );
}

export default RoomSpace;
