import React, { useState } from "react";
import { JitsiMeeting } from "@jitsi/react-sdk";
import "./Call.scss";

const Call = () => {
  const [startCall, setStartCall] = useState(false);

  return (
    <div className="jitsi-container">
      {!startCall && (
        <button
          className="start-call-button"
          onClick={() => setStartCall(true)}
        >
          Start Call
        </button>
      )}

      {startCall && (
        <JitsiMeeting
          domain="meet.jit.si"
          roomName="PleaseUseAGoodRoomName"
          configOverwrite={{
            startWithAudioMuted: true,
            disableModeratorIndicator: true,
            startScreenSharing: true,
            enableEmailInStats: false,
          }}
          interfaceConfigOverwrite={{
            DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
          }}
          userInfo={{
            displayName: "YOUR_USERNAME",
            email: "YOUR_EMAIL",
          }}
          onApiReady={(externalApi) => {
            // You can use the externalApi here
          }}
          getIFrameRef={(iframeRef) => {
            iframeRef.style.height = "400px";
            iframeRef.style.width = "100%";
          }}
        />
      )}
    </div>
  );
};

export default Call;
