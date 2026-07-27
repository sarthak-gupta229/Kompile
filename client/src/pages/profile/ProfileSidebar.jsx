import React from "react";
import { Edit, MapPin, GraduationCap, Lock, Unlock } from "lucide-react";

function ProfileSidebar({ userData, kompileCardActive, setKompileCardActive }) {
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

        <button
          onClick={() => setKompileCardActive((prev) => !prev)}
          className={`w-full flex items-center justify-center gap-2 border border-[#2e2e2e] font-semibold py-3 rounded-lg transition-colors cursor-pointer ${
            kompileCardActive
              ? "bg-[#f89f1b] text-black hover:bg-[#e08e10]"
              : "bg-[#1f1f1f] hover:bg-[#2e2e2e] text-[#f89f1b]"
          }`}
        >
          Kompile Card
          {kompileCardActive ? <Unlock size={18} /> : <Lock size={18} />}
        </button>
      </div>

      <div className="w-full py-5 border-b border-[#2e2e2e] flex justify-center gap-8 text-zinc-400">
        {userData.leetcodeUsername && (
          <a
            href={`https://leetcode.com/${userData.leetcodeUsername}`}
            target="_blank"
            rel="noopener noreferrer"
            title={`LeetCode: ${userData.leetcodeUsername}`}
            className="group flex flex-col items-center gap-1 hover:text-[#ffa116] transition-colors"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" />
            </svg>
            <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {userData.leetcodeUsername}
            </span>
          </a>
        )}

        {userData.codeforcesUsername && (
          <a
            href={`https://codeforces.com/profile/${userData.codeforcesUsername}`}
            target="_blank"
            rel="noopener noreferrer"
            title={`Codeforces: ${userData.codeforcesUsername}`}
            className="group flex flex-col items-center gap-1 hover:text-[#1f8dd6] transition-colors"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4.5 7.5C5.328 7.5 6 8.172 6 9v10.5c0 .828-.672 1.5-1.5 1.5h-3C.672 21 0 20.328 0 19.5V9c0-.828.672-1.5 1.5-1.5h3zm9-4.5c.828 0 1.5.672 1.5 1.5V19.5c0 .828-.672 1.5-1.5 1.5h-3c-.828 0-1.5-.672-1.5-1.5V4.5C9 3.672 9.672 3 10.5 3h3zm9 7.5c.828 0 1.5.672 1.5 1.5v9c0 .828-.672 1.5-1.5 1.5h-3c-.828 0-1.5-.672-1.5-1.5v-9c0-.828.672-1.5 1.5-1.5h3z" />
            </svg>
            <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {userData.codeforcesUsername}
            </span>
          </a>
        )}

        {userData.githubUsername && (
          <a
            href={`https://github.com/${userData.githubUsername}`}
            target="_blank"
            rel="noopener noreferrer"
            title={`GitHub: ${userData.githubUsername}`}
            className="group flex flex-col items-center gap-1 hover:text-white transition-colors"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
            <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {userData.githubUsername}
            </span>
          </a>
        )}

        {!userData.leetcodeUsername &&
          !userData.codeforcesUsername &&
          !userData.githubUsername && (
            <span className="text-sm text-zinc-600 italic">
              No platforms connected
            </span>
          )}
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
          <p>{userData.bio}</p>
        </div>
      </div>
    </div>
  );
}

export default ProfileSidebar;
