// TeamDetails.tsx

import React, { useEffect, useState } from "react";
import { Avatar, Flex, Box, Text, Stack, Badge } from "@chakra-ui/react";
import { db } from "../../firebase-config";
import {
  doc,
  getDoc,
  DocumentData,
  DocumentReference,
} from "firebase/firestore";
import "./TeamDetails.scss"; // Import the SCSS file
import { IoChatbubblesSharp } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import InvModal from "./InvModal";

const TeamDetails: React.FC = () => {
  const [teamDetails, setTeamDetails] = useState<DocumentData | null>(null);
  let { team_id } = useParams();
  const navigate = useNavigate();

  if (team_id) {
    team_id = decodeURIComponent(team_id);
  }

  const handleChatClick = (teamId: string) => {
    navigate(`/In_teams/chat/${encodeURIComponent(teamId)}`);
  };

  useEffect(() => {
    const fetchTeamDetails = async () => {
      try {
        if (team_id) {
          // Ensure teamId is defined before creating the DocumentReference
          const teamDocRef: DocumentReference<DocumentData> = doc(
            db,
            "teams",
            team_id
          );
          const teamDocSnapshot = await getDoc(teamDocRef);

          if (teamDocSnapshot.exists()) {
            setTeamDetails(teamDocSnapshot.data());
          }
        }
      } catch (error) {
        console.error("Error fetching team details:", error);
      }
    };

    fetchTeamDetails();
  }, [team_id]);

  // inv stuff
  const [isInvModalOpen, setInvModalOpen] = useState(false);

  const handleInvClick = () => {
    setInvModalOpen(true);
  };

  const handleInvModalClose = () => {
    setInvModalOpen(false);
  };

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
              <Badge className="badge">0 Projects</Badge>
              <Badge className="badge">
                {teamDetails.members.length + 1} Members
              </Badge>
              <Badge className="badge">0 Awards</Badge>
            </Stack>
          </Flex>
          <Flex className="profile-body">
            <Flex className="top-titles">
              <Text className="projects-title">Projects</Text>
              <button className="invite-button" onClick={handleInvClick}>
                Invite Members
              </button>
            </Flex>
            <p className="no-documents-message">There are no documents yet.</p>
          </Flex>
          {/* chat onclick goes here */}

          <div
            className="circular-button"
            onClick={() => {
              if (team_id) {
                handleChatClick(team_id);
              }
            }}
          >
            <IoChatbubblesSharp />
          </div>

          <InvModal
            teamId={team_id}
            isOpen={isInvModalOpen}
            onClose={handleInvModalClose}
          />
        </div>
      ) : (
        <p>Loading team details...</p>
      )}
    </div>
  );
};

export default TeamDetails;
