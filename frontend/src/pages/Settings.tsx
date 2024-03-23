import { useRef } from "react";
import Account from "../components/Settings_/account";
import Security from "../components/Settings_/security";
import Preference from "../components/Settings_/preference";
import SideBar from "../components/communities/CSettings/sidebar";
// import Privacy from './components/privacy';

function Settings() {
  const accountRef = useRef(null);
  const securityRef = useRef(null);
  const preferenceRef = useRef(null);
  const privacyRef = useRef(null);

  const scrollToSection = (section: string | number) => {
    const refs = {
      account: accountRef,
      security: securityRef,
      preferences: preferenceRef,
      privacy: privacyRef,
    };
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <div
        style={{
          width: "250px",
          position: "fixed", // Fixed position
          height: "100vh",
          overflowY: "auto", // Allows scrolling within the sidebar if content overflows
          backgroundColor: "#dcdcf6",
          boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
        }}
      >
        <SideBar onNavigate={scrollToSection} />
      </div>
      <div
        style={{
          flexGrow: 1,
          marginLeft: "250px", // Same as sidebar width to prevent overlap
          padding: "20px",
          overflowY: "auto",
        }}
      >
        <div ref={accountRef}>
          <Account />
        </div>
        <div ref={securityRef}>
          <Security />
        </div>
        <div ref={preferenceRef}>
          <Preference />
        </div>
      </div>
    </div>
  );
}

export default Settings;
