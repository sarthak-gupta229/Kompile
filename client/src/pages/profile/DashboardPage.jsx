import KompileCard from "../../components/Profile/subprofiles/KompileCard.jsx";

export default function DashboardPage({ userStats }) {
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-[#0a0a0a] text-white">
      <KompileCard stats={userStats} />
    </div>
  );
}

