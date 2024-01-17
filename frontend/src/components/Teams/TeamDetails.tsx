// import {
//   Avatar,
//   Flex,
//   Box,
//   Text,
//   Stack,
//   Badge,
//   Button,
// } from "@chakra-ui/react";

// const TeamDetails = () => {
//   return (
//     <div className="team-container">
//       <Flex className="team-header">
//         <Flex className="team-info">
//           <Avatar
//             className="team-avatar"
//             // src={userProfile.photoURL || "fallback_image_url"}
//             // name={userProfile.displayName}
//             borderRadius="10%" // Adjust this value as needed
//           />
//           <Box className="team-text">
//             <Text className="team-name">
//               {/* {userProfile.displayName || auth.currentUser?.displayName} */}
//               TeamName
//             </Text>
//             <Text className="team-description">
//               {/* {userProfile.description || "Your Description"} */}
//               <p>Description</p>
//             </Text>
//           </Box>
//         </Flex>

//         <Stack className="team-stats">
//           <Badge className="badge">7 Projects</Badge>
//           <Badge className="badge">11 Communities</Badge>
//           <Badge className="badge">4 Awards</Badge>
//         </Stack>

//         <Button className="leaderboard-button">Leaderboard</Button>
//       </Flex>
//       <Flex className="team-body">
//         {/* The commented out sections can be replaced with your components */}
//         {/* <DashboardSection title="Your Teams" items={teams} />
//         <DashboardSection title="Your Communities" items={communities} /> */}
//       </Flex>
//     </div>
//   );
// };

// export default TeamDetails;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../firebase-config";
import { doc, getDoc } from "firebase/firestore";
// ... other imports

const TeamDetails: React.FC = () => {
  const { teamId } = useParams<{ teamId: string }>(); // This gets the teamId from the URL
  const [teamDetails, setTeamDetails] = useState<String | null>(null);

  useEffect(() => {
    const fetchTeamDetails = async () => {
      if (teamId) {
        const teamDocRef = doc(db, "teams", teamId);
        const teamDocSnap = await getDoc(teamDocRef);

        if (teamDocSnap.exists()) {
          setTeamDetails(teamDocSnap.data() as String);
        } else {
          console.log("No such team!");
        }
      }
    };

    fetchTeamDetails();
  }, [teamId]);

  if (!teamDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {/* <h2>{teamDetails.name}</h2> */}
      works?
      {/* Render other details of the team */}
    </div>
  );
};

export default TeamDetails;
