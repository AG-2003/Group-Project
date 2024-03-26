import { useRef } from "react";
import Account from "../components/Settings_/account";
import Security from "../components/Settings_/security";
import Preference from "../components/Settings_/preference";
import SideBar from "../components/Settings_/sideBar";
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
          flexGrow: 1,
          //marginLeft: "250px", // Same as sidebar width to prevent overlap
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
