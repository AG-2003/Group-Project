import { useState } from "react";
import { IoIosCreate } from "react-icons/io";
import { HiMiniUserGroup } from "react-icons/hi2";
import "./CreateJoin.scss";
import CreateTeamModal from "./TeamModal";
import { auth, db } from "../../firebase-config";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { UseToastNotification } from "../../utils/UseToastNotification";

interface TeamData {
  id: string;
  name: string;
  description: string;
  role: string;
  members: string[];
  image: string | null; // Store image URL instead of File
  chatId: string;
  creator: string;
  admins: string[];
  specialID: string;
}

const CreateJoin = () => {
  const [isCreateTeamModalOpen, setCreateTeamModalOpen] = useState(false);
  const [teamCodeInput, setTeamCodeInput] = useState("");
  const [user] = useAuthState(auth);
  const showToast = UseToastNotification();

  const handleCreateTeamClick = () => {
    setCreateTeamModalOpen(true);
  };

  const handleCloseCreateTeamModal = () => {
    setCreateTeamModalOpen(false);
  };

  const handleInputChange = (e: any) => {
    setTeamCodeInput(e.target.value);
  };

  const handleJoinTeam = async () => {
    try {
      // get the user
      const userMail = user?.email;

      try {
        const teamsRef = collection(db, "teams");
        const querySnapshot = await getDocs(teamsRef);
        let teamFound = false;
        let teamid = "";

        querySnapshot.forEach(async (doc) => {
          const teamData = doc.data() as TeamData;
          if (teamData.specialID === teamCodeInput) {
            teamFound = true;
            teamid = teamData.id;
            const updatedMembers = [...teamData.members, userMail];
            await updateDoc(doc.ref, { members: updatedMembers });

            console.log("Team joined successfully.");
            showToast("success", "Team joined successfully");
          }
        });

        if (!teamFound) {
          console.error("Team does not exist.");
          showToast("error", "Team does not exist");
        } else {
          if (userMail) {
            // for invite
            const memberDocRef = doc(db, "users", userMail);
            const memberDocSnapshot = await getDoc(memberDocRef);

            if (memberDocSnapshot.exists()) {
              // Add the team to the user's teams array
              await updateDoc(memberDocRef, {
                teams: [...(memberDocSnapshot.data()?.teams || []), teamid],
              });
              window.location.reload();
            }
          }
        }
      } catch (error) {
        console.error("Error joining team:", error);
      }
    } catch (error) {
      console.error("Error joining team:", error);
      showToast("error", "Error in joining team");
    }
  };
  return (
    <>
      <h2 className="projects-heading">Create or Join a Team</h2>
      <div className="containerCreateJoin">
        <div className="team-box" onClick={handleCreateTeamClick}>
          <div className="icon-container">
            <IoIosCreate />
          </div>
          <div className="team-info">
            <h2>Create a team</h2>
            <p>Bring everyone together and get to work</p>
          </div>
        </div>

        <div className="team-box">
          <div className="icon-container">
            <HiMiniUserGroup />
          </div>
          <div className="team-info" onClick={() => handleJoinTeam()}>
            <h2>Join a team</h2>
            <input
              type="text"
              placeholder="Enter code"
              className="input-field"
              value={teamCodeInput}
              onClick={(e) => e.stopPropagation()}
              onChange={handleInputChange} // Handle input change
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleJoinTeam(); // Join team when Enter key is pressed
                }
              }}
            />
          </div>
        </div>
        <CreateTeamModal
          isOpen={isCreateTeamModalOpen}
          onClose={handleCloseCreateTeamModal}
        />
      </div>
    </>
  );
};

export default CreateJoin;
