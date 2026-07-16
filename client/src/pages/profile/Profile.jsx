import { useState, useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { UserCog } from "lucide-react";
import { NavLink } from "react-router-dom";
import GithubData from "./GithubData";
import LeetcodeData from "./LeetcodeData";
import ProfileSidebar from "./ProfileSidebar";

function Profile() {
  const [activeTab, setActiveTab] = useState("leetcode");
  const { user } = useContext(UserContext);

  const userData = {
    name: `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || user?.name || "User Name",
    username: user?.firstName || "Username",
    profileImage: user?.avatar || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
    socialLinks: {
      email: user?.email || "No email",
      linkedin: "https://linkedin.com",
      twitter: "https://x.com",
      website: "https://example.com",
      resume: "https://example.com/resume.pdf",
    },
    location: user?.country || "Not set",
    university: user?.college || "Not set",
    stats: {
      leetcode: {
        rating: 1820,
        problemsSolved: 650,
      },
      codeforces: {
        rating: 1450,
        maxRating: 1520,
      },
      github: {
        repositories: 34,
        followers: 120,
      },
    },
    skills: user?.techStack ? user.techStack.split(",").map(s => s.trim()) : ["React", "Node.js", "C++"],
  };

  return (
    <div className="w-full pb-6 px-4 md:px-6 max-w-[1600px] mx-auto">
      <section className="flex justify-between items-start gap-6 min-h-[calc(100vh-120px)]">
        {/* left */}
        <ProfileSidebar userData={userData} />

        {/* right */}
        <div className="w-2/3 bg-[#141414] rounded-xl h-full border border-[#2e2e2e] p-6 text-white flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-2xl">Profile</p>
            </div>
            <div>
              <NavLink to="/user_data">
                <UserCog size={24} />
              </NavLink>
            </div>
          </div>

          <div className="flex gap-1 border-b border-[#2e2e2e] mb-6">
            <button
              onClick={() => setActiveTab("leetcode")}
              className={`px-5 py-2 text-sm font-medium transition-all duration-200 border-b-2 -mb-px ${
                activeTab === "leetcode"
                  ? "border-[#f89f1b] text-[#f89f1b]"
                  : "border-transparent text-[#888] hover:text-white"
              }`}
            >
              LeetCode
            </button>
            <button
              onClick={() => setActiveTab("github")}
              className={`px-5 py-2 text-sm font-medium transition-all duration-200 border-b-2 -mb-px ${
                activeTab === "github"
                  ? "border-[#f89f1b] text-[#f89f1b]"
                  : "border-transparent text-[#888] hover:text-white"
              }`}
            >
              GitHub
            </button>
          </div>

          <div className="flex-1">
            {activeTab === "leetcode" && <LeetcodeData />}
            {activeTab === "github" && <GithubData />}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Profile;
