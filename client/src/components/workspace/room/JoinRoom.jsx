import React, { useState } from "react";
import { X } from "lucide-react";
import { joinRoom } from "../../../api/rooms.api.js";
import toast from "react-hot-toast";

function JoinRoom({ open, setOpen, onSuccess }) {
  const [inviteCode, setInviteCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!open) return null;

  const handleJoinRoom = async (e) => {
    e.preventDefault();
    if (!inviteCode.trim()) {
      toast.error("Invite code is required");
      return;
    }
    setIsLoading(true);
    try {
      const { room } = await joinRoom({ inviteCode: inviteCode.trim() });
      toast.success("Joined room!");
      setOpen(false);
      if (onSuccess) onSuccess();
      window.location.href = `/workspace/room/${room._id}`;
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Failed to join room",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <div
        className="relative w-full max-w-md bg-[#111111] border border-gray-800 rounded-2xl p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
        >
          <X size={18} />
        </button>

        <h2 className="text-xl font-bold text-white mb-6">Join a Room</h2>

        <form onSubmit={handleJoinRoom} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              Invite Code
            </label>
            <input
              type="text"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              placeholder="e.g. ABC123"
              className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-gray-700 rounded-xl text-white placeholder-gray-600 outline-none focus:border-orange-500 transition-colors"
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 w-full px-4 py-2.5 bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-black font-semibold rounded-xl transition-colors cursor-pointer"
          >
            {isLoading ? "Joining…" : "Join Room"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default JoinRoom;
