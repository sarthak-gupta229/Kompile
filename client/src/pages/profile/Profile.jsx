import { useState, useContext, useEffect } from "react";
import { UserContext } from "../../context/UserContext";
import { UserCog } from "lucide-react";
import { NavLink } from "react-router-dom";
import GithubData from "../../components/Profile/subprofiles/GithubData.jsx";
import LeetcodeData from "../../components/Profile/subprofiles/LeetcodeData.jsx";
import CodeforcesData from "../../components/Profile/subprofiles/Codeforces.jsx";
import UserStats from "../../components/Profile/subprofiles/UserStats.jsx";
import ProfileSidebar from "./ProfileSidebar";
import { getBasicInfo } from "../../api/auth.api.js";
import { toast, Toaster } from "react-hot-toast";
import {
  getAllUserStats,
  getUserLeetCodeStats,
  getUserGitHubStats,
  getUserCodeForcesStats,
} from "../../api/platformApi.js";

function Profile() {
  const [activeTab, setActiveTab] = useState("userStats");
  const { user } = useContext(UserContext);
  const [leetcodeData, setLeetCodeData] = useState();
  const [codeforcesData, setCodeforcesData] = useState();
  const [githubData, setGitHubData] = useState();
  const [allStats, setAllStats] = useState();
  const [isStatsLoading, setIsStatsLoading] = useState(true);
  const [userData, setUserData] = useState({
    name: "",
    username: "",
    profileImage: "",
    bio: "",
    location: "",
    university: "",
    skills: [],
    socialLinks: {
      email: "",
      linkedin: "",
      twitter: "",
      website: "",
      resume: "",
    },
    firstName: "",
    lastName: "",
    country: "",
    techStack: "",
    college: "",
    degree: "",
    branch: "",
    graduationYear: "",
    leetcodeUsername: "",
    codeforcesUsername: "",
    githubUsername: "",
  });

  useEffect(() => {
    fetchBasicInfo();
  }, []);

  useEffect(() => {
    const fetchAllStats = async () => {
      setIsStatsLoading(true);
      try {
        const [allStatsRes, leetcode, github, codeforces] =
          await Promise.allSettled([
            getAllUserStats(),
            getUserLeetCodeStats(),
            getUserGitHubStats(),
            getUserCodeForcesStats(),
          ]);
        if (allStatsRes.status === "fulfilled")
          setAllStats(allStatsRes.value.data.stats);
        if (leetcode.status === "fulfilled")
          setLeetCodeData(leetcode.value.data.profile);
        if (github.status === "fulfilled")
          setGitHubData(github.value.data.profile);
        if (codeforces.status === "fulfilled")
          setCodeforcesData(codeforces.value.data.profile);
        console.log("allStats:", allStats);
      } finally {
        setIsStatsLoading(false);
        toast.success("data fetched successfully");
      }
    };
    fetchAllStats();
  }, []);

  const fetchBasicInfo = async () => {
    try {
      const response = await getBasicInfo();

      const user = response.data.user;
      const names = (user.fullname || "").split(" ");

      const leetcodeUsername =
        user.connectedPlatforms?.find((item) => item.platform === "leetcode")
          ?.username || "";

      const codeforcesUsername =
        user.connectedPlatforms?.find((item) => item.platform === "codeforces")
          ?.username || "";

      const githubUsername =
        user.connectedPlatforms?.find((item) => item.platform === "github")
          ?.username || "";

      const firstName = names[0] || "";
      const lastName = names.slice(1).join(" ");
      const skills = Array.isArray(user.techStack)
        ? user.techStack
        : user.techStack
            ?.split(",")
            .map((s) => s.trim())
            .filter(Boolean) || [];

      setUserData({
        name: `${firstName} ${lastName}`.trim() || user.username || "User",
        username: user.username || "",
        profileImage: user.avatar?.url || "",
        bio: user.bio || "",
        location: user.country || "Not set",
        university: user.education?.institution || "Not set",
        skills,
        socialLinks: {
          email: user.email || "",
          linkedin: user.socialLinks?.linkedin || "",
          twitter: user.socialLinks?.twitter || "",
          website: user.socialLinks?.website || "",
          resume: user.socialLinks?.resume || "",
        },
        // raw fields
        firstName,
        lastName,
        country: user.country || "",
        techStack: skills.join(", "),
        college: user.education?.institution || "",
        degree: user.education?.degree || "",
        branch: user.education?.branch || "",
        graduationYear: user.education?.graduationYear || "",
        leetcodeUsername,
        codeforcesUsername,
        githubUsername,
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch user data");
      console.log("Error while fetching basic info:", error);
    }
  };

  return (
    <div className="w-full pb-6 px-4 md:px-6 max-w-[1600px] mx-auto">
      <Toaster position="top-right" containerStyle={{ top: 80 }} />
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
              onClick={() => setActiveTab("userStats")}
              className={`px-5 py-2 text-sm font-medium transition-all duration-200 border-b-2 -mb-px ${
                activeTab === "userStats"
                  ? "border-[#f89f1b] text-[#f89f1b]"
                  : "border-transparent text-[#888] hover:text-white"
              }`}
            >
              All Stats
            </button>
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
              onClick={() => setActiveTab("codeforces")}
              className={`px-5 py-2 text-sm font-medium transition-all duration-200 border-b-2 -mb-px ${
                activeTab === "codeforces"
                  ? "border-[#f89f1b] text-[#f89f1b]"
                  : "border-transparent text-[#888] hover:text-white"
              }`}
            >
              Codeforces
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
            {isStatsLoading ? (
              <div className="flex items-center justify-center h-48">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#f89f1b]" />
              </div>
            ) : (
              <>
                {activeTab === "userStats" && (
                  <UserStats allStats={allStats} techStack={userData.skills} />
                )}
                {activeTab === "leetcode" && (
                  <LeetcodeData
                    LeetcodeData={leetcodeData}
                    userName={userData.leetcodeUsername}
                  />
                )}
                {activeTab === "codeforces" && (
                  <CodeforcesData
                    CodeforcesData={codeforcesData}
                    userName={userData.codeforcesUsername}
                  />
                )}
                {activeTab === "github" && (
                  <GithubData
                    githubData={githubData}
                    userName={userData.githubUsername}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Profile;
