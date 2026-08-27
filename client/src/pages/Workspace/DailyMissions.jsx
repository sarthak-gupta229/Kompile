import React, { useEffect, useState, useRef } from "react";
import { CheckSquare, Plus, Trash2, Loader2 } from "lucide-react";
import {
  getMissions,
  createMission,
  toggleMission,
  deleteMission,
} from "../../api/todo.api";

const PRIORITY_STYLES = {
  "High Priority": "bg-red-500/15 text-red-400 border border-red-500/25",
  Medium: "bg-yellow-500/15 text-yellow-400 border border-yellow-500/25",
  Low: "bg-green-500/15 text-green-400 border border-green-500/25",
};

const PRIORITIES = ["High Priority", "Medium", "Low"];

const PRIORITY_ORDER = {
  "High Priority": 1,
  High: 1,
  Medium: 2,
  Low: 3,
};

const sortByPriority = (list) => {
  return [...list].sort((a, b) => {
    const orderA = PRIORITY_ORDER[a.priority] ?? 2;
    const orderB = PRIORITY_ORDER[b.priority] ?? 2;
    if (orderA !== orderB) {
      return orderA - orderB;
    }
    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
  });
};

function AddMissionForm({ onAdd, onClose }) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === "Escape") onClose();
  };

  const handleSubmit = async () => {
    if (!title.trim()) return;
    setLoading(true);
    try {
      await onAdd({ title: title.trim(), priority });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
      <input
        ref={inputRef}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Mission title…"
        className="w-full bg-transparent text-sm text-white placeholder-gray-600 outline-none border-b border-white/10 pb-2 focus:border-orange-500/50 transition-colors"
      />

      {/* Priority */}
      <div className="flex gap-2">
        {PRIORITIES.map((p) => (
          <button
            key={p}
            onClick={() => setPriority(p)}
            className={`text-xs px-2.5 py-1 rounded-full transition-all ${
              priority === p
                ? PRIORITY_STYLES[p]
                : "text-gray-600 hover:text-gray-400"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-1">
        <button
          onClick={onClose}
          className="text-xs text-gray-500 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/5 transition-all"
        >
          Cancel
        </button>
        <button
          disabled={!title.trim() || loading}
          onClick={handleSubmit}
          className="text-xs text-white bg-orange-500 hover:bg-orange-400 disabled:opacity-40 disabled:cursor-not-allowed px-4 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5"
        >
          {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
          Add
        </button>
      </div>
    </div>
  );
}

function MissionItem({ mission, onToggle, onDelete }) {
  const [toggling, setToggling] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const done = mission.status === "completed";

  const handleToggle = async () => {
    setToggling(true);
    try {
      await onToggle(mission._id);
    } finally {
      setToggling(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await onDelete(mission._id);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div
      className={`group flex items-start gap-3 p-3 rounded-xl border transition-all duration-200 ${
        done
          ? "bg-white/2 border-white/4 opacity-60"
          : "bg-[#181818] border-white/6 hover:border-white/12"
      }`}
    >
      {/* Checkbox */}
      <button
        onClick={handleToggle}
        disabled={toggling}
        className="mt-0.5 flex-shrink-0"
      >
        {toggling ? (
          <Loader2 className="w-4 h-4 text-orange-400 animate-spin" />
        ) : done ? (
          <div className="w-4 h-4 rounded-sm bg-orange-500/80 border border-orange-400 flex items-center justify-center">
            <svg
              className="w-2.5 h-2.5 text-white"
              viewBox="0 0 12 12"
              fill="none"
            >
              <path
                d="M2 6l3 3 5-5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        ) : (
          <div className="w-4 h-4 rounded-sm border border-white/20 hover:border-orange-400/60 transition-colors" />
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-medium leading-snug ${
            done ? "line-through text-gray-600" : "text-gray-200"
          }`}
        >
          {mission.title}
        </p>
        {mission.priority && (
          <div className="mt-1.5">
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${PRIORITY_STYLES[mission.priority]}`}
            >
              {mission.priority}
            </span>
          </div>
        )}
      </div>

      <button
        onClick={handleDelete}
        disabled={deleting}
        className="opacity-0 group-hover:opacity-100 flex-shrink-0 text-gray-600 hover:text-red-400 transition-all duration-150 mt-0.5"
      >
        {deleting ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <Trash2 className="w-3.5 h-3.5" />
        )}
      </button>
    </div>
  );
}

export default function DailyMissions() {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const fetchMissions = () => {
    getMissions()
      .then((res) => setMissions(res?.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMissions();
  }, []);

  const handleAdd = async (missionData) => {
    const res = await createMission(missionData);
    if (res?.data) setMissions((prev) => [res.data, ...prev]);
  };

  const handleToggle = async (id) => {
    const res = await toggleMission(id);
    if (res?.data) {
      setMissions((prev) =>
        prev
          .map((m) => (m._id === id ? res.data : m))
          .sort(
            (a, b) => (a.status === "completed") - (b.status === "completed"),
          ),
      );
    }
  };

  const handleDelete = async (id) => {
    await deleteMission(id);
    setMissions((prev) => prev.filter((m) => m._id !== id));
  };

  const pending = sortByPriority(
    missions.filter((m) => m.status === "pending"),
  );
  const completed = sortByPriority(
    missions.filter((m) => m.status === "completed"),
  );

  return (
    <div className="bg-[#111111] border border-white/8 rounded-2xl p-5 flex flex-col gap-4 shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckSquare className="w-5 h-5 text-orange-400" />
          <h2 className="text-base font-semibold text-white">Daily Missions</h2>
          {!loading && (
            <span className="text-xs text-gray-600 ml-1">
              {completed.length}/{missions.length}
            </span>
          )}
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-1 text-gray-500 hover:text-orange-400 hover:bg-orange-500/8 transition-all duration-200 p-1.5 rounded-lg"
          title="Add mission"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {missions.length > 0 && (
        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full transition-all duration-500"
            style={{
              width: `${Math.round((completed.length / missions.length) * 100)}%`,
            }}
          />
        </div>
      )}

      {showForm && (
        <AddMissionForm onAdd={handleAdd} onClose={() => setShowForm(false)} />
      )}

      <div className="flex flex-col gap-2 max-h-[420px] overflow-y-auto pr-0.5 custom-scrollbar">
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-5 h-5 text-orange-400 animate-spin" />
          </div>
        ) : missions.length === 0 ? (
          <div className="text-center py-10 text-gray-600 text-sm">
            <CheckSquare className="w-8 h-8 mx-auto mb-2 opacity-20" />
            No missions yet. Add one to get started!
          </div>
        ) : (
          <>
            {pending.map((m) => (
              <MissionItem
                key={m._id}
                mission={m}
                onToggle={handleToggle}
                onDelete={handleDelete}
              />
            ))}
            {completed.length > 0 && pending.length > 0 && (
              <div className="flex items-center gap-2 my-1">
                <div className="h-px flex-1 bg-white/5" />
                <span className="text-[10px] text-gray-700 uppercase tracking-widest">
                  completed
                </span>
                <div className="h-px flex-1 bg-white/5" />
              </div>
            )}
            {completed.map((m) => (
              <MissionItem
                key={m._id}
                mission={m}
                onToggle={handleToggle}
                onDelete={handleDelete}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
