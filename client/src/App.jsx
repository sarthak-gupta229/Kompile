import { Routes, Route, Navigate, useParams } from "react-router-dom";
import { useContext } from "react";
import MobileBlocker from "./components/MobileBlocker.jsx";
import { UserContext } from "./context/UserContext.jsx";
import Home from "./pages/app/Home.jsx";
import LandingPage from "./pages/LandingPage/LandingPage.jsx";
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import Profile from "./pages/profile/Profile.jsx";
import CompanyWiseKit from "./pages/CompanyWiseKit/CompanyWiseKit.jsx";
import CompanyDashboard from "./pages/CompanyWiseKit/CompanyDashboard.jsx";
import Contest from "./pages/event/Contest.jsx";
import Workspace from "./pages/Workspace/Workspace.jsx";
import WorkspaceHome from "./pages/Workspace/WorkspaceHome.jsx";
import WorkspaceCompanyKit from "./pages/Workspace/WorkspaceCompanyKit.jsx";
import { CompanySheets } from "./components/CompanyWiseKit/CompanySheets.jsx";
import UserData from "./components/Profile/UserData.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import Mysheets from "./components/workspace/mysheets/Mysheets.jsx";
import LoveBabbarSheet from "./components/workspace/sheetsDash/LoveBabbarSheet.jsx";
import StriversA2ZSheet from "./components/workspace/sheetsDash/StriversA2ZSheet.jsx";
import LoveBabbartopic from "./components/workspace/sheetsDash/LoveBabbartopic.jsx";
import Community from "./components/workspace/community/Community.jsx";
import Room from "./components/workspace/room/Room.jsx";
import RoomSpace from "./components/workspace/room/RoomSpace.jsx";
import Bookmarks from "./components/workspace/Bookmarks.jsx";

const ProtectedRoute = ({ children }) => {
  const { user, isAuthLoading } = useContext(UserContext);

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500" />
      </div>
    );
  }

  if (!user || !user.email) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const PublicRoute = ({ children }) => {
  const { user, isAuthLoading } = useContext(UserContext);

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500" />
      </div>
    );
  }

  if (user && user.email) {
    return <Navigate to="/workspace" replace />;
  }
  return children;
};

const RedirectToWorkspaceCompanyKit = () => {
  const { companySlug } = useParams();
  return <Navigate to={`/workspace/company-kit/${companySlug}`} replace />;
};

function App() {
  return (
    <>
      <MobileBlocker />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Home />} />
        <Route path="/company" element={<CompanyWiseKit />} />
        <Route
          path="/company/:companySlug"
          element={
            <ProtectedRoute>
              <RedirectToWorkspaceCompanyKit />
            </ProtectedRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route path="/events" element={<Contest />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="/profile/:username" element={<Profile />} />
        <Route
          path="/user_data"
          element={
            <ProtectedRoute>
              <UserData />
            </ProtectedRoute>
          }
        />
        <Route
          path="/workspace"
          element={
            <ProtectedRoute>
              <Workspace />
            </ProtectedRoute>
          }
        >
          <Route index element={<WorkspaceHome />} />
          <Route path="sheets" element={<Mysheets />} />
          <Route path="sheets/love-babbar-450" element={<LoveBabbarSheet />} />
          <Route
            path="sheets/love-babbar-450/:topicSlug"
            element={<LoveBabbartopic />}
          />
          <Route path="sheets/strivers-a2z" element={<StriversA2ZSheet />} />
          <Route path="profile" element={<Profile />} />
          <Route path="profile/:username" element={<Profile />} />
          <Route path="community" element={<Community />} />
          <Route path="room" element={<Room />} />
          <Route path="room/:roomId" element={<RoomSpace />} />
          <Route path="company-kit" element={<WorkspaceCompanyKit />} />
          <Route
            path="company-kit/:companySlug"
            element={<CompanyDashboard />}
          />
          <Route path="bookmarks" element={<Bookmarks />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
