import React, { useEffect, useState } from "react";
import { Avatar, Flex, Box, Text, Stack, Badge } from "@chakra-ui/react";
import { db } from "../../firebase-config";
import { doc, getDoc, DocumentData } from "firebase/firestore";
import "./TeamDetails.scss"; // Import the SCSS file
import { IoChatbubblesSharp } from "react-icons/io5";

interface TeamDetailsProps {
  teamId: string;
  onChatsClick: () => void;
}

const TeamDetails: React.FC<TeamDetailsProps> = ({
  teamId,
  onChatsClick,
}: TeamDetailsProps) => {
  const [teamDetails, setTeamDetails] = useState<DocumentData | null>(null);

  useEffect(() => {
    const fetchTeamDetails = async () => {
      try {
        const teamDocRef = doc(db, "teams", teamId);
        const teamDocSnapshot = await getDoc(teamDocRef);

        if (teamDocSnapshot.exists()) {
          setTeamDetails(teamDocSnapshot.data());
        }
      } catch (error) {
        console.error("Error fetching team details:", error);
      }
    };

    fetchTeamDetails();
  }, [teamId]);

  return (
    <div className="team-details-container">
      {teamDetails ? (
        <div className="profile-container">
          <Flex className="profile-header">
            <Flex className="profile-info">
              <Avatar
                className="profile-avatar"
                src={teamDetails.image || "fallback_image_url"}
                name={teamDetails.name}
                borderRadius="10%" // Adjust this value as needed
              />
              <Box className="profile-text">
                <Text className="profile-name">{teamDetails.name}</Text>
                <Text className="profile-description">
                  {teamDetails.description || "Your Description"}
                </Text>
              </Box>
            </Flex>

            <Stack className="profile-stats">
              <Badge className="badge">7 Projects</Badge>
              <Badge className="badge">11 Communities</Badge>
              <Badge className="badge">4 Awards</Badge>
            </Stack>
          </Flex>
          <Flex className="profile-body">
            <Flex className="top-titles">
              <Text className="projects-title">Projects</Text>
              <button className="invite-button">Invite Members</button>
            </Flex>
            <p className="no-documents-message">There are no documents yet.</p>
          </Flex>

          <div className="circular-button" onClick={onChatsClick}>
            <IoChatbubblesSharp />
          </div>
        </div>
      ) : (
        <p>Loading team details...</p>
      )}
    </div>
  );
};

export default TeamDetails;
