import React, { useState, useEffect } from "react";
import { DoorOpen, Search, Plus } from "lucide-react";
import CreateRoom from "./CreateRoom";
import JoinRoom from "./JoinRoom";
import { toast } from "react-hot-toast";
import { getRooms } from "../../../api/rooms.api.js";
import RoomsCard from "./RoomsCard.jsx";

function Room() {
  const [createOpen, setCreateOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);
  const [rooms, setRooms] = useState([]);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const result = await getRooms();
      setRooms(result.data?.rooms ?? []);
      console.log("Rooms Data:", result.data?.rooms);
      toast.success("Rooms fetched successfully");
    } catch {
      toast.error("Failed to fetch rooms");
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <>
      <div>
        <h1 className="text-3xl font-bold text-white">Rooms</h1>
      </div>
      <div className="bg-[#0f0f0f] p-4 mt-4 rounded-xl flex justify-between items-center">
        <span className="bg-[#111111] flex items-center gap-2 px-4 py-2 rounded-lg">
          <Search className="w-5 h-5" />
          <input
            type="text"
            placeholder="Search Your Rooms"
            className="bg-transparent border-none outline-none text-white"
          />
        </span>
        <span className="flex items-center gap-2">
          <button
            onClick={() => setCreateOpen(true)}
            className="bg-[#111111] flex items-center gap-2 px-4 py-2 rounded-lg hover:border border-gray-600 transition-all cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            Create Room
          </button>
          <button
            onClick={() => setJoinOpen(true)}
            className="bg-[#111111] flex items-center gap-2 px-4 py-2 rounded-lg hover:border border-gray-600 transition-all cursor-pointer"
          >
            <DoorOpen className="w-5 h-5" />
            Join Room
          </button>
        </span>
      </div>

      <CreateRoom open={createOpen} setOpen={setCreateOpen} onSuccess={fetchRooms} />
      <JoinRoom open={joinOpen} setOpen={setJoinOpen} onSuccess={fetchRooms} />

      <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-[#111111] border border-gray-800 animate-pulse"
              >
                <div className="h-5 bg-gray-700 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-700 rounded w-1/4"></div>
              </div>
            ))
          : rooms.map((room) => <RoomsCard key={room.id} room={room} />)}
      </div>
    </>
  );
}

export default Room;
