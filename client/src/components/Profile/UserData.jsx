import GridComponent from "../GridComponent.jsx";
import Navbar from "../Navbar.jsx";
import { useContext, useState, useEffect } from "react";
import DataInputCard from "./DataInputCard.jsx";
import { UserContext } from "../../context/UserContext.jsx";
import { ArrowBigLeft, User, LayoutGrid } from "lucide-react";
import { NavLink } from "react-router-dom";
import BasicInfoForm from "./BasicInfoForm.jsx";
import { getBasicInfo, updateBasicInfo } from "../../api/auth.api.js";
import { syncAll } from "../../api/platformApi.js";
import { toast, Toaster } from "react-hot-toast";

const getPlatformKey = (platformName) => {
  const map = {
    leetcode: "leetcode",
    geeksforgeeks: "gfg",
    codeforces: "codeforces",
    hackerrank: "hackerrank",
    github: "github",
  };
  return map[platformName.toLowerCase()] || platformName.toLowerCase();
};

function UserData() {
  const { user, setUser } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState("basicInfo");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    bio: "",
    country: "",
    techStack: "",
    college: "",
    degree: "",
    branch: "",
    graduationYear: "",
  });

  useEffect(() => {
    fetchBasicInfo();
  }, []);
  const platforms = [
    {
      name: "LeetCode",
      logo: "/assets/platformLogos/leetcode-logo.png",
      link: "https://leetcode.com/u/",
      placeholder: "johndoe",
    },
    // {
    //   name: "GeeksForGeeks",
    //   logo: "/assets/platformLogos/GeeksForGeeks.png",
    //   link: "https://www.geeksforgeeks.org/user/",
    //   placeholder: "johndoe",
    // },
    // {
    //   name: "CodeChef",
    //   logo: "codechef-logo.png",
    //   link: "https://www.codechef.com/users/",
    //   placeholder: "johndoe",
    // },
    {
      name: "CodeForces",
      logo: "/assets/platformLogos/codeforces-logo.png",
      link: "https://codeforces.com/profile/",
      placeholder: "johndoe",
    },
    // {
    //   name: "HackerRank",
    //   logo: "/assets/platformLogos/hackerrank-logo.png",
    //   link: "https://www.hackerrank.com/profile/",
    //   placeholder: "johndoe",
    // },
    // {
    //   name: "AtCoder",
    //   logo: "atcoder-logo.png",
    //   link: "https://atcoder.jp/users/",
    //   placeholder: "johndoe",
    // },
    {
      name: "GitHub",
      logo: "/assets/platformLogos/github-logo.png",
      link: "https://github.com/",
      placeholder: "johndoe",
    },
  ];

  const fetchBasicInfo = async () => {
    try {
      const response = await getBasicInfo();
      toast.success("User data fetched successfully");

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

      setFormData({
        firstName: names[0] || "",
        lastName: names.slice(1).join(" "),
        bio: user.bio || "",
        country: user.country || "",
        techStack: user.techStack?.join(", ") || "",
        college: user.education?.institution || "",
        degree: user.education?.degree || "",
        branch: user.education?.branch || "",
        graduationYear: user.education?.graduationYear || "",
        leetcodeusername: leetcodeUsername,
        codeforcesusername: codeforcesUsername,
        githubusername: githubUsername,
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch user data");
      console.log("Error while fetching basic info:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (platform) => {
    try {
      const response = await updateBasicInfo(formData);

      setUser((prevUser) => ({
        ...prevUser,
        fullname: response.data.user.fullname,
        bio: response.data.user.bio,
        country: response.data.user.country,
        techStack: Array.isArray(response.data.user.techStack)
          ? response.data.user.techStack.join(", ")
          : response.data.user.techStack || "",
        education: response.data.user.education,
        connectedPlatforms: response.data.user.connectedPlatforms,
      }));

      toast.success(
        platform?.name
          ? `${platform.name} updated successfully`
          : "Basic info updated successfully",
      );

      const syncToast = toast.loading("Syncing profiles...");
      try {
        await syncAll();
        toast.success("Profiles synced!", { id: syncToast });
      } catch (syncError) {
        toast.error("Sync failed — try again from your profile", {
          id: syncToast,
        });
        console.log("Sync error after save:", syncError);
      }
    } catch (error) {
      console.log("Error while updating basic info:", error);
      toast.error(error.response?.data?.message || "Failed to update");
    }
  };

  const devPlatforms = platforms.filter((p) => p.name === "GitHub");
  const problemSolvingPlatforms = platforms.filter((p) => p.name !== "GitHub");

  return (
    <>
      <Navbar />
      <GridComponent>
        <div className="w-full min-h-screen pt-24 pb-10 px-4 md:px-8 max-w-[1400px] mx-auto text-white flex gap-10 items-start self-start">
          <Toaster position="top-center" containerStyle={{ top: 80 }} />
          <div className="w-64 shrink-0 flex flex-col gap-2">
            <NavLink
              to={`/workspace/profile/${user?.username ?? ""}`}
              className="mb-6 w-fit"
            >
              <ArrowBigLeft className="h-10 w-10 text-orange-500 hover:bg-orange-500/20 rounded-full p-1 transition" />
            </NavLink>

            <button
              onClick={() => setActiveTab("basicInfo")}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === "basicInfo" ? "bg-[#2e2e2e] text-white" : "text-zinc-400 hover:bg-[#1f1f1f] hover:text-zinc-200"}`}
            >
              <User size={20} />
              Basic Info
            </button>
            <button
              onClick={() => setActiveTab("platforms")}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === "platforms" ? "bg-[#2e2e2e] text-white" : "text-zinc-400 hover:bg-[#1f1f1f] hover:text-zinc-200"}`}
            >
              <LayoutGrid size={20} />
              Platforms
            </button>
          </div>

          <div className="flex-1">
            {activeTab === "basicInfo" ? (
              <BasicInfoForm
                formData={formData}
                onChange={handleInputChange}
                onSave={handleSubmit}
              />
            ) : (
              <div>
                <div className="mb-10">
                  <h1 className="text-3xl font-bold mb-2">Platforms</h1>
                  <p className="text-zinc-400">
                    You can update and verify your platform details here.
                  </p>
                </div>

                <div className="space-y-10">
                  <section>
                    <h2 className="text-xl font-semibold mb-4 text-zinc-200">
                      Development
                    </h2>
                    <div className="space-y-2">
                      {devPlatforms.map((platform) => (
                        <DataInputCard
                          key={platform.name}
                          logo={platform.logo}
                          name={platform.name}
                          link={platform.link}
                          placeholder={platform.placeholder}
                          value={
                            formData[
                              getPlatformKey(platform.name) + "username"
                            ] || ""
                          }
                          onChange={handleInputChange}
                          onSubmit={() => handleSubmit(platform)}
                          showInput={true}
                          buttonText="Submit"
                        />
                      ))}
                    </div>
                  </section>

                  <div className="h-px bg-[#2e2e2e] w-full" />

                  <section>
                    <h2 className="text-xl font-semibold mb-4 text-zinc-200">
                      Problem Solving
                    </h2>
                    <div className="space-y-2">
                      {problemSolvingPlatforms.map((platform) => (
                        <DataInputCard
                          key={platform.name}
                          logo={platform.logo}
                          name={platform.name}
                          link={platform.link}
                          placeholder={platform.placeholder}
                          value={
                            formData[
                              getPlatformKey(platform.name) + "username"
                            ] || ""
                          }
                          onChange={handleInputChange}
                          onSubmit={() => handleSubmit(platform)}
                          showInput={true}
                          buttonText="Submit"
                        />
                      ))}
                    </div>
                  </section>

                  <div className="flex justify-end mt-10">
                    <button
                      onClick={handleSubmit}
                      className="px-6 py-2.5 bg-[#f89f1b] hover:bg-[#e08e10] text-black font-semibold rounded-lg transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </GridComponent>
    </>
  );
}

export default UserData;
