import { Badges } from "./components/Badges";
import { Route, Routes } from "react-router-dom";
import { Login } from "./pages/Auth/Login";
import { EmailLogin } from "./pages/Auth/EmailLogin";
import { LoginPassword } from "./pages/Auth/LoginPassword";
import { ForgotPassword } from "./pages/Auth/ForgotPassword";
import { SignUpEmail } from "./pages/Auth/SignUpEmail";
import { SignUpPassword } from "./pages/Auth/SignUpPassword";
import { NewPassword } from "./pages/Auth/NewPassword";
import Policies from "./pages/Policies"
// import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import Landing from "./pages/Landing";
import ProtectedRoutes from "./RoutingSecurity/ProtectedRoutes";
import Doc from "./pages/Doc";
import Whiteboard from "./pages/Whiteboard";
import Spreadsheet from "./pages/Spreadsheet";

import "draft-js/dist/Draft.css";
// import QuickChat from "./pages/QuickChat";
import Projects from "./components/Dashboard/projects";
import Profile from "./components/Dashboard/profile";
import Teams from "./components/Dashboard/Teams";
import Trash from "./pages/Trash";
import Social from "./pages/Social";
// import Templates from "./pages/Templates";
// import TeamDetails from "./components/Teams/TeamDetails";
import QuickChat from "./pages/Chat";
import TeamDetails from "./components/Teams/TeamDetails";
import TeamsChat from "./components/Teams/TeamsChat";
import Call from "./pages/Call";
import Communities from "./pages/Communities";
import CDetails from "./components/communities/CDetails";
import { reportWebVitals } from "./utils/WebVitals";
import { useEffect } from "react";
import { BadgesPage } from "./pages/BadgesPage";
import { Calendar } from "./pages/Calendar";
import SavedPosts from "./components/communities/SavedPosts";
import AllPosts from "./components/communities/AllPosts";
import YourPosts from "./components/communities/YourPosts";
import { Friends } from "./pages/Friends";
import CSettings from "./components/communities/CSettings/CSettings";
import ChatRoom from "./components/UserChat/ChatRoom";




function App() {
  useEffect(() => {
    reportWebVitals((metric) => {
      console.log(metric);
    });
  }, []);

  return (
    <Routes>
      <Route index element={<Landing />} />
      <Route path="/auth" element={<Login />} />
      <Route path="/loginEmail" element={<EmailLogin />} />
      <Route path="/loginPassword" element={<LoginPassword />} />
      <Route path="/forgotPwd" element={<ForgotPassword />} />
      <Route path="/signUpEmail" element={<SignUpEmail />} />
      <Route path="/signUpPwd" element={<SignUpPassword />} />
      <Route path="/newPwd" element={<NewPassword />} />
      <Route path="/policy" element={<Policies />} />
      <Route element={<ProtectedRoutes />}>
        <Route path="/index" element={<Profile />} />
        <Route path="/Settings" element={<Settings />} />
        <Route path="/chat" element={<QuickChat />} />
        <Route path="/doc/*" element={<Doc />} />
        <Route path="/board/*" element={<Whiteboard />} />
        <Route path="/sheet/*" element={<Spreadsheet />} />
        {/* ---- */}
        <Route path="/Projects" element={<Projects />} />
        <Route path="/Home" element={<Profile />} />
        <Route path="/Teams" element={<Teams />} />
        <Route path="/Social" element={<Social />} />
        <Route path="/badges" element={<BadgesPage />} />
        <Route path="/friends" element={<Friends />} />
        <Route path="/chat/:chatId" element={<ChatRoom />} />
        <Route path="/calendar" element={<Calendar />} />
        {/* <Route path="/Templates" element={<Templates />} /> */}
        <Route path="/Trash" element={<Trash />} />
        <Route path="/board/*" element={<Whiteboard />} />;
        <Route path="/Sheet" element={<Spreadsheet />} />;
        <Route path="/Teams/In_teams/:team_id" element={<TeamDetails />} />
        <Route path="/In_teams/chat/:team_id" element={<TeamsChat />} />
        <Route path="/meeting" element={<Call />} />
        <Route path="/communities" element={<Communities />} />
        <Route
          path="/communities/in_communities/:community_id"
          element={<CDetails />}
        />
        <Route path="/communities/saved_posts" element={<SavedPosts />} />
        <Route path="/communities/all_posts" element={<AllPosts />} />
        <Route path="/communities/your_posts" element={<YourPosts />} />
        <Route
          path="/communities/in_communities/:community_id/settings"
          element={<CSettings />}
        />
      </Route>
    </Routes>
  );
}

export default App;
