import React, { useState } from "react";
import { Flex } from "@chakra-ui/react";
import JoinedTeams from "../components/Teams/JoinedTeams";
import TeamDetails from "../components/Teams/TeamDetails"; // Import the TeamDetails component
import TeamsChat from "../components/Teams/TeamsChat";
import CreateJoin from "../components/Teams/CreateJoin";

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
        <>
          {inChat ? (
            <TeamsChat teamId={currentTeamId} />
          ) : (
            <TeamDetails
              teamId={currentTeamId}
              onChatsClick={handleChatClick}
            />
          )}
        </>
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
