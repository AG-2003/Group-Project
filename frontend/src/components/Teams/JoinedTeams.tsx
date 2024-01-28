import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../firebase-config";
import { doc, getDoc, DocumentData } from "firebase/firestore";
import "./JoinedTeams.scss"; // Update the import as per your CSS file
import { useNavigate } from "react-router-dom";

interface Team {
  id: string;
  name: string;
  description: string;
  role: string;
  members: string[];
  image: string | null;
}

interface JoinedTeamsProps {
  onTeamClick: (teamId: string) => void;
}

const JoinedTeams: React.FC<JoinedTeamsProps> = ({
  onTeamClick,
}: JoinedTeamsProps) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeams = async () => {
      if (user?.email) {
        const userDocRef = doc(db, "users", user.email);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data() as DocumentData;
          const userTeams = userData.teams || [];

          // Fetch team details from "teams" collection based on team IDs
          const teamsPromises = userTeams.map(async (teamId: string) => {
            const teamDocRef = doc(db, "teams", teamId);
            const teamDocSnapshot = await getDoc(teamDocRef);
            return teamDocSnapshot.exists() ? teamDocSnapshot.data() : null;
          });

          // Wait for all promises to resolve
          const teamsData = await Promise.all(teamsPromises);

          // Filter out null values (teams that do not exist)
          const validTeams = teamsData.filter(
            (team) => team !== null
          ) as Team[];

          setTeams(validTeams);
        }
      }
    };

    fetchTeams();
  }, [user]);

  // Function to handle click on a team card
  const handleCardClick = (teamId: string) => {
    // Use the onTeamClick prop to notify the parent component
    onTeamClick(teamId);
    // navigate("/in_team/:param1", {
    //   state: {
    //     param1: teamId,
    //   },
    // });
  };

  return (
    <div className="teams-container">
      <div className="heading-container">
        <h2 className="heading">Your Teams</h2>
      </div>
      <div className="teams-list">
        {teams.map((team) => (
          <div
            key={team.id}
            className="team-card"
            onClick={() => handleCardClick(team.id)}
          >
            {team.image && (
              <img src={team.image} alt={team.name} className="team-image" />
            )}
            <h3 className="team-name">{team.name}</h3>
            <p className="team-description">{team.description}</p>
          </div>
        ))}
        {teams.length === 0 && (
          <div className="no-team-message-container">
            <p className="message">You are not in any teams.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JoinedTeams;
