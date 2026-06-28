import Navbar from "../../components/Navbar";
import GridComponent from "../../components/GridComponent";
import { Footer } from "../../components/CompanyWiseKit/Footer";
import { Link } from "react-router-dom";
import { MacbookScroll } from "@/components/ui/macbook-scroll";
import dashboardImg from "../../../Assets/landingPage/Kompile (5) 1.png";
import codolioCardImg from "../../../Assets/landingPage/codolio card.png";
import codolioPlatformsImg from "../../../Assets/landingPage/codolio-platforms.png";
import workspaceIcon from "../../../Assets/landingPage/workspace-svgrepo-com.svg";
import trackerIcon from "../../../Assets/landingPage/tracker.svg";
import notesIcon from "../../../Assets/landingPage/notes.svg";
import workspaceGridImg from "../../../Assets/landingPage/grid.png";
import cumulativeQuestionsImg from "../../../Assets/landingPage/feature.png";
import activeDaysImg from "../../../Assets/landingPage/feature1 (2).png";
import heatmapImg from "../../../Assets/landingPage/heatmap.png";
import dsaAnalysisImg from "../../../Assets/landingPage/feature1.png";
import classificationImg from "../../../Assets/landingPage/feature1 (1).png";
import contestStatsImg from "../../../Assets/landingPage/feature1 (4).png";
import contestGraphImg from "../../../Assets/landingPage/Contest Graph.png";
import awardsImg from "../../../Assets/landingPage/feature1 (5).png";
import rankingsImg from "../../../Assets/landingPage/feature1 (6).png";
import githubStatsHubImg from "../../../Assets/landingPage/feature1 (7).png";
import visibilityImg from "../../../Assets/landingPage/visibility.png";
import { CompanySheets } from "../../components/CompanyWiseKit/CompanySheets";
import { useNavigate } from "react-router-dom";
import ScrollVelocity from "../../components/ScrollVelocity/ScrollVelocity.jsx";
import PoweredByChip from "../../components/chipanimation/PoweredByChip.jsx";

