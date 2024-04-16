import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { ZegoSuperBoardManager } from "zego-superboard-web";
import { auth } from "../firebase-config";
import { useAuthState } from "react-firebase-hooks/auth";


function randomID(len: number) {
  let result = '';
  if (result) return result;
  var chars = '12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP',
    maxPos = chars.length,
    i;
  len = len || 5;
  for (i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return result;
}

export function getUrlParams(
  url = window.location.href
) {
  let urlStr = url.split('?')[1];
  return new URLSearchParams(urlStr);
}

export default function App() {
    const [user] = useAuthState(auth);
    const roomID = getUrlParams().get('roomID') || randomID(5);
    let myMeeting = async (element: any) => {
    // generate Kit Token
    const appID = 2074729971
    const serverSecret = "ee67fb0516821daa0bae096d9651b868";
    const kitToken =  ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, roomID, user?.email? user?.email: randomID(5),  randomID(5));


    // Create instance object from Kit Token.
    const zp = ZegoUIKitPrebuilt.create(kitToken);
    // start the call
    zp.addPlugins({ ZegoSuperBoardManager });
    zp.joinRoom({
        container: element,
        sharedLinks: [
          {
            name: 'Personal link',
            url:
             window.location.protocol + '//' +
             window.location.host + window.location.pathname +
              '?roomID=' +
              roomID,
          },
        ],
        scenario: {
          mode: ZegoUIKitPrebuilt.GroupCall, // To implement 1-on-1 calls, modify the parameter here to [ZegoUIKitPrebuilt.OneONoneCall].
        },
    });


  };

  return (
    <div
      className="myCallContainer"
      ref={myMeeting}
      style={{ width: '100vw', height: '100vh' }}
    ></div>
  );
}
