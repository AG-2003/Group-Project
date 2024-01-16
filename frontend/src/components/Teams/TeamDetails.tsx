// // TeamDetails.tsx
// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom"; // Import useParams
// import { db } from "../../firebase-config";
// import { doc, getDoc, DocumentData } from "firebase/firestore";

// interface Team {
//   id: string;
//   name: string;
//   description: string;
//   role: string;
//   members: string[];
//   image: string | null;
// }

// const TeamDetails: React.FC = () => {
//   const { teamId } = useParams();
//   const [team, setTeam] = useState<Team | null>(null);

//   useEffect(() => {
//     const fetchTeamDetails = async () => {
//       try {
//         const teamDocRef = doc(db, teams, teamId); // Replace "teams" with your collection name
//         const teamDocSnapshot = await getDoc(teamDocRef);

//         if (teamDocSnapshot.exists()) {
//           const teamData = teamDocSnapshot.data() as Team;
//           setTeam(teamData);
//         } else {
//           console.log("Team not found");
//         }
//       } catch (error) {
//         console.error("Error fetching team details:", error);
//       }
//     };

//     fetchTeamDetails();
//   }, [teamId]);

//   if (!team) {
//     // Handle the case when team details are still loading or not found
//     return <div>Loading team details...</div>;
//   }

//   return (
//     <div>
//       <h2>{team.name}</h2>
//       <p>Description: {team.description}</p>
//       <p>Role: {team.role}</p>
//       {/* Render other details of the team as needed */}
//     </div>
//   );
// };

// export default TeamDetails;

import React from "react";

const TeamDetails = () => {
  return <div>TeamDetails</div>;
};

export default TeamDetails;
