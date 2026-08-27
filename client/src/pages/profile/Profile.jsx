import { useState, useContext, useEffect, useRef } from "react";
import { UserContext } from "../../context/UserContext";
import { UserCog, RefreshCw } from "lucide-react";
import { NavLink, useParams } from "react-router-dom";
import GithubData from "../../components/Profile/subprofiles/GithubData.jsx";
import LeetcodeData from "../../components/Profile/subprofiles/LeetcodeData.jsx";
import CodeforcesData from "../../components/Profile/subprofiles/Codeforces.jsx";
import UserStats from "../../components/Profile/subprofiles/UserStats.jsx";
import ProfileSidebar from "./ProfileSidebar";
import { getBasicInfo } from "../../api/auth.api.js";
import KompileCard from "../../components/Profile/subprofiles/KompileCard.jsx";
import { toast, Toaster } from "react-hot-toast";
import {
  getAllUserStats,
  getUserLeetCodeStats,
  getUserGitHubStats,
  getUserCodeForcesStats,
  syncAll,
} from "../../api/platformApi.js";

function Profile() {
  const { username } = useParams();
  const [activeTab, setActiveTab] = useState("userStats");
  const { user } = useContext(UserContext);
  const [isSyncing, setIsSyncing] = useState(false);
  const hasShownSyncToast = useRef(false);
  const [kompileCardActive, setKompileCardActive] = useState(false);
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

  const targetUsername = username || user?.username;
  const isOwner =
    !username ||
    (user?.username && username.toLowerCase() === user.username.toLowerCase());

  const fetchAllStats = async (uname) => {
    setIsStatsLoading(true);
    try {
      const [allStatsRes, leetcode, github, codeforces] =
        await Promise.allSettled([
          getAllUserStats(uname),
          getUserLeetCodeStats(uname),
          getUserGitHubStats(uname),
          getUserCodeForcesStats(uname),
        ]);

      setAllStats(
        allStatsRes.status === "fulfilled"
          ? allStatsRes.value.data.stats
          : null,
      );
      setLeetCodeData(
        leetcode.status === "fulfilled" ? leetcode.value.data.profile : null,
      );
      setGitHubData(
        github.status === "fulfilled" ? github.value.data.profile : null,
      );
      setCodeforcesData(
        codeforces.status === "fulfilled"
          ? codeforces.value.data.profile
          : null,
      );
    } finally {
      setIsStatsLoading(false);
    }
  };

  const handleSyncAll = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    try {
      const response = await syncAll();
      toast.success(response.message || "All profiles synced successfully");
      await fetchAllStats(targetUsername);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to sync profiles");
      console.log("Sync all error:", error);
    } finally {
      setIsSyncing(false);
    }
  };

  const fetchBasicInfo = async (uname) => {
    try {
      const response = await getBasicInfo(uname);

      const userObj = response.data.user;
      const names = (userObj.fullname || "").split(" ");

      const leetcodeUsername =
        userObj.connectedPlatforms?.find((item) => item.platform === "leetcode")
          ?.username || "";

      const codeforcesUsername =
        userObj.connectedPlatforms?.find(
          (item) => item.platform === "codeforces",
        )?.username || "";

      const githubUsername =
        userObj.connectedPlatforms?.find((item) => item.platform === "github")
          ?.username || "";

      const firstName = names[0] || "";
      const lastName = names.slice(1).join(" ");
      const skills = Array.isArray(userObj.techStack)
        ? userObj.techStack
        : userObj.techStack
            ?.split(",")
            .map((s) => s.trim())
            .filter(Boolean) || [];

      setUserData({
        name: `${firstName} ${lastName}`.trim() || userObj.username || "User",
        username: userObj.username || "",
        profileImage: userObj.avatar?.url || "",
        bio: userObj.bio || "",
        location: userObj.country || "Not set",
        university: userObj.education?.institution || "Not set",
        skills,
        socialLinks: {
          email: userObj.email || "",
          linkedin: userObj.socialLinks?.linkedin || "",
          twitter: userObj.socialLinks?.twitter || "",
          website: userObj.socialLinks?.website || "",
          resume: userObj.socialLinks?.resume || "",
        },
        firstName,
        lastName,
        country: userObj.country || "",
        techStack: skills.join(", "),
        college: userObj.education?.institution || "",
        degree: userObj.education?.degree || "",
        branch: userObj.education?.branch || "",
        graduationYear: userObj.education?.graduationYear || "",
        connectedPlatforms: userObj.connectedPlatforms || [],
        leetcodeUsername,
        codeforcesUsername,
        githubUsername,
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch user data");
      console.log("Error while fetching basic info:", error);
    }
  };

  useEffect(() => {
    if (targetUsername) {
      fetchBasicInfo(targetUsername);
      fetchAllStats(targetUsername);

      if (isOwner && !hasShownSyncToast.current) {
        hasShownSyncToast.current = true;
        toast("Please resync your data once today", {
          icon: "🔄",
          duration: 4000,
          style: {
            borderRadius: "12px",
            background: "#1c1c1c",
            color: "#fff",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          },
        });
      }
    }
  }, [targetUsername, isOwner]);

  return (
    <div className="w-full pb-6 max-w-[1600px] mx-auto">
      <Toaster position="top-right" containerStyle={{ top: 80 }} />
      <section className="flex flex-col lg:flex-row justify-between items-start gap-6 min-h-[calc(100vh-120px)]">
        {/* left */}
        <ProfileSidebar
          userData={userData}
          kompileCardActive={kompileCardActive}
          setKompileCardActive={setKompileCardActive}
          isOwner={isOwner}
        />

        {/* right */}
        {kompileCardActive ? (
          <div className="flex-1 min-w-0 w-full">
            <KompileCard allStats={allStats} userData={userData} />
          </div>
        ) : (
          <div className="flex-1 min-w-0 w-full bg-[#141414] rounded-2xl h-full border border-white/[0.08] p-6 text-white flex flex-col shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-2xl">Profile</p>
              </div>
              {isOwner && (
                <div className="flex gap-2 items-center">
                  <button
                    onClick={handleSyncAll}
                    disabled={isSyncing}
                    title="Sync all profiles"
                    className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-[#2e2e2e] transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    <RefreshCw
                      size={22}
                      className={`${isSyncing ? "animate-spin text-[#f89f1b]" : "text-zinc-400 hover:text-white"}`}
                    />
                  </button>
                  <div>
                    <NavLink to="/user_data">
                      <UserCog size={24} />
                    </NavLink>
                  </div>
                </div>
              )}
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
                    <UserStats
                      allStats={allStats}
                      techStack={userData.skills}
                      noPlatformsLinked={
                        !userData.leetcodeUsername &&
                        !userData.codeforcesUsername &&
                        !userData.githubUsername
                      }
                    />
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
        )}
      </section>
    </div>
  );
}

export default Profile;
