import { useState } from "react";
import { IoIosCreate } from "react-icons/io";
import { HiMiniUserGroup } from "react-icons/hi2";
import "./CreateJoin.scss";
import CreateTeamModal from "./TeamModal";

const CreateJoin = () => {
  const [isCreateTeamModalOpen, setCreateTeamModalOpen] = useState(false);

  const handleCreateTeamClick = () => {
    setCreateTeamModalOpen(true);
  };

  const handleCloseCreateTeamModal = () => {
    setCreateTeamModalOpen(false);
  };

  return (
    <>
      <h2 className="projects-heading">Create or Join a Team</h2>
      <div className="containerCreateJoin">
        <div className="team-box" onClick={handleCreateTeamClick}>
          <div className="icon-container">
            <IoIosCreate size={32} />
          </div>
          <div className="team-info">
            <h2>Create a team</h2>
            <p>Bring everyone together and get to work</p>
          </div>
        </div>

        <div className="team-box">
          <div className="icon-container">
            <HiMiniUserGroup size={32} />
          </div>
          <div className="team-info">
            <h2>Join a team</h2>
            <input
              type="text"
              placeholder="Enter code"
              className="input-field"
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
