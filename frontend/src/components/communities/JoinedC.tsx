import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../firebase-config";
import {
  getDoc,
  getDocs,
  collection,
  updateDoc,
  doc,
} from "firebase/firestore";
import "./JoinedC.scss"; // Update the import as per your CSS file
import { useNavigate } from "react-router-dom";
import { UseToastNotification } from "../../utils/UseToastNotification";
import { flexbox } from "@chakra-ui/react";

interface Community {
  id: string;
  name: string;
  description: string;
  role: string;
  members: string[];
  image: string | null;
  status: string;
}

const JoinedCommunities: React.FC = () => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [joinedCommunityIds, setJoinedCommunityIds] = useState<string[]>([]);
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const [filteredCommunities, setFilteredCommunities] = useState<Community[]>(
    []
  );

  const showToast = UseToastNotification();

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "communities"));
        const communitiesData: Community[] = [];

        querySnapshot.forEach((doc) => {
          const { id: communityId, ...communityData } = doc.data() as Community;
          // Filter communities by status
          communitiesData.push({ id: communityId, ...communityData });
        });

        setCommunities(communitiesData);
        setFilteredCommunities(communitiesData); // Initialize filteredCommunities with all communities

        // Fetch user data and add user's communities to joinedCommunityIds
        if (user?.email) {
          const userRef = doc(db, "users", user.email);
          const userDoc = await getDoc(userRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData?.communities) {
              setJoinedCommunityIds(userData.communities);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching communities:", error);
      }
    };

    fetchCommunities();
  }, [user?.email]);

  const handleRequestJoinClick = async (communityId: string) => {
    if (!user) return;

    if (user?.uid) {
      const communityRef = doc(db, "communities", communityId);
      const communityDoc = await getDoc(communityRef);

      if (communityDoc.exists()) {
        const communityData = communityDoc.data();
        const requestsArray = communityData?.requests ?? [];
        const membersArray = communityData?.members ?? [];

        // Check if the user has already requested to join
        if (!requestsArray.includes(user?.email)) {
          // Update the community document to add the user's UID to the requests array
          await updateDoc(communityRef, {
            requests: [...requestsArray, user?.email],
          });

          showToast("success", "Request to join sent successfully");
          // navigate(`/communities/in_communities/${encodeURIComponent(communityId)}`);
        } else {
          if (membersArray.includes(user?.email)) {
            showToast("info", "You are already in this community");
          } else {
            showToast(
              "info",
              "You have already requested to join this community"
            );
          }
        }
      }
    }
  };

  const handleJoinClick = async (communityId: string) => {
    if (!user) return;

    try {
      const userRef = doc(db, "users", user.email || "");
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const userCommunities = userData?.communities ?? [];

        if (!userCommunities.includes(communityId)) {
          // Update the user document to add the community ID to the communities array
          await updateDoc(userRef, {
            communities: [...userCommunities, communityId],
          });

          // Update the community document to add the user's UID to the members array
          const communityRef = doc(db, "communities", communityId);
          const communityDoc = await getDoc(communityRef);

          if (communityDoc.exists()) {
            const communityData = communityDoc.data();
            const communityMembers = communityData?.members ?? [];

            if (!communityMembers.includes(user.email)) {
              await updateDoc(communityRef, {
                members: [...communityMembers, user.email],
              });
            }
          }

          // Update the local state to reflect the changes
          setJoinedCommunityIds([...joinedCommunityIds, communityId]);

          showToast("success", "Joined community successfully");
        } else {
          showToast("info", "You are already in this community");
        }
      }
    } catch (error) {
      console.error("Error joining community:", error);
      showToast("error", "Error joining community");
    }
  };

  const handleCardClick = async (communityId: string) => {
    try {
      const communityRef = doc(db, "communities", communityId);
      const communityDoc = await getDoc(communityRef);
      const communityData = communityDoc.data() as Community | undefined;

      if (communityData?.status === "Private") {
        // If the community is private, check if the user is a member
        const useremail = user?.email;
        if (!useremail) {
          console.error("User not logged in.");
          return;
        }

        if (!communityData.members.includes(useremail)) {
          showToast("error", "You are not a member of this community.");
          return;
        }
      }

      // Navigate to the community page
      navigate(
        `/communities/in_communities/${encodeURIComponent(communityId)}`
      );
    } catch (error) {
      console.error("Error handling community card click:", error);
    }
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
            style={{
              backgroundImage: `url(${community.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
            onClick={() => handleCardClick(community.id)}
          >
            {/*
            {community.image && (
              <img
                src={community.image}
                alt={community.name}
                className="community-image"
              />
            )}
            */}
            
            <h3 className="community-name">{community.name}</h3>
            <p className="community-description">{community.description}</p>

            <button
              onClick={(e) => {
                e.stopPropagation();
                if (community.status === "Public") {
                  handleJoinClick(community.id);
                } else {
                  handleRequestJoinClick(community.id);
                }
              }}
              className={
                community.status === "Private"
                  ? joinedCommunityIds.includes(community.id)
                    ? "joined-button"
                    : "request-join-button"
                  : joinedCommunityIds.includes(community.id)
                  ? "joined-button"
                  : "join-button"
              }
            >
              {community.status === "Private"
                ? joinedCommunityIds.includes(community.id)
                  ? "Joined"
                  : "Request Join"
                : joinedCommunityIds.includes(community.id)
                ? "Joined"
                : "Join"}
            </button>
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
