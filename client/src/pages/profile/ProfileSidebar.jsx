import React from "react";
import {
  Edit,
  Mail,
  Globe,
  FileText,
  MapPin,
  GraduationCap,
  Lock,
} from "lucide-react";

function ProfileSidebar({ userData }) {
  return (
    <div className="w-1/3 sticky top-[100px] bg-[#141414] rounded-xl h-fit flex flex-col border border-[#2e2e2e] text-white">
      <div className="w-full p-6 border-b border-[#2e2e2e] flex flex-col items-center relative">
        <button className="absolute top-4 right-4 p-2 hover:bg-[#2e2e2e] rounded-md transition-colors">
          <Edit size={20} className="text-zinc-500" />
        </button>
        <div className="w-48 h-48 rounded-full overflow-hidden mb-4 flex-shrink-0">
          {userData.profileImage &&
          !userData.profileImage.includes("placehold") ? (
            <img
              src={userData.profileImage}
              alt={userData.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center text-white font-extrabold text-5xl select-none"
              style={{
                background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
              }}
            >
              {(userData.name || userData.username || "?")
                .split(" ")
                .slice(0, 2)
                .map((w) => w[0]?.toUpperCase())
                .join("")}
            </div>
          )}
        </div>
        <h1 className="text-4xl font-bold mb-1">{userData.name}</h1>

        <button className="w-full flex items-center justify-center gap-2 bg-[#1f1f1f] border border-[#2e2e2e] hover:bg-[#2e2e2e] text-[#f89f1b] font-semibold py-3 rounded-lg transition-colors">
          Kompile Card
          <Lock size={18} />
        </button>
      </div>

      <div className="w-full py-6 border-b border-[#2e2e2e] flex justify-center gap-8 text-zinc-400">
        <a
          href={`mailto:${userData.socialLinks.email}`}
          className="hover:text-white transition-colors"
        >
          <Mail size={26} />
        </a>
        <a
          href={userData.socialLinks.linkedin}
          className="hover:text-white transition-colors"
        >
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
            <rect x="2" y="9" width="4" height="12" />
            <circle cx="4" cy="4" r="2" />
          </svg>
        </a>
        <a
          href={userData.socialLinks.twitter}
          className="hover:text-white transition-colors"
        >
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
            <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
          </svg>
        </a>
        <a
          href={userData.socialLinks.website}
          className="hover:text-white transition-colors"
        >
          <Globe size={26} />
        </a>
        <a
          href={userData.socialLinks.resume}
          className="hover:text-white transition-colors"
        >
          <FileText size={26} />
        </a>
      </div>

      <div className="w-full p-6 border-b border-[#2e2e2e] flex flex-col gap-5 text-zinc-300">
        <div className="flex items-center gap-4">
          <MapPin size={22} className="text-zinc-400" />
          <span className="text-xl">{userData.location}</span>
        </div>
        <div className="flex items-center gap-4">
          <GraduationCap size={22} className="text-zinc-400" />
          <span className="text-xl">{userData.university}</span>
        </div>
      </div>

      <div className="w-full p-6 flex-1">
        <h2 className="text-2xl font-bold mb-4 text-zinc-300">About</h2>
        <div className="flex flex-wrap gap-2">
          {userData.skills.map((skill) => (
            <span
              key={skill}
              className="px-3 py-1.5 bg-[#2e2e2e] text-zinc-300 rounded-md text-sm font-medium"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProfileSidebar;
