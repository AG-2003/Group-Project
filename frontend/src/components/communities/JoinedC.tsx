import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../firebase-config";
import { getDocs, collection } from "firebase/firestore";
import "./JoinedC.scss"; // Update the import as per your CSS file
import { useNavigate } from "react-router-dom";

interface Community {
  id: string;
  name: string;
  description: string;
  role: string;
  members: string[];
  image: string | null;
}

const JoinedCommunities: React.FC = () => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const [filteredCommunities, setFilteredCommunities] = useState<Community[]>(
    []
  );

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const querySnapshot = await getDocs(
          collection(db, "public_communities")
        );
        const communitiesData: Community[] = [];

        querySnapshot.forEach((doc) => {
          communitiesData.push({ id: doc.id, ...doc.data() } as Community);
        });

        setCommunities(communitiesData);
        setFilteredCommunities(communitiesData); // Initialize filteredCommunities with all communities
      } catch (error) {
        console.error("Error fetching communities:", error);
      }
    };

    fetchCommunities();
  }, []);

  // Function to handle click on a community card
  const handleCardClick = (communityId: string) => {
    // Use the onCommunityClick prop to notify the parent component
    // onCommunityClick(communityId);

    navigate(`/Communities/In_communities/${encodeURIComponent(communityId)}`);
  };

  // Function to handle search input change
  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const searchTerm = event.target.value.toLowerCase();
    const filtered = communities.filter((community) =>
      community.name.toLowerCase().includes(searchTerm)
    );
    setFilteredCommunities(filtered);
  };

  return (
    <div className="communities-container">
      <div className="heading-container">
        <h2 className="heading">Discover Communities</h2>
        {/* Search input */}
        <input
          type="text"
          placeholder="Search communities..."
          onChange={handleSearchInputChange}
          className="search-input"
        />
      </div>
      <div className="communities-list">
        {filteredCommunities.map((community) => (
          <div
            key={community.id}
            className="community-card"
            onClick={() => handleCardClick(community.id)}
          >
            {community.image && (
              <img
                src={community.image}
                alt={community.name}
                className="community-image"
              />
            )}
            <h3 className="community-name">{community.name}</h3>
            <p className="community-description">{community.description}</p>
          </div>
        ))}
        {filteredCommunities.length === 0 && (
          <div className="no-community-message-container">
            <p className="message">No matching communities found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JoinedCommunities;
