import React, { useState } from "react";
import { X } from "lucide-react";
import { createRoom } from "../../../api/rooms.api.js";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function CreateRoom({ open, setOpen }) {
  const [formData, setFormData] = useState({ name: "", maxMembers: "5" });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  if (!open) return null;

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Room name is required");
      return;
    }
    setIsLoading(true);
    try {
      const { room } = await createRoom({
        name: formData.name.trim(),
        maxMembers: Number(formData.maxMembers),
      });
      toast.success("Room created!");
      setOpen(false);
      navigate(`/workspace/room/${room._id}`);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Failed to create room",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      {/* Modal panel — stop click propagation so clicking inside doesn't close */}
      <div
        className="relative w-full max-w-md bg-[#111111] border border-gray-800 rounded-2xl p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
        >
          <X size={18} />
        </button>

        <h2 className="text-xl font-bold text-white mb-6">Create a Room</h2>

        <form onSubmit={handleCreateRoom} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              Room Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g. DSA Grind Squad"
              className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-gray-700 rounded-xl text-white placeholder-gray-600 outline-none focus:border-orange-500 transition-colors"
              autoFocus
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              Max Members (2–10)
            </label>
            <input
              type="number"
              min={2}
              max={10}
              value={formData.maxMembers}
              onChange={(e) =>
                setFormData({ ...formData, maxMembers: e.target.value })
              }
              className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-gray-700 rounded-xl text-white outline-none focus:border-orange-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 w-full px-4 py-2.5 bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-black font-semibold rounded-xl transition-colors cursor-pointer"
          >
            {isLoading ? "Creating…" : "Create Room"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateRoom;
