import React, { useState } from "react";
import { DoorOpen, Search, Plus } from "lucide-react";
import CreateRoom from "./CreateRoom";
import JoinRoom from "./JoinRoom";

function Room() {
  const [createOpen, setCreateOpen] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);

  return (
    <>
      <div>
        <h1 className="text-3xl font-bold text-white">Rooms</h1>
      </div>
      <div className="bg-[#0f0f0f] p-4 mt-4 rounded-xl flex justify-between">
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
        <div></div>
      </div>

      <CreateRoom open={createOpen} setOpen={setCreateOpen} />
      <JoinRoom open={joinOpen} setOpen={setJoinOpen} />
    </>
  );
}

export default Room;
