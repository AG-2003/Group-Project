import { useState } from "react";
import { IoIosCreate } from "react-icons/io";
import { HiMiniUserGroup } from "react-icons/hi2";
import "./CreateJoin.scss";
import CreateCModal from "./CModal";

const CreateCommunity = () => {
  const [isCreateTeamModalOpen, setCreateTeamModalOpen] = useState(false);

  const handleCreateTeamClick = () => {
    setCreateTeamModalOpen(true);
  };

  const handleCloseCreateTeamModal = () => {
    setCreateTeamModalOpen(false);
  };

  return (
    <>
      <h2 className="projects-heading">Create a Community</h2>
      <div className="containerCreateJoin">
        <div className="team-box" onClick={handleCreateTeamClick}>
          <div className="icon-container">
            <IoIosCreate size={32} />
          </div>
          <div className="team-info">
            <h2>Create a Community</h2>
            <p>Bring everyone together and get to work</p>
          </div>
        </div>

        <CreateCModal
          isOpen={isCreateTeamModalOpen}
          onClose={handleCloseCreateTeamModal}
        />
      </div>
    </>
  );
};

export default CreateCommunity;
