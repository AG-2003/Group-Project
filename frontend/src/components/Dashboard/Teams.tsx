import React, { useState } from "react";
import { Flex } from "@chakra-ui/react";
import JoinedTeams from "../Teams/JoinedTeams";
import TeamDetails from "../Teams/TeamDetails"; // Import the TeamDetails component
import TeamsChat from "../Teams/TeamsChat";
import CreateJoin from "../Teams/CreateJoin";
// import CreateJoin from "../Teams/CreateJoin";
// import JoinedTeams from "../Teams/JoinedTeams";

const Teams = () => {
  const [currentTeamId, setCurrentTeamId] = useState<string | null>(null);
  const [inChat, setInChat] = useState(false);

  const handleTeamClick = (teamId: string) => {
    // Update the current team ID when a team is clicked
    setCurrentTeamId(teamId);
  };

  const handleChatClick = () => {
    setInChat(!inChat);
  };

  return (
    <Flex direction="column" height="100vh" p={8}>
      {/* Conditionally render either JoinedTeams or TeamDetails based on currentTeamId */}

      {currentTeamId ? (
        <>{inChat ? <TeamsChat /> : <TeamDetails />}</>
      ) : (
        <>
          <CreateJoin />
          <JoinedTeams onTeamClick={handleTeamClick} />
        </>
      )}
    </Flex>
  );
};

export default Teams;
