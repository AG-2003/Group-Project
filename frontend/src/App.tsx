import { Route, Routes } from "react-router-dom";
import { Login } from "./pages/Auth/Login";
import { EmailLogin } from "./pages/Auth/EmailLogin";
import { LoginPassword } from "./pages/Auth/LoginPassword";
import { ForgotPassword } from "./pages/Auth/ForgotPassword";
import { SignUpEmail } from "./pages/Auth/SignUpEmail";
import { SignUpPassword } from "./pages/Auth/SignUpPassword";
import { NewPassword } from "./pages/Auth/NewPassword";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import Landing from "./pages/Landing";
import ProtectedRoutes from "./RoutingSecurity/ProtectedRoutes";
import Doc from "./pages/Doc";
import Whiteboard from "./pages/Whiteboard";
import Spreadsheet from "./pages/Spreadsheet";

import "draft-js/dist/Draft.css";
import QuickChat from "./pages/QuickChat";
import Projects from "./components/Dashboard/projects";

function App() {
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
      <Route element={<ProtectedRoutes />}>
        <Route path="/index" element={<Dashboard />} />
        <Route path="/Settings" element={<Settings />} />
        <Route path="/chat" element={<QuickChat />} />;
        <Route path="/doc/*" element={<Doc />} />
        <Route path="/Board" element={<Whiteboard />} />;
        <Route path="/Sheet" element={<Spreadsheet />} />;
        <Route path="/Projects" element={<Projects />} />
      </Route>
    </Routes>
  );
}

export default App;

// import Call from "./pages/Call";

// function App() {
//   return <Call />;
// }

// export default App;
