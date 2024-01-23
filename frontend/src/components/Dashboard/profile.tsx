import React, { useState, useEffect } from "react";
import {
  Flex,
  Text,
  Badge,
  Stack,
  Avatar,
  Button,
  Box,
} from "@chakra-ui/react";
import { auth, db } from "../../firebase-config";
import { UseUserProfilePic } from "../../hooks/UseUserProfilePic";
import "./Profile.scss"; // Make sure this path is correct
import { doc, getDoc } from "firebase/firestore";

const Profile: React.FC = () => {
  const userProfile = UseUserProfilePic();

  const [userDescription, setUserDescription] = useState<string>('');

  useEffect(() => {
    const fetchDescription = async () => {
      if (auth.currentUser) {
        const userRef = doc(db, "users", auth.currentUser.email as string);
        try {
          const docSnap = await getDoc(userRef);
          if (docSnap.exists() && docSnap.data().desc) {
            setUserDescription(docSnap.data().desc);
          } else {
            setUserDescription('No description set.');
          }
        } catch (error) {
          console.error("Error fetching user description:", error);
          setUserDescription('Failed to fetch description.');
        }
      }
    };

    fetchDescription();
  }, []);



  return (
    <div className="profile-container">
      <Flex className="profile-header">
        <Flex className="profile-info">
          <Avatar
            className="profile-avatar"
            src={userProfile.photoURL || "fallback_image_url"}
            name={userProfile.displayName}
            borderRadius="10%" // Adjust this value as needed
          />
          <Box className="profile-text">
            <Text className="profile-name">
              {userProfile.displayName || auth.currentUser?.displayName}
            </Text>
            <Text className="profile-description">

              <p style={{ color: 'black' }}>{userDescription}</p>
            </Text>
          </Box>
        </Flex>

        <Stack className="profile-stats">
          <Badge className="badge">7 Projects</Badge>
          <Badge className="badge">11 Communities</Badge>
          <Badge className="badge">4 Awards</Badge>
        </Stack>

        <Button className="leaderboard-button">Leaderboard</Button>
      </Flex>
      <Flex className="profile-body">
        {/* The commented out sections can be replaced with your components */}
        {/* <DashboardSection title="Your Teams" items={teams} />
        <DashboardSection title="Your Communities" items={communities} /> */}
      </Flex>
    </div >
  );
};

export default Profile;