export default function LandingPage() {
  const navigate = useNavigate();
  const companies = [
    {
      name: "Google",
      desc: "Get interview-ready with Google's top DSA problems",
      icon: "G",
    },
    {
      name: "Amazon",
      desc: "Focused Amazon DSA questions and interview patterns",
      icon: "A",
    },
    {
      name: "Meta",
      desc: "Handpicked Meta problems for engineering roles",
      icon: "M",
    },
    {
      name: "Microsoft",
      desc: "Master the Microsoft technical interview cycle",
      icon: "M",
    },
    {
      name: "Apple",
      desc: "Top Apple interview questions and system design",
      icon: "A",
    },
  ];

  return (
    <div className="bg-black text-white min-h-screen">
      <Navbar />

      <GridComponent>
        <div className="pt-36 pb-16 px-6 text-center">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 uppercase tracking-tight">
            Track, Analyze <span className="text-orange-500">&</span> Share
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-8">
            <span className="text-orange-500 font-bold">Kompile</span> helps you
            navigate and track your coding journey to success
          </p>

          <div className="flex justify-center gap-4 mb-16">
            <button
              className="border border-gray-700 px-6 py-2 rounded-md hover:bg-gray-800 transition"
              onClick={() => navigate("/profile")}
            >
              Profile Tracker
            </button>
            <button
              className="bg-orange-500 px-6 py-2 rounded-md hover:bg-orange-600 transition font-semibold"
              onClick={() => navigate("/company")}
            >
              Company-Wise Kit →
            </button>
          </div>

          <div className="flex justify-center mt-12 mb-20 px-4">
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(249,115,22,0.1)] bg-gray-900/50 backdrop-blur-sm">
                <img
                  src={dashboardImg}
                  alt="dashboard"
                  className="hidden md:block w-full max-w-[750px] opacity-95"
                />
                <img
                  src={dashboardImg}
                  alt="dashboard-mobile"
                  className="block md:hidden w-full max-w-sm rounded-xl"
                />
              </div>

              <div className="md:absolute md:-bottom-12 md:-right-12 flex justify-center mt-10 md:mt-0">
                <div className="border-[6px] border-[#1a1a1a] rounded-[2.8rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] bg-black ring-1 ring-white/10">
                  <img
                    src={codolioCardImg}
                    alt="mobile"
                    className="w-[170px] h-auto object-cover scale-105 -translate-x-2.5"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <PoweredByChip className="w-full" />

        <div className="py-24 overflow-hidden bg-transparent">
          <div className="text-center px-6 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold uppercase mb-2">
              Explore <span className="text-orange-500">Company-Wise</span>{" "}
              Sheets
            </h2>
            <p className="text-gray-400">
              Master DSA with curated questions from top tech giants
            </p>
          </div>

          <div className="relative">
            <div className="absolute top-0 left-0 bottom-0 w-32 bg-gradient-to-r from-black via-black/50 to-transparent z-10"></div>
            <div className="absolute top-0 right-0 bottom-0 w-32 bg-gradient-to-l from-black via-black/50 to-transparent z-10"></div>

            <div className="flex w-full justify-center">
              {/* {[...companies, ...companies].map((item, index) => (
                <div
                  key={index}
                  className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl min-w-[320px] hover:border-orange-500 transition-all hover:translate-y-[-5px] shadow-lg"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-md">
                      {item.icon}
                    </div>
                    <h3 className="text-xl font-bold">{item.name}</h3>
                  </div>
                  <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                    {item.desc}
                  </p>
                  <button className="text-orange-500 font-bold hover:underline text-sm uppercase tracking-wide">
                    <Link to="/company">View Sheet</Link>
                  </button>
                </div>
              ))} */}
              <CompanySheets show={false} />
            </div>
          </div>
        </div>
        {/* <ScrollVelocity
          texts={["Your Favourite Platforms", "Your Favourite Platforms"]}
          velocity={100}
          className="text-8xl font-bold text-white"
        /> */}
        <div className="py-24 px-6 max-w-7xl mx-auto relative -top-15">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Your Favourite Platforms
            </h2>
            <p className="text-gray-400 text-lg">
              Streamlined in{" "}
              <span className="text-orange-500 font-semibold">Kompile</span> to
              simplify your coding journey
            </p>
          </div>

          <div className="flex justify-center mb-24">
            <img
              src={codolioPlatformsImg}
              alt="platforms"
              className="w-full max-w-2xl drop-shadow-[0_0_30px_rgba(249,115,22,0.1)]"
            />
          </div>

          <div className="flex flex-col md:flex-row items-start gap-12 mb-16 max-w-7xl mx-auto px-6">
            <div className="md:w-1/2">
              <h3 className="text-4xl md:text-5xl font-bold mb-5 tracking-tight leading-tight">
                Simplify Your <span className="text-orange-500">Prep</span>
              </h3>
              <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-md">
                Say goodbye to last-minute stress. Track all your questions and
                notes in one place for easy review and revision.
              </p>
              <a
                href="#"
                className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-400 font-bold text-lg transition-colors"
              >
                Try Question Tracker <span>→</span>
              </a>
            </div>

            <div className="md:w-1/2 flex flex-wrap justify-center md:justify-end gap-10 pt-2">
              <div className="text-center w-[160px]">
                <div className="w-12 h-12 bg-gray-900 border border-gray-700 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <img
                    src={workspaceIcon}
                    alt="icon"
                    className="w-6 h-6 invert"
                  />
                </div>
                <h4 className="text-white font-bold text-base mb-1">
                  My Workspace
                </h4>
                <p className="text-gray-400 text-sm leading-snug">
                  Tag & filter questions for easy organization
                </p>
              </div>

              <div className="text-center w-[160px]">
                <div className="w-12 h-12 bg-gray-900 border border-gray-700 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <img
                    src={trackerIcon}
                    alt="icon"
                    className="w-6 h-6 invert"
                  />
                </div>
                <h4 className="text-white font-bold text-base mb-1">
                  Sheet Tracker
                </h4>
                <p className="text-gray-400 text-sm leading-snug">
                  Track all coding sheets in one place
                </p>
              </div>

              <div className="text-center w-[160px]">
                <div className="w-12 h-12 bg-gray-900 border border-gray-700 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <img src={notesIcon} alt="icon" className="w-6 h-6 invert" />
                </div>
                <h4 className="text-white font-bold text-base mb-1">
                  Enhanced Notes
                </h4>
                <p className="text-gray-400 text-sm leading-snug">
                  Add detailed notes to questions easily.
                </p>
              </div>
            </div>
          </div>

          <div className="w-full overflow-hidden pt-48 bg-transparent">
            <MacbookScroll
              title={<span></span>}
              src={workspaceGridImg}
              showGradient={false}
            />
          </div>
        </div>
        <section className="bg-transparent text-white px-6 py-24">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight">
                Your <span className="text-orange-500">All-in-One</span> Coding
                Portfolio
              </h2>

              <a
                href="#"
                className="text-blue-500 hover:underline font-semibold flex items-center gap-1"
              >
                Try Profile Tracker →
              </a>
            </div>

          <div className="w-4/5 mx-auto rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <img
              src="/assets/landingPage/dashboard.png"
              alt="Dashboard Preview"
              className="w-full h-auto object-cover"
            />
          </div>


            {/* <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              <div className="md:col-span-4 bg-[#111] border border-white/8 rounded-3xl p-5 flex flex-col">
                <p className="text-sm text-gray-300 font-semibold mb-4 text-center tracking-wide">
                  See cumulative questions solved
                </p>
                <div className="flex-1 flex items-center justify-center min-h-[160px]">
                  <img
                    src={cumulativeQuestionsImg}
                    alt="cumulative questions"
                    className="h-[160px] w-auto object-contain"
                  />
                </div>
              </div>

              <div className="md:col-span-8 bg-[#111] border border-white/8 rounded-3xl p-5 flex flex-col">
                <p className="text-sm text-gray-300 font-semibold mb-4 text-center tracking-wide">
                  Track your streak, across multiple platforms
                </p>
                <div className="flex-1 flex flex-row items-center gap-5 min-h-[160px]">
                  <div className="flex-none flex items-center justify-center h-[160px]">
                    <img
                      src={activeDaysImg}
                      alt="active days"
                      className="h-[160px] w-auto object-contain"
                    />
                  </div>

                  <div className="flex-1 h-[160px] flex items-center justify-center rounded-2xl overflow-hidden bg-white/[0.03] border border-white/5 p-3">
                    <img
                      src={heatmapImg}
                      alt="heatmap"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              </div>

              <div className="md:col-span-6 bg-[#111] border border-white/8 rounded-3xl p-5 flex flex-col">
                <p className="text-sm text-gray-300 font-semibold mb-4 text-center tracking-wide">
                  Identify your strengths and areas of improvement
                </p>
                <div className="flex-1 flex items-center justify-center min-h-[320px]">
                  <img
                    src={dsaAnalysisImg}
                    alt="dsa analysis"
                    className="w-full h-[320px] object-contain"
                  />
                </div>
              </div>

              <div className="md:col-span-6 bg-[#111] border border-white/8 rounded-3xl p-5 flex flex-col">
                <p className="text-sm text-gray-300 font-semibold mb-4 text-center tracking-wide">
                  Get classification of Problems solved
                </p>
                <div className="flex-1 flex items-center justify-center min-h-[320px]">
                  <img
                    src={classificationImg}
                    alt="classification"
                    className="w-full h-[320px] object-contain"
                  />
                </div>
              </div>

              <div className="md:col-span-6 bg-[#111] border border-white/8 rounded-3xl p-5 flex flex-col">
                <p className="text-sm text-gray-300 font-semibold mb-4 text-center tracking-wide">
                  Monitor your ratings in contests over time
                </p>
                <div className="flex-1 flex flex-col gap-4">
                  <div className="flex items-center justify-center h-[120px]">
                    <img
                      src={contestStatsImg}
                      alt="contest stats"
                      className="h-full w-auto object-contain"
                    />
                  </div>

                  <div className="flex-1 flex items-center justify-center rounded-2xl bg-white/[0.03] border border-white/5 p-3 min-h-[190px]">
                    <img
                      src={contestGraphImg}
                      alt="contest graph"
                      className="w-full h-[190px] object-contain"
                    />
                  </div>
                </div>
              </div>

              <div className="md:col-span-6 bg-[#111] border border-white/8 rounded-3xl p-5 flex flex-col">
                <p className="text-sm text-gray-300 font-semibold mb-4 text-center tracking-wide">
                  Showcase your Achievements
                </p>
                <div className="flex-1 flex flex-col gap-4">
                  <div className="flex items-center justify-center h-[120px] rounded-2xl bg-white/[0.03] border border-white/5 p-3">
                    <img
                      src={awardsImg}
                      alt="awards"
                      className="h-full w-auto object-contain"
                    />
                  </div>

                  <div className="flex-1 flex items-center justify-center rounded-2xl bg-white/[0.03] border border-white/5 p-3 min-h-[190px]">
                    <img
                      src={rankingsImg}
                      alt="rankings"
                      className="w-full h-[190px] object-contain"
                    />
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </section>
        <section className="bg-transparent text-white px-6 py-24">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight">
                Hub for your{" "}
                <span className="text-orange-500">Projects and Dev</span> Stats
              </h2>
              <a
                href="#"
                className="text-blue-500 hover:underline font-semibold flex items-center gap-1"
              >
                Try GitHub Tracker →
              </a>
            </div>

            <div className="flex justify-center">
              <img
                src={githubStatsHubImg}
                alt="github-stats-hub"
                className="w-full max-w-5xl max-h-[400px] rounded-2xl object-contain"
              />
            </div>
          </div>
        </section>
        <section className="bg-transparent text-white px-6 py-24">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
            <div className="md:w-1/2">
              <h2 className="text-5xl font-bold mb-6 tracking-tight leading-tight">
                Never Miss a Contest
              </h2>
              <p className="text-gray-400 text-xl mb-10 leading-relaxed">
                Track coding contests and set reminders with just one click.
              </p>
              <a
                href="#"
                className="text-blue-500 hover:underline font-bold text-lg flex items-center gap-2"
                onClick={() => navigate("/events")}
              >
                Try Event Tracker →
              </a>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative">
                <div className="absolute -inset-6 bg-orange-500/10 blur-3xl rounded-full" />
                <img
                  src={visibilityImg}
                  alt="calendar"
                  className="relative w-full max-w-[540px] h-auto rounded-2xl drop-shadow-[0_30px_60px_rgba(0,0,0,0.6)]"
                />
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </GridComponent>
    </div>
  );
}
