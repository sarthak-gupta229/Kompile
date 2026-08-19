import React from "react";
import { useNavigate } from "react-router-dom";

function RoomsCard({ room }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/workspace/room/${room._id}`)}
      className="relative p-4 rounded-xl bg-[#111111] border border-gray-800 hover:border-gray-600 transition-all cursor-pointer min-h-[80px]"
    >
      <h2 className="text-white font-semibold text-lg">{room.name}</h2>

      <span className="absolute bottom-3 right-4 text-gray-400 text-sm">
        {room.memberCount}/{room.maxMembers}
      </span>
    </div>
  );
}

export default RoomsCard;
