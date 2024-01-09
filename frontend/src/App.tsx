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

import "draft-js/dist/Draft.css";

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
      </Route>
      <Route path="/Doc" element={<Doc />} />
      <Route path="/Board" element={<Whiteboard />} />;
      <Route path="/chat" element={<QuickChat />} />;
    </Routes>
  );
}

export default App;
