import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
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
import { CompanySheets } from "./components/CompanyWiseKit/CompanySheets.jsx";
import UserData from "./components/UserData.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import Mysheets from "./components/workspace/mysheets/Mysheets.jsx";
import LoveBabbarSheet from "./components/workspace/sheetsDash/LoveBabbarSheet.jsx";
import StriversA2ZSheet from "./components/workspace/sheetsDash/StriversA2ZSheet.jsx";
import LoveBabbartopic from "./components/workspace/sheetsDash/LoveBabbartopic.jsx";

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(UserContext);
  if (!user || !user.email) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Home />} />
        <Route path="/company" element={<CompanyWiseKit />} />
        <Route path="/company/:companySlug" element={<CompanyDashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/events" element={<Contest />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user_data"
          element={
            <ProtectedRoute>
              <UserData />
            </ProtectedRoute>
          }
        />
        <Route path="/workspace" element={<Workspace />}>
          <Route index element={<WorkspaceHome />} />
          <Route path="sheets"                    element={<Mysheets />} />
          <Route path="sheets/love-babbar"              element={<LoveBabbarSheet />} />
          <Route path="sheets/love-babbar/:topicSlug"   element={<LoveBabbartopic />} />
          <Route path="sheets/strivers-a2z"             element={<StriversA2ZSheet />} />
          <Route path="community"                 element={<div className="text-white text-2xl font-bold">Community</div>} />
          <Route path="company-kit"               element={<CompanySheets show={true} />} />
          <Route path="bookmarks"                 element={<div className="text-white text-2xl font-bold">Bookmarks</div>} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
